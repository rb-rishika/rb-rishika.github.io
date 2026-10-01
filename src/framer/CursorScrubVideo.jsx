import { useEffect, useMemo, useRef, useState } from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * CursorScrubVideo
 * ────────────────────────────────────────────────────────────────────────────
 * Renders a video whose playhead is driven by cursor position instead of by
 * normal playback. Moving the cursor along the chosen axis scrubs through the
 * clip, with an eased (lerped) playhead so motion feels weighted rather than
 * snapping frame to frame.
 *
 * ⚠️ FRAME-ACCURATE PLAYBACK REQUIREMENT
 * ────────────────────────────────────────────────────────────────────────────
 * For buttery scrubbing, the uploaded video MUST be encoded with EVERY FRAME
 * AS A KEYFRAME. Browsers can only seek instantly to keyframes; with a normal
 * GOP (~every 250 frames) each seek has to decode from the previous keyframe,
 * which produces visible stutter and lag while scrubbing.
 *
 * Re-encode your clip first:
 *
 *   ffmpeg -i in.mp4 -c:v libx264 -preset slow -crf 18 -g 1 -keyint_min 1 \
 *     -x264-params "scenecut=0" -profile:v high -pix_fmt yuv420p \
 *     -movflags +faststart -an out.mp4
 *
 * The flags that matter: `-g 1 -keyint_min 1` force a keyframe on every frame,
 * `scenecut=0` stops x264 inserting its own extra keyframes, `+faststart`
 * moves the moov atom to the front so playback can begin before the full file
 * downloads, and `-an` drops the audio track (unused — the video is muted).
 *
 * Expect the output file to be several times larger than the source. Keep the
 * clip short (2–6s) and modestly sized (≤1080p) to keep it web-friendly.
 *
 * @framerIntrinsicWidth 400
 * @framerIntrinsicHeight 300
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function CursorScrubVideo(props) {
    const {
        videoFile,
        axis = "horizontal",
        reverse = false,
        trackingArea = "component",
        smoothing = 0.22,
        objectFit = "cover",
        showPoster = true,
        borderRadius = 0,
        style,
    } = props

    const rootRef = useRef(null)
    const videoRef = useRef(null)

    // Normalized cursor target on the active axis, 0–1.
    const targetPosRef = useRef(0)
    // The eased playhead, in seconds. Lerped toward the target each frame.
    const currentTimeRef = useRef(0)
    // True between `seeking` and `seeked` — we never stack seeks.
    const seekingRef = useRef(false)
    const rafRef = useRef(null)
    const readyRef = useRef(false)

    const [isReady, setIsReady] = useState(false)

    // Framer hands us either a URL string or a File-ish object depending on
    // how the asset was added. Normalize both, and revoke any URL we minted.
    const { src, isObjectURL } = useMemo(() => {
        if (!videoFile) return { src: "", isObjectURL: false }
        if (typeof videoFile === "string") {
            return { src: videoFile, isObjectURL: false }
        }
        if (typeof URL !== "undefined" && videoFile instanceof Blob) {
            return { src: URL.createObjectURL(videoFile), isObjectURL: true }
        }
        return { src: String(videoFile), isObjectURL: false }
    }, [videoFile])

    useEffect(() => {
        return () => {
            if (isObjectURL && src) URL.revokeObjectURL(src)
        }
    }, [src, isObjectURL])

    // ── Buffer the video and wait for decodable frames ──────────────────────
    useEffect(() => {
        const video = videoRef.current
        if (!video || !src) return

        readyRef.current = false
        setIsReady(false)
        currentTimeRef.current = 0
        seekingRef.current = false

        const onCanPlayThrough = () => {
            readyRef.current = true
            setIsReady(true)
        }
        const onSeeking = () => {
            seekingRef.current = true
        }
        const onSeeked = () => {
            seekingRef.current = false
        }

        video.addEventListener("canplaythrough", onCanPlayThrough)
        video.addEventListener("seeking", onSeeking)
        video.addEventListener("seeked", onSeeked)

        video.load()

        // A silent play/pause forces the browser to actually decode frames.
        // Permitted without a user gesture because the element is muted.
        const warm = video.play()
        if (warm && typeof warm.then === "function") {
            warm.then(() => video.pause()).catch(() => {})
        }

        // Pin to the first frame until scrubbing is enabled.
        try {
            video.currentTime = 0
        } catch (e) {
            /* some browsers throw if metadata isn't loaded yet */
        }

        return () => {
            video.removeEventListener("canplaythrough", onCanPlayThrough)
            video.removeEventListener("seeking", onSeeking)
            video.removeEventListener("seeked", onSeeked)
        }
    }, [src])

    // ── Cursor tracking ─────────────────────────────────────────────────────
    useEffect(() => {
        if (!src) return

        const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)

        const handleWindowMove = (event) => {
            const nx = clamp01(event.clientX / window.innerWidth)
            const ny = clamp01(event.clientY / window.innerHeight)
            targetPosRef.current = axis === "horizontal" ? nx : ny
        }

        const handleComponentMove = (event) => {
            const node = rootRef.current
            if (!node) return
            const rect = node.getBoundingClientRect()
            if (!rect.width || !rect.height) return
            // offsetX/offsetY are relative to the event target, which may be a
            // child (the <video>), so fall back to clientX minus the rect.
            const ox =
                event.target === node
                    ? event.offsetX
                    : event.clientX - rect.left
            const oy =
                event.target === node ? event.offsetY : event.clientY - rect.top
            const nx = clamp01(ox / rect.width)
            const ny = clamp01(oy / rect.height)
            targetPosRef.current = axis === "horizontal" ? nx : ny
        }

        if (trackingArea === "window") {
            window.addEventListener("pointermove", handleWindowMove, {
                passive: true,
            })
            return () =>
                window.removeEventListener("pointermove", handleWindowMove)
        }

        const node = rootRef.current
        if (!node) return
        node.addEventListener("pointermove", handleComponentMove, {
            passive: true,
        })
        return () =>
            node.removeEventListener("pointermove", handleComponentMove)
    }, [axis, trackingArea, src])

    // ── Scrub loop ──────────────────────────────────────────────────────────
    useEffect(() => {
        if (!src) return

        const tick = () => {
            rafRef.current = requestAnimationFrame(tick)

            const video = videoRef.current
            if (!video) return

            const duration = video.duration
            if (!Number.isFinite(duration) || duration <= 0) return

            // Hold on frame 0 until the clip can play through.
            if (!readyRef.current) return

            let pos = targetPosRef.current
            if (reverse) pos = 1 - pos

            const target = pos * duration
            const next =
                currentTimeRef.current +
                (target - currentTimeRef.current) * smoothing
            currentTimeRef.current = next

            // Skip while a seek is in flight, and ignore sub-frame deltas —
            // together these prevent a "seek storm" that stalls the decoder.
            if (seekingRef.current) return
            if (Math.abs(video.currentTime - next) <= 0.008) return

            try {
                video.currentTime = next
            } catch (e) {
                /* seek can throw mid-load; the next frame will retry */
            }
        }

        rafRef.current = requestAnimationFrame(tick)
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
            rafRef.current = null
        }
    }, [reverse, smoothing, src])

    const containerStyle = {
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        borderRadius,
        ...style,
    }

    // Canvas placeholder so the component is never invisible in Framer.
    if (!src) {
        return (
            <div
                ref={rootRef}
                style={{
                    ...containerStyle,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#0F1115",
                    border: "1px dashed rgba(255,255,255,0.28)",
                    color: "rgba(255,255,255,0.75)",
                    fontFamily:
                        "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
                    fontSize: 14,
                    fontWeight: 500,
                    letterSpacing: "-0.01em",
                    textAlign: "center",
                    padding: 12,
                }}
            >
                Add a video file
            </div>
        )
    }

    return (
        <div ref={rootRef} style={containerStyle}>
            <video
                ref={videoRef}
                src={src}
                muted
                playsInline
                preload="auto"
                disableRemotePlayback
                tabIndex={-1}
                style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit,
                    borderRadius,
                    // Hide until the first frame is decodable, so we never
                    // flash an empty black box mid-buffer.
                    opacity: showPoster || isReady ? 1 : 0,
                    transition: "opacity 180ms ease",
                    pointerEvents: "none",
                    userSelect: "none",
                }}
            />
        </div>
    )
}

CursorScrubVideo.displayName = "Cursor Scrub Video"

addPropertyControls(CursorScrubVideo, {
    videoFile: {
        type: ControlType.File,
        title: "Video",
        allowedFileTypes: ["mp4", "webm", "mov", "m4v"],
        description:
            "Encode with every frame as a keyframe for smooth scrubbing:\nffmpeg -i in.mp4 -c:v libx264 -preset slow -crf 18 -g 1 -keyint_min 1 -x264-params \"scenecut=0\" -profile:v high -pix_fmt yuv420p -movflags +faststart -an out.mp4",
    },
    axis: {
        type: ControlType.Enum,
        title: "Axis",
        options: ["horizontal", "vertical"],
        optionTitles: ["Horizontal", "Vertical"],
        defaultValue: "horizontal",
        displaySegmentedControl: true,
    },
    reverse: {
        type: ControlType.Boolean,
        title: "Reverse",
        defaultValue: false,
        enabledTitle: "Flipped",
        disabledTitle: "Normal",
        description:
            "Off: left→right or top→bottom plays start→end. On flips it.",
    },
    trackingArea: {
        type: ControlType.Enum,
        title: "Track",
        options: ["component", "window"],
        optionTitles: ["Component", "Window"],
        defaultValue: "component",
        displaySegmentedControl: true,
    },
    smoothing: {
        type: ControlType.Number,
        title: "Smoothing",
        min: 0.02,
        max: 1,
        step: 0.01,
        defaultValue: 0.22,
        displayStepper: false,
        description: "Higher is snappier, lower has more inertia.",
    },
    objectFit: {
        type: ControlType.Enum,
        title: "Fit",
        options: ["cover", "contain", "fill"],
        optionTitles: ["Cover", "Contain", "Fill"],
        defaultValue: "cover",
    },
    showPoster: {
        type: ControlType.Boolean,
        title: "Poster",
        defaultValue: true,
        enabledTitle: "Show",
        disabledTitle: "Hide",
        description: "Show the first frame while the file buffers.",
    },
    borderRadius: {
        type: ControlType.Number,
        title: "Radius",
        min: 0,
        max: 200,
        step: 1,
        defaultValue: 0,
        displayStepper: true,
    },
})

import "./contact.scss";
import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import useReveal from "../../hooks/useReveal";

export default function Contact() {
  const [status, setStatus] = useState("idle");
  const [revealRef, inView] = useReveal();
  const formRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("sending");

    emailjs
      .sendForm(
        "service_d6n6xen",
        "template_ph68mql",
        formRef.current,
        "EcHD_ZppVE0-psUQv"
      )
      .then(
        () => {
          setStatus("sent");
          formRef.current.reset();
        },
        // Previously the success note appeared before the request resolved,
        // so failures still looked like successes.
        () => setStatus("error")
      );
  };

  return (
    <section
      className={`contact ${inView ? "is-visible" : ""}`}
      id="contact"
      ref={revealRef}
      aria-labelledby="contact-title"
    >
      <header className="contact__head">
        <h2 id="contact-title" className="contact__title">
          Contact<span className="contact__dot">.</span>
        </h2>
      </header>

      <div className="contact__inner">
        {/* Decorative only -- the heading already carries the meaning. */}
        <img
          className="contact__art"
          src="assets/email-3.jpeg"
          alt=""
          loading="lazy"
        />

        <form className="contact__form" onSubmit={handleSubmit} ref={formRef}>
          <label className="contact__field">
            <span className="contact__label">Your email</span>
            <input
              type="email"
              name="email"
              placeholder="Your email"
              autoComplete="email"
              required
            />
          </label>

          <label className="contact__field">
            <span className="contact__label">Subject</span>
            <input type="text" name="subject" placeholder="Subject" required />
          </label>

          <label className="contact__field">
            <span className="contact__label">Message</span>
            <textarea
              name="message"
              placeholder="Message"
              rows={5}
              required
            />
          </label>

          <button
            className="contact__submit"
            type="submit"
            disabled={status === "sending"}
          >
            {status === "sending" ? "Sending…" : "Send Message"}
            <span aria-hidden="true">→</span>
          </button>

          {/* Announced to screen readers without stealing focus. */}
          <p className="contact__status" role="status" aria-live="polite">
            {status === "sent" &&
              "Thanks for reaching out — I'll reply within 48 hours."}
            {status === "error" &&
              "Something went wrong. Please email me directly instead."}
          </p>
        </form>
      </div>
    </section>
  );
}

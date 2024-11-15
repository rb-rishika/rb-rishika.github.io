
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import "./experience.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
};


export const iconOnClick = () => {
	console.log("Hi");
	return (<div>
		<Modal
			open={true}>
			<Box style={style}>
				<Typography id="modal-modal-title" variant="h6" component="h2">
					Text in a modal
				</Typography>
			</Box>
		</Modal>
	</div>)

}
export default function Experience() {

	return (
		<div className="experience" id="experience">
			<h1>Experience</h1>
			<div className="col-twelve">
				<div className="App">
					<VerticalTimeline>
						<VerticalTimelineElement
							className="vertical-timeline-element--work"
							contentStyle={{ background: '#8ca19e', color: '#fff', maxWidth: '800px' }}
							dateClassName={"dates"}
							contentArrowStyle={{ borderRight: '7px solid  #8ca19e' }}
							date="May 2022 - present"
							iconStyle={{ background: 'white', color: '#fff', overflow: 'hidden', paddingTop: '8px' }}
							icon={<img src="assets/sbux-logo.png" style={{}} />}
							iconOnClick={iconOnClick}
						>
							<h3 className="vertical-timeline-element-title">Engineer II</h3>
							<h4 className="vertical-timeline-element-subtitle">Seattle, WA</h4>
							<p>
								React JS Developer, User Experience, UX Designer, Auth Control
							</p>
						</VerticalTimelineElement>

						<VerticalTimelineElement
							className="vertical-timeline-element--work"
							date="Jul 2020 - Jul 2021"
							dateClassName={"dates"}
							contentStyle={{ background: '#8ca19e', color: '#fff', maxWidth: '800px', paddingLeft: ' 3em;' }}
							contentArrowStyle={{ borderRight: '7px solid  #8ca19e' }}
							iconStyle={{ background: 'white', color: '#fff', overflow: 'hidden', paddingTop: '5px' }}
							icon={<img src="assets/bnp-paribas.svg" style={{}} />}
						>
							<h3 className="vertical-timeline-element-title">Software Engineer</h3>
							<h4 className="vertical-timeline-element-subtitle">Mumbai, India</h4>
							<p>
								User Experience, Visual Design, Automation Engineer
							</p>
						</VerticalTimelineElement>

						<VerticalTimelineElement
							iconStyle={{ background: 'rgb(16, 204, 82)', color: '#fff' }}
							icon={<FontAwesomeIcon icon="fa-light fa-graduation-cap" />}
						/>
					</VerticalTimeline>

				</div>
			</div>
		</div>

	);
}
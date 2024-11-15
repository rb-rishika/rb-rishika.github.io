import "./contact.scss";
import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";

export default function Contact() {
  const [message, setMessage] = useState(false);
  const formRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(true);

    emailjs
      .sendForm(
        "service_d6n6xen",
        "template_ph68mql",
        formRef.current,
        "EcHD_ZppVE0-psUQv"
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
  };
  return (
    <div className="contact" id="contact">
      <div className="contact-left">
        <img src="assets/email-3.jpeg" alt="" />
      </div>
      <div className="contact-right">
        <h2>Contact</h2>
        <form onSubmit={handleSubmit} ref={formRef}>
          <input type="email" id="email" placeholder="Email" name="email" />
          <input type="text" placeholder="Subject" name="subject" />
          <textarea placeholder="Message" name="message" />
          <button type="submit">Send</button>
          {message && (
            <span>
              😄 Thanks for reaching out! Will respond as soon as possible
              (usually within 48 hours).
            </span>
          )}
        </form>
      </div>
    </div>
  );
}

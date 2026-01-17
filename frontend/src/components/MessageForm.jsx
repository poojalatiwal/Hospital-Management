import axios from "axios";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { useNavigate } from "react-router-dom";

const MessageForm = () => {
  const { isAuthenticated } = useContext(Context);
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleMessage = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please sign in to continue");
      navigate("/login");
      return;
    }

    if (!firstName || !email || !phone || !message) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        "http://localhost:4000/api/v1/message/send",
        { firstName, lastName, message, phone, email },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );

      toast.success(data.message || "Message sent successfully ✅");

      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setMessage("");

    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="message-wrapper">
      <div className="message-card">
        <h2>Send Us A Message</h2>

        {!isAuthenticated && (
          <p className="message-warning">
            ⚠ Please sign in to send a message
          </p>
        )}

        <form onSubmit={handleMessage}>
          <div className="form-row">
            <input
              type="text"
              placeholder="First Name *"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={loading}
            />
            <input
              type="text"
              placeholder="Last Name (optional)"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-row">
            <input
              type="email"
              placeholder="Email *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <input
              type="number"
              placeholder="Phone Number *"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
            />
          </div>

          <textarea
            rows="5"
            placeholder="Message *"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loading}
          />

          <button type="submit" className="appointment-btn" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageForm;

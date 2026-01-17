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

    // ✅ BLOCK if not logged in
    if (!isAuthenticated) {
      toast.error("Please sign in to continue");
      navigate("/login"); // optional: redirect to login
      return;
    }

    // basic validation
    if (!firstName || !email || !phone || !message) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        "https://hospital-mangement-system-58iq.onrender.com/api/v1/message/send",
        { firstName, lastName, message, phone, email },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success(data.message || "Message sent successfully ✅");

      // clear form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setMessage("");

    } catch (error) {
      console.log("MESSAGE ERROR 👉", error);
      toast.error(error?.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container form-component message-form">
      <h2>Send Us A Message</h2>

      {!isAuthenticated && (
        <p style={{ color: "#e63946", textAlign: "center", marginBottom: "10px" }}>
          ⚠ Please sign in to send a message
        </p>
      )}

      <form onSubmit={handleMessage}>
        <div>
          <input type="text" placeholder="First Name *"
            value={firstName} onChange={(e) => setFirstName(e.target.value)}
            disabled={loading}
          />

          <input type="text" placeholder="Last Name (optional)"
            value={lastName} onChange={(e) => setLastName(e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <input type="email" placeholder="Email *"
            value={email} onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <input type="number" placeholder="Phone Number *"
            value={phone} onChange={(e) => setPhone(e.target.value)}
            disabled={loading}
          />
        </div>

        <textarea rows={7} placeholder="Message *"
          value={message} onChange={(e) => setMessage(e.target.value)}
          disabled={loading}
        />

        <div style={{ justifyContent: "center" }}>
          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageForm;

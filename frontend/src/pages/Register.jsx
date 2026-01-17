import React, { useContext, useState } from "react";
import { Context } from "../main";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigateTo = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: false });
  };

  const validate = () => {
    let newErrors = {};
    ["firstName", "email", "phone", "gender", "password"].forEach((field) => {
      if (!formData[field]) newErrors[field] = true;
    });

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill all required fields");
    }

    return newErrors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        "https://hospital-mangement-system-58iq.onrender.com/api/v1/user/patient/register",
        { ...formData, role: "Patient" },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      );

      toast.success(data.message || "Registered successfully");
      setIsAuthenticated(true);
      navigateTo("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) return <Navigate to="/" />;

  return (
    <div className="container form-component register-form">
      <h2>Sign Up</h2>
      <p>Please sign up to continue</p>

      <form onSubmit={handleRegister}>
        <div>
          <input
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            disabled={loading}
            className={errors.firstName ? "error-input" : ""}
          />

          <input
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            className={errors.email ? "error-input" : ""}
          />

          <input
            name="phone"
            type="tel"
            placeholder="Phone number"
            value={formData.phone}
            onChange={handleChange}
            disabled={loading}
            className={errors.phone ? "error-input" : ""}
          />
        </div>

        <div className="form-row">
  {/* GENDER */}
  <div className="field-box">
    <select
      name="gender"
      value={formData.gender}
      onChange={handleChange}
      disabled={loading}
      className={errors.gender ? "error-input" : ""}
    >
      <option value="">Select Gender</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
    </select>
  </div>

  {/* PASSWORD */}
  <div className="field-box password-box">
    <input
      name="password"
      type={showPassword ? "text" : "password"}
      placeholder="Password"
      value={formData.password}
      onChange={handleChange}
      disabled={loading}
      className={errors.password ? "error-input" : ""}
    />

    <span onClick={() => setShowPassword(!showPassword)}>
      {showPassword ? <FaEyeSlash /> : <FaEye />}
    </span>
  </div>
</div>


        <div className="register-row">
          <p>Already Registered?</p>
          <Link to="/login">Login Now</Link>
        </div>

        <div className="register-btn-wrapper">
          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </div>

        {loading && (
          <p style={{ textAlign: "center", marginTop: "10px", color: "#6c63ff" }}>
            Creating your account...
          </p>
        )}
      </form>
    </div>
  );
};

export default Register;

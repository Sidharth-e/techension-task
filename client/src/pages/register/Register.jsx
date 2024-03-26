import React, { useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import { useNavigate } from "react-router-dom";
import "./Register.scss"; // Importing styles
import Error from "../../components/error/Error"; // Importing error component
import { saveToken } from "../../utlis/utlis"; // Importing utility function
import apiService from "../../service/apiService"; // Importing API service

export default function Register() {
  // State variables for form data, navigation, and error handling
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const [error, setError] = useState("");

  // Function to handle changes in form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Checking if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      // Sending registration data to the backend API
      const { confirmPassword, ...dataToSend } = formData;
      const response = await apiService.userRegister(dataToSend);
      if (response.status === 200) {
        // If registration is successful, clear form data, reset error, save token, and navigate to dashboard
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setError("");
        saveToken(response.data.token);
        navigate("/dashboard");
      }
      if (response.status === 201) {
        // If there's a custom message from the server, set it as the error
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      // Handle error states accordingly
    }
  };

  return (
    <>
      {/* Navbar component */}
      <Navbar />
      {/* Register container */}
      <div className="register-container">
        <div className="register-card">
          {/* Login button */}
          <div className="login-button">
            <p>Already have an account?</p>
            <button onClick={() => navigate("/login")}>Login</button>
          </div>
          {/* Registration form */}
          <div className="register-form">
            <h2>Register</h2>
            {/* Form inputs */}
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />

              {/* Displaying error message if exists */}
              {error && <Error error={error} />}
              {/* Submit button */}
              <button type="submit">Register</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

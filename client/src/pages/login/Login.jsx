import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.scss"; // Importing styles
import Error from "../../components/error/Error"; // Importing error component
import { saveToken } from "../../utlis/utlis"; // Importing utility function
import apiService from "../../service/apiService"; // Importing API service
import Navbar from "../../components/navbar/Navbar"; // Importing Navbar component

export default function Login() {
  // State variables for email, password, and error handling
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  // Functions to handle changes in email and password inputs
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Sending login data to the backend API
      const response = await apiService.userLogin({
        email,
        password,
      });
      if (response.status === 201) {
        // If there's a custom message from the server, set it as the error
        setError(response.data.message);
      }
      if (response.status === 200) {
        // If login is successful, save token and navigate to dashboard
        saveToken(response.data.token);
        navigate("/dashboard");
      }
    } catch (error) {
      // Handle failed login, show error message to user, etc.
      console.error("Login failed:", error.message);
    }
    // Clearing the form fields after submission
    setEmail("");
    setPassword("");
  };

  return (
    <>
      {/* Navbar component */}
      <Navbar />
      {/* Login container */}
      <div className="login-container">
        <div className="login-card">
          {/* Login form */}
          <div className="login-form">
            <h2>Login</h2>
            {/* Form inputs */}
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
                required
              />
              <input
                type="password"
                id="password"
                value={password}
                placeholder="Password"
                onChange={handlePasswordChange}
                required
              />
              {/* Submit button */}
              <button type="submit">Submit</button>
            </form>
          </div>
          {/* Sign up button */}
          <div className="signup-button">
            <p>Don't have an account?</p>
            <button onClick={() => navigate("/register")}>Sign Up</button>
          </div>
          {/* Displaying error message if exists */}
          {error && <Error error={error} />}
        </div>
      </div>
    </>
  );
}

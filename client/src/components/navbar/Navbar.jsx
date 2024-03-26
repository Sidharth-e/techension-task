import React from "react";
import "./Navbar.scss"; // Importing the styles for the Navbar component
import { clearToken, getToken } from "../../utlis/utlis"; // Importing utility functions for managing authentication tokens
import { useNavigate, useLocation } from "react-router-dom"; // Importing hooks for navigation and accessing the current location
import { TbLogout2 } from "react-icons/tb"; // Importing an icon component for logout

// Defining the Navbar component as a functional component
export default function Navbar() {
  const navigate = useNavigate(); // Initializing the navigate function from useNavigate hook
  const token = getToken(); // Retrieving the authentication token
  const location = useLocation(); // Getting the current location using useLocation hook

  // Function to handle logout
  const Logout = () => {
    clearToken(); // Clearing the authentication token
    navigate("/login"); // Navigating to the login page
  };

  // Function to navigate to view claims page
  const ViewNavigate = () => {
    navigate("/view"); // Navigating to the view claims page
  };

  // Rendering the Navbar component
  return (
    <div className="navbar"> {/* Navbar container */}
      <h2 className="navbar-title">CLIAMS</h2> {/* Navbar title */}
      <div className="menu"> {/* Menu container */}
        {/* Rendering View Claims button if there's a token and not on the view claims page */}
        {token && location.pathname !== "/view" && (
          <button className="navbar-button" onClick={ViewNavigate}>
            View CLIAMS
          </button>
        )}

        {/* Rendering Logout button if there's a token */}
        {token && (
          <button className="navbar-button" onClick={Logout}>
            <TbLogout2 /> {/* Logout icon */}
          </button>
        )}
      </div>
    </div>
  );
}

import Swal from "sweetalert2"; // Importing SweetAlert2 for displaying messages
import { useNavigate } from "react-router-dom"; // Importing useNavigate hook for navigation

// Function to generate a reference ID based on provided row data
export const generateReferenceID = (row) => {
  if (row["Name"] && row["Name"].trim() !== "") {
    return "REF-" + generateCode(16, true, true, true); // Generate a reference ID using generateCode function
  } else {
    return ""; // Return empty string for rows without valid data
  }
};

// Function to generate a random code of specified length with optional character sets
export function generateCode(
  length,
  lowercase = true,
  uppercase = true,
  numbers = true
) {
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numberChars = "0123456789";

  let characterSet = "";

  if (lowercase) {
    characterSet += lowercaseChars;
  }
  if (uppercase) {
    characterSet += uppercaseChars;
  }
  if (numbers) {
    characterSet += numberChars;
  }

  if (characterSet.length === 0) {
    throw new Error("At least one character set must be included");
  }

  let code = "";
  for (let i = 0; i < length; i++) {
    code += characterSet.charAt(
      Math.floor(Math.random() * characterSet.length)
    );
  }

  return code;
}

// Function to get the authentication token from localStorage
export const getToken = () => localStorage.getItem("token");

// Function to save the authentication token to localStorage
export const saveToken = (token) => localStorage.setItem("token", token);

// Function to clear the authentication token from localStorage
export const clearToken = () => localStorage.removeItem("token");

// Custom hook for displaying success messages using SweetAlert2
export const useSuccessMessage = () => {
  const navigate = useNavigate(); // Initialize navigate function from useNavigate hook

  // Function to display a success message with SweetAlert2
  const showSuccessMessage = async (title, text) => {
    await Swal.fire({
      title: title,
      text: text,
      icon: "success",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/view"); // Redirect to the view page after confirmation
      }
    });
  };

  return { showSuccessMessage }; // Return function for showing success message
};

import React from 'react'
import Lottie from "lottie-react"; // Importing Lottie for rendering animations
import loaderAnimation from "../../assets/animations/Loader.json"; // Importing the loader animation JSON file

// Defining the Loader component as a functional component
export default function Loader() {
  return (
    <div className='loader'> {/* Loader container */}
      {/* Rendering the Lottie component with loader animation */}
      <Lottie animationData={loaderAnimation} loop={true} /> {/* Setting loop to true to loop the animation */}
    </div>
  )
}

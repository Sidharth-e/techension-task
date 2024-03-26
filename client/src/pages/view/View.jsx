import React, { useEffect, useState } from "react";
import Loader from "../../components/loader/Loader";
import apiService from "../../service/apiService";
import Swal from "sweetalert2";
import Navbar from '../../components/navbar/Navbar';

export default function View() {
  // State variables to store claims data and loading state
  const [response, setResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch claims data from the API
  const handleFetchData = async () => {
    try {
      const response = await apiService.getClaimsData();
      setResponse(response);
      setIsLoading(false);
    } catch (error) {
      console.error("Fetching data failed:", error);
    }
  };

  // Function to handle deletion of a claim
  const handleClaimsDelete = async (id) => {
    try {
      // Display confirmation dialog using SweetAlert2
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          // If user confirms deletion, delete the claim and refresh data
          apiService.deleteClaimsData(id).then(() => {
            setIsLoading(true); // Set loading state to true
            // Show success message using SweetAlert2
            Swal.fire("Deleted!", "Link has been deleted.", "success");
            handleFetchData(); // Fetch updated data
            setIsLoading(false); // Set loading state to false
          });
        }
      });
    } catch (error) {
      console.log("error", error.message);
    }
  };

  // Effect hook to fetch data when component mounts
  useEffect(() => {
    handleFetchData();
  }, []);

  return (
    <>
      {/* Render Navbar component */}
      <Navbar/>

      {/* Render header */}
      <h1>View Claims</h1>

      {/* Conditional rendering based on loading state */}
      {isLoading ? (
        // Show loader if data is loading
        <Loader />
      ) : (
        // Render claims table if data is loaded
        <table>
          <thead>
            {/* Table header */}
            <tr>
              <th>Name</th>
              <th>Reference ID</th>
              <th>DOB</th>
              <th>Gender</th>
              <th>Contact</th>
              <th>Country</th>
              <th>Accident Venue</th>
              <th>Accident Date</th>
              <th>Visit Date</th>
              <th>Total Cost</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* Table body */}
            {/* Check if there are claims data */}
            {response.length > 0 ? (
              // Map over claims data and render table rows
              response.map((claim) => (
                <tr key={claim._id}>
                  {/* Table data */}
                  <td data-label="Name">{claim.name}</td>
                  <td data-label="Reference ID">{claim.referenceID}</td>
                  <td data-label="DOB">{claim.dob}</td>
                  <td data-label="Gender">{claim.gender}</td>
                  <td data-label="Contact">{claim.contact}</td>
                  <td data-label="Country">{claim.country}</td>
                  <td data-label="Accident Venue">{claim.accidentVenu}</td>
                  <td data-label="Accident Date">{claim.accidentDate}</td>
                  <td data-label="Visit Date">{claim.visitDate}</td>
                  <td data-label="Total cost">{claim.totalCost}</td>
                  <td>
                    {/* Button to delete claim */}
                    <button onClick={() => handleClaimsDelete(claim._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              // If no claims data, render a table row with a single cell displaying "No data"
              <tr>
                <td colSpan="11">No data</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </>
  );
}

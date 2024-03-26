
import React, { useState, useRef, useEffect, useCallback } from "react";
import Papa from "papaparse"; // Library for parsing CSV files
import template from "../../assets/template.csv"; // Sample CSV template file
import apiService from "../../service/apiService"; // Service for interacting with backend API
import { generateReferenceID } from "../../utlis/utlis"; // Utility function for generating reference IDs
import "./ClaimFormUploader.scss"; // Stylesheet for the component
import { FaDownload, FaFile } from "react-icons/fa6"; // Icons for download and file
import { FaCloudUploadAlt } from "react-icons/fa"; // Icon for upload
import { TfiClose } from "react-icons/tfi"; // Icon for close button
import Modal from "react-modal"; // Library for creating modal dialogs
import { useSuccessMessage } from "../../utlis/utlis"; // Custom hook for displaying success messages

const ClaimFormUploader = () => {
    // State variables
    const [file, setFile] = useState(null); // State to hold the selected file
    const [errorMessage, setErrorMessage] = useState(""); // State for error messages
    const [header, setHeader] = useState([]); // State for CSV file headers
    const [rowData, setRowData] = useState([]); // State for parsed CSV data rows
    const [fieldMapping, setFieldMapping] = useState({}); // State for mapping CSV fields to database fields
    const [failedRowData, setFailedRowData] = useState([]); // State for rows that failed validation
    const [modalIsOpen, setModalIsOpen] = useState(false); // State for modal dialog visibility
    const [mappedModalData, setMappedModalData] = useState([]); // State for mapped data to display in the modal
    const [isUploadbuttonHidden, setIsUploadbuttonHidden] = useState(false); // State to control visibility of the upload button
    const [selectedFileName, setSelectedFileName] = useState(""); // State to hold the name of the selected file
    const [successfulSaveCount, setSuccessfulSaveCount] = useState(0); // State to count successfully saved claims
    const [totalDataItems, setTotalDataItems] = useState(0); // State to hold the total number of data items
    const [showCompletionMessage, setShowCompletionMessage] = useState(false); // State to control display of completion message
    const { showSuccessMessage } = useSuccessMessage(); // Custom hook for displaying success messages
  
    // Ref to file input element
    const fileInputRef = useRef(null);
  
 // Function to close the modal
 const closeModal = () => {
  setModalIsOpen(false);
};

 // Function to handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setSelectedFileName(selectedFile.name);
      setIsUploadbuttonHidden(true);
      setFile(selectedFile);
      setErrorMessage("");
    }
  };

   // Function to handle file upload
  const handleUpload = () => {
    if (!file) {
      setErrorMessage("Please select a file to upload.");
      return;
    }
// Parse the selected CSV file
    Papa.parse(file, {
      header: true,
      complete: function (results) {
        if (results.errors.length > 0) {
          setErrorMessage("Error parsing CSV file.");
        } else {
          const headerFields = results.meta.fields;
          const parsedData = results.data.filter((row) =>
            Object.values(row).some((value) => value.trim() !== "")
          ); // Filter out rows with all empty values
          setHeader(headerFields);
          const mappedData = parsedData.map((row, index) => ({
            ...row,
            "Reference ID":
              generateReferenceID(row) ||
              generateReferenceID({ "Reference ID": index + 1 }),
          }));
          setRowData(mappedData);
          autoMapFields(headerFields);
        }
      },
    });

    setFile(null);
  };

 // Function to automatically map fields based on CSV headers
  const autoMapFields = (headerFields) => {
    const defaultMapping = {};
    headerFields.forEach((column) => {
      defaultMapping[column] = "";
    });
    setFieldMapping(defaultMapping);
  };

  // Function to handle field mapping
  const handleFieldMapping = (csvField, dbField) => {
    setFieldMapping((prevState) => ({
      ...prevState,
      [csvField]: dbField,
    }));
  };

  // Function to save claims data to backend
  const saveClaimsDataToBackend = async (data) => {
    try {
      const response = await apiService.postClaimsData(data);
      console.log("Claim saved successfully:", response);
      setSuccessfulSaveCount(prevCount => prevCount + 1);

      
    } catch (error) {
      console.error("Saving claim failed:", error);
    }
  };

   // Function to handle successful save
  const handleSaveClaims = (data) => {
    // setSuccessfulSaveCount(0); 
    data.map((value) => saveClaimsDataToBackend(value));
  };
  const handleSuccess = useCallback(async () => {
    await showSuccessMessage('Success', 'Successful saved data to DB !');
  }, [showSuccessMessage]);
  

  // Effect to handle successful save completion
  useEffect(() => {
    console.log(totalDataItems);
    console.log(successfulSaveCount);
    if (successfulSaveCount === totalDataItems && totalDataItems > 0) {
      setShowCompletionMessage(true);
      setSuccessfulSaveCount(0);
      handleSuccess();
    }
  }, [successfulSaveCount, totalDataItems, handleSuccess]);
  

// Function to validate a row
  const validateRow = (row) => {
    if (
      !row.name ||
      !row.dob ||
      !row.country ||
      !row["accidentVenu"] ||
      !row["accidentDate"] ||
      !row["totalCost"]
    ) {
      setFailedRowData((prevRows) => [...prevRows, row]);
      return false;
    }
    return true;
  };

   // Function to save mapping and open modal
  const saveMapping = () => {
    const mappedData = rowData.map((row) => {
      const newRow = {};
      for (const key in row) {
        newRow[fieldMapping[key] || key] = row[key];
      }
      return newRow;
    });
    const newData = mappedData.filter(validateRow);
    setMappedModalData(newData);
    setTotalDataItems(newData.length)
    setModalIsOpen(true);
  };
 // Function to handle file button click
  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  return (
    <React.Fragment>
      <div className="claim-form-uploader">
        <h2>Upload Claim Forms</h2>
        <p>
          Download claim template{" "}
          <a href={template} download className="download-link ">
            <FaDownload />
          </a>
        </p>
        <div className="file-uploader">
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
            accept=".csv"
          />
          <button onClick={handleFileButtonClick}>
            Choose CSV File <FaFile />{" "}
          </button>

          {isUploadbuttonHidden && (
            <button onClick={handleUpload}>
              Upload <FaCloudUploadAlt />
            </button>
          )}
        </div>
        <p>{selectedFileName}</p>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        {rowData.length > 0 && (
          <div>
            <h3>Data from CSV:</h3>
            <table>
              <thead>
                <tr>
                  {header.map((field, index) => (
                    <th key={index}>{field}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rowData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {header.map((field, fieldIndex) => (
                      <td key={fieldIndex} data-label={header[fieldIndex]}>
                        {row[field]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {header.length > 0 && Object.keys(fieldMapping).length > 0 && (
          <div>
            <h3>Field Mapping:</h3>
            <table>
              <thead>
                <tr>
                  <th>CSV Field</th>
                  <th>Database Field</th>
                </tr>
              </thead>
              <tbody>
                {header.map((csvField, index) => (
                  <tr key={index}>
                    <td>{csvField}</td>
                    <td>
                      <select
                        onChange={(e) =>
                          handleFieldMapping(csvField, e.target.value)
                        }
                      >
                        <option value="">Select Field</option>
                        <option value="name">Name *</option>
                        <option value="dob">DOB *</option>
                        <option value="referenceID">Reference ID</option>
                        <option value="contact">Contact</option>
                        <option value="gender">Gender</option>
                        <option value="country">Country *</option>
                        <option value="accidentVenu">Accident-venu *</option>
                        <option value="accidentDate">Accident-date *</option>
                        <option value="visitDate">Visit Date & Time</option>
                        <option value="totalCost">Total Cost *</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={saveMapping}>Save</button>
          </div>
        )}
        <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
          <div className="modal-header">
            <h2>Claims Validation</h2>
            <TfiClose onClick={closeModal} />
          </div>
          {mappedModalData.length > 0 && (
            <div>
              <h3>Mapped Data with column field:</h3>
              <table>
                <thead>
                  <tr>
                    {header.map((field, index) => (
                      <th key={index}>{field}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mappedModalData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td data-label={header[0]}> {row.name}</td>
                      <td data-label={header[1]}> {row.referenceID}</td>
                      <td data-label={header[2]}> {row.dob}</td>
                      <td data-label={header[3]}> {row.gender}</td>
                      <td data-label={header[4]}> {row.contact}</td>
                      <td data-label={header[5]}> {row.country}</td>
                      <td data-label={header[6]}> {row.accidentVenu}</td>
                      <td data-label={header[7]}> {row.accidentDate}</td>
                      <td data-label={header[8]}> {row.visitDate}</td>
                      <td data-label={header[9]}> {row.totalCost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="validation">
                <p>Validation Error on {failedRowData.length} rows</p>
                <p>Successfully mapped {mappedModalData.length} rows</p>
              </div>
              {showCompletionMessage && <p>Data saved successfully!</p>}
              <button
                className="claim-save-data"
                onClick={() => handleSaveClaims(mappedModalData)}
              >
                Save data to system
              </button>
            </div>
          )}
        </Modal>
      </div>
    </React.Fragment>
  );
};

export default ClaimFormUploader;

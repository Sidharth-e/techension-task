// Importing Axios for making HTTP requests and getToken function from utils for handling authentication token
import axios from 'axios';
import { getToken } from '../utlis/utlis';

// Define the base URL for your API
const API_URL = 'http://localhost:8080/api'; 

// Creating an Axios instance with base URL and default headers
const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json', // Setting content type to JSON
  },
});

// Define your API endpoints as methods of this service
const apiService = {
  // Method for user login
  userLogin: async (data) => {
    const response = await instance.post('/auth', data); // Making a POST request to '/auth' endpoint with provided data
    return response; // Returning the response
  },

  // Method for user registration
  userRegister: async (data) => {
    const response = await instance.post('/user', data); // Making a POST request to '/user' endpoint with provided data
    return response; // Returning the response
  },

  // Method for posting claims data
  postClaimsData: async (data) => {
    const response = await instance.post('/claims', data, { // Making a POST request to '/claims' endpoint with provided data and authentication token
      headers: {
        'x-auth-token': getToken() // Including the authentication token in the request headers
      }
    });
    return response.data; // Returning the data from the response
  },

  // Method for getting claims data
  getClaimsData: async () => {
    const response = await instance.get('/claims', { // Making a GET request to '/claims' endpoint with authentication token
      headers: {
        'x-auth-token': getToken() // Including the authentication token in the request headers
      }
    });
    return response.data.claims; // Returning the claims data from the response
  },

  // Method for deleting claims data by ID
  deleteClaimsData: async (id) => {
    await instance.delete(`/claims/${id}`, { // Making a DELETE request to '/claims/:id' endpoint with provided ID and authentication token
      headers: {
        'x-auth-token': getToken() // Including the authentication token in the request headers
      }
    });
  },
};

export default apiService; // Exporting the API service

import { Navigate } from 'react-router-dom';

// Define a PrivateRoute component which takes a Component prop
const PrivateRoute = ({ Component }) => {
    // Check if a token exists in the localStorage
    const token = localStorage.getItem('token');

    // If token exists, render the component, otherwise redirect to the login page
    return token ? <Component /> : <Navigate to="/login" />;
};

// Export the PrivateRoute component
export default PrivateRoute;

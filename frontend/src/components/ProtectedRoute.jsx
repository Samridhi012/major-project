import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext'; 

/**
 * ProtectedRoute: A component wrapper that enforces authentication for child routes.
 * * It checks the user's status from the useAuth. If the user is not authenticated,
 * they are redirected to the login page.
 **/
const ProtectedRoute = ({ children }) => {
    // Access the user state and loading status from the main authentication context
    // 'user' is the Firebase user object (null if logged out)
    // 'authLoading' is true while Firebase is checking the user's session token
    const { user, authLoading } = useContext(useAuth); 

    if (authLoading) {
        // Display a full-screen loading state while Firebase initializes/checks the token
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-xl">
                    <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-4 text-gray-700 font-medium">Authenticating...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        // If authentication check is complete and no user is found, redirect to login.
        // 'replace' ensures the user can't navigate back to the protected page via the back button.
        return <Navigate to="/login" replace />;
    }

    // If the user is logged in, render the protected content.
    return children;
};

export default ProtectedRoute;

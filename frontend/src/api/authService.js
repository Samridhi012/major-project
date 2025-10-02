//Token Manager: Manages fetching the Firebase ID Token and securely attaching it to all requests sent to your custom REST API.

import { auth } from '../firebase_client.js'; // Assumes you've created this file
import { 
    signInWithEmailAndPassword, 
    signOut, 
    // We import the functions needed for MFA here, although the full MFA flow 
    // is usually handled in a component due to the need for RecaptchaVerifier
} from 'firebase/auth';

// --- Configuration ---
// Adjust this to the base URL of your custom REST API server
const API_BASE_URL = 'http://localhost:4000/api'; 

/**
 * Helper function to fetch the current user's Firebase ID Token.
 * @returns {Promise<string>} The valid Firebase ID Token string.
 */
const getIdToken = async () => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("No authenticated user found.");
    }
    // forceRefresh: true ensures we get a fresh, non-expired token for security
    return await user.getIdToken(true); 
};

// --- Authentication Functions ---

/**
 * Handles user sign-in using email and password.
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<void>}
 */
export const signInUser = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("User signed in successfully via Firebase Auth.");
    } catch (error) {
        // This is where we catch errors like 'user-not-found' or 'wrong-password'
        console.error("Firebase Sign In Error:", error.code, error.message);
        throw error;
    }
};

/**
 * Handles user sign-out.
 */
export const signOutUser = async () => {
    try {
        await signOut(auth);
        console.log("User signed out.");
    } catch (error) {
        console.error("Firebase Sign Out Error:", error);
    }
};

// --- Secure API Interaction Functions ---

/**
 * Fetches expenses from the custom REST API, securely including the Firebase ID Token.
 * @returns {Promise<Array>} The array of expenses from PostgreSQL.
 */
export const getExpenses = async () => {
    try {
        const token = await getIdToken();
        
        // This is the CRITICAL security step: sending the token to your REST API.
        const response = await fetch(`${API_BASE_URL}/expenses`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // The 'Authorization' header is what your backend middleware expects!
                'Authorization': `Bearer ${token}`, 
            },
        });

        if (!response.ok) {
             // If the backend middleware rejected the token, this will likely be a 401 Unauthorized
            const errorBody = await response.json();
            throw new Error(errorBody.message || `API call failed with status: ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Secure data fetch failed:", error);
        throw error;
    }
};

// You can add other secure CRUD functions here (addExpense, updateExpense, deleteExpense)
// They would all follow the same pattern: 
// 1. Get the ID Token. 
// 2. Attach it to the 'Authorization' header. 
// 3. Send the request to the REST API.

// The full MFA flow (which is complex due to Recaptcha) is usually implemented 
// directly in a React component, but the necessary Firebase functions are available
// via the imported 'auth' object.

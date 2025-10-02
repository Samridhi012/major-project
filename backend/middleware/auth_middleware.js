//The Firewall: Contains the 'verifyToken' function that checks the token, extracts the user ID, and injects it into the request for use in your PostgreSQL queries.
//ensuring that REST API acts as a secure firewall before touching PostgreSQL.

import admin from '../config/firebase_admin';

/**
 * Firewall Middleware: Verifies the Firebase ID Token sent by the client.
 * If valid, it injects the user's secure UID into the request object (req.user.uid).
 * * This function enforces Access Control for all secure PostgreSQL operations.
 */
const verifyToken = async (req, res, next) => {
    // 1. Check for the token in the Authorization header (e.g., "Bearer <token>")
    const header = req.headers.authorization;
    
    if (!header || !header.startsWith('Bearer ')) {
        // Stop the request if the token is missing or in the wrong format
        return res.status(401).send({ error: 'Unauthorized: Missing or invalid authentication token.' });
    }

    // Extract the token part
    const idToken = header.split('Bearer ')[1];

    try {
        // 2. CRITICAL STEP: Use the Firebase Admin SDK to verify the token.
        // This makes a secure call to Google's servers to check validity, expiration, etc.
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        
        // 3. Inject the secure Firebase UID into the request object.
        // This UID is now guaranteed to be authentic and will be used to filter PostgreSQL queries.
        req.user = {
            uid: decodedToken.uid, 
            email: decodedToken.email 
        };

        // Token is valid; proceed to the next Express handler (your route logic)
        next(); 
    } catch (error) {
        // Log the failure and send a 401 response (Unauthorized)
        console.error("Firebase Token Verification Failed:", error.message);
        return res.status(401).send({ error: 'Unauthorized: Token is invalid or expired. Please sign in again.' });
    }
};

export default verifyToken;

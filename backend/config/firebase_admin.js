//Admin Setup: Initializes the Firebase Admin SDK so your server can verify tokens.

import admin, { initializeApp, credential as _credential } from 'firebase-admin';

// CRITICAL: This line loads the secure credentials file you downloaded from Firebase.

try {
    // This function initializes the SDK, giving your backend server the authority to check if tokens are valid.
    const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    initializeApp({
        credential: _credential.cert(serviceAccount)
    });
    console.log("SUCCESS: Firebase Admin SDK initialized for token verification.");
} catch (error) {
    // This is a common error during development (e.g., hot reloading), we safely ignore it.
    if (error.code !== 'app/duplicate-app') {
        console.error("ERROR: Failed to initialize Firebase Admin SDK. Check serviceAccountKey.json.", error);
    }
}

// Export the initialized admin object so other files (like the middleware) can use it.
export default admin;

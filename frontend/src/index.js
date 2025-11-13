import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { GlobalStyle } from "./styles/GlobalStyle";
import { GlobalProvider } from "./context/globalContext"; // <-- ADD THIS
import { ClerkProvider } from "@clerk/clerk-react";

const root = ReactDOM.createRoot(document.getElementById("root"));

const clerkPublishableKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;
const missingClerkKey = !clerkPublishableKey;

// If the publishable key is missing, render a helpful message instead of letting Clerk throw an uncaught runtime error.
root.render(
  <React.StrictMode>
    {missingClerkKey ? (
      <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
        <h2 style={{ color: '#c62828' }}>Clerk configuration missing</h2>
        <p>
          The Clerk publishable key is missing. Please create a file at
          <code> frontend/.env</code> with the following line and restart the dev server:
        </p>
        <pre style={{ background: '#f5f5f5', padding: 12 }}>
REACT_APP_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
        </pre>
        <p>
          You can get the key from the Clerk dashboard: https://dashboard.clerk.com/last-active?path=api-keys
        </p>
      </div>
    ) : (
      <ClerkProvider publishableKey={clerkPublishableKey}>
        <GlobalProvider>
          {/* Wrap everything inside GlobalProvider */}
          <GlobalStyle />
          <App />
        </GlobalProvider>
      </ClerkProvider>
    )}
  </React.StrictMode>
);

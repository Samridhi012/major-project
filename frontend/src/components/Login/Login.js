import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { SignIn, useUser } from "@clerk/clerk-react";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoader, setIsLoader] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const { isSignedIn, user } = useUser();

  // With Clerk we use their SignIn component which handles MFA flows (2FA/TOTP/SMS) via Clerk dashboard settings.
  // Keep the old form state around (for reference / fallback) but redirect when Clerk reports the user is signed in.
  useEffect(() => {
    if (isSignedIn) {
      // Prefer Clerk user's publicMetadata.accountType when present (safer than localStorage)
      const clerkAccountType = user?.publicMetadata?.accountType || user?.publicMetadata?.account_type;
      const fallbackAccountType = localStorage.getItem("accountType");
      const accountType = clerkAccountType || fallbackAccountType;

      if (accountType === "business") {
        navigate("/busi");
      } else if (accountType === "personal") {
        navigate("/main");
      } else {
        navigate("/");
      }
    }
  }, [isSignedIn, user, navigate]);

  const handleSubmit = async (e) => {
    // Keep a noop to avoid form submit page refresh when using the old form markup as fallback
    e.preventDefault();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <LoginStyled>
      <div className="form-container">
        <h2>ExpensoMeter Login</h2>

  {/* Clerk SignIn component provides a full hosted sign-in UI including MFA flows configured in your Clerk dashboard. */}
  {/* Render the SignIn UI inline so it appears on whatever route mounts this Login component. */}
  <SignIn />

        {/* Optional: keep a minimal fallback form (non-Clerk) if you want to support legacy login; currently left hidden.
            If you want to enable the legacy form, remove the surrounding comment and implement backend compatibility. */}
        {/*
        <form onSubmit={handleSubmit} style={{ display: 'none' }}>
          ... legacy form markup if needed ...
        </form>
        */}
      </div>
    </LoginStyled>
  );
};

export default Login;
const LoginStyled = styled.div`
  min-height: 100vh;
  background: #f7f9fc;
  display: flex;
  justify-content: center;
  align-items: center;

  .form-container {
    background: rgba(252, 246, 249, 0.78);
    border: 3px solid #ffffff;
    backdrop-filter: blur(6px);
    border-radius: 24px;
    line-height: 4vh;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.05);
    padding: 2.5rem;
    width: 100%;
    max-width: 400px;

    h2 {
      margin-bottom: 1.5rem;
      color: #222260;
      text-align: center;
    }

    .form-group {
      margin-bottom: 1rem;

      label {
        display: block;
        margin-bottom: 0.5rem;
        color: #333;
      }

      input {
        width: 100%;
        padding: 0.75rem;
        border-radius: 12px;
        border: 1px solid #ccc;
        font-size: 1rem;
        background-color: white;

        &:focus {
          border-color: #222260;
          outline: none;
        }
      }
    }

    .error {
      color: #ff4d4f;
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }

    button {
      width: 100%;
      padding: 0.8rem;
      background-color: #222260;
      color: white;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #3737a5;
      }

      &:disabled {
        background-color: #a0a0b0;
        cursor: not-allowed;
      }
    }

    .register-link {
      margin-top: 1rem;
      text-align: center;
      font-size: 0.95rem;

      a {
        color: #222260;
        font-weight: bold;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
`;

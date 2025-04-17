import { useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Login form component
export default function Login() {
  // Set up form handling with react-hook-form
  const { register, handleSubmit } = useForm();

  // Navigation hook to redirect after login
  const navigate = useNavigate();

  // Local state to store error messages
  const [loginError, setLoginError] = useState("");

  // Function triggered on form submission
  const onSubmit = async (data: any) => {
    try {
      setLoginError("");

      // Attempt to sign in the user with Firebase
      await signInWithEmailAndPassword(auth, data.email, data.password);

      // Redirect to dashboard on success
      navigate("/dashboard");
    } catch (error: any) {
      // Display friendly messages based on Firebase error codes
      if (error.code === "auth/user-not-found") {
        setLoginError("No account found for that email.");
      } else if (error.code === "auth/wrong-password") {
        setLoginError("Incorrect password. Please try again.");
      } else {
        setLoginError("Login failed. Please try again.");
      }
    }
  };

  return (
    // Full-screen layout with gradient background
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,rgb(121, 252, 248) 0%,rgb(150, 177, 230) 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      {/* Styled card containing login form */}
      <div
        style={{
          maxWidth: "400px",
          width: "100%",
          background: "#fff",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 0 15px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Login</h2>

        {/* Login form */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input
            {...register("email")}
            placeholder="Email"
            style={{ padding: "10px", fontSize: "1rem" }}
          />
          <input
            {...register("password")}
            type="password"
            placeholder="Password"
            style={{ padding: "10px", fontSize: "1rem" }}
          />
          <button type="submit" style={{ padding: "10px", cursor: "pointer" }}>
            Login
          </button>
        </form>

        {/* Show error message if login fails */}
        {loginError && <p style={{ color: "red", textAlign: "center" }}>{loginError}</p>}

        {/* Navigation option to switch to registration */}
        <p style={{ textAlign: "center" }}>Don't have an account?</p>
        <button onClick={() => navigate("/register")} style={{ padding: "10px", cursor: "pointer" }}>
          Register Instead
        </button>
      </div>
    </div>
  );
}

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

// Validation schema for the form fields using Yup
const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Min 6 characters").required("Password is required"),
});

export default function Register() {
  // Initialize react-hook-form and attach validation resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Hook to programmatically navigate the user
  const navigate = useNavigate();

  // Function that handles form submission logic
  const onSubmit = async (data: any) => {
    try {
      // Create a new user using Firebase Authentication
      const userCred = await createUserWithEmailAndPassword(auth, data.email, data.password);

      // Save the new user's email and creation time in Firestore
      await setDoc(doc(db, "users", userCred.user.uid), {
        email: data.email,
        createdAt: new Date().toISOString(),
      });

      // Redirect user to the dashboard upon success
      navigate("/dashboard");
    } catch (error: any) {
      alert("Registration failed: " + error.message);
    }
  };

  return (
    // Fullscreen container with background gradient and centered content
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
      {/* Registration card container */}
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
        <h2 style={{ textAlign: "center" }}>Register</h2>

        {/* Registration form with input validation */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <input
              {...register("email")}
              placeholder="Email"
              style={{ padding: "10px", fontSize: "1rem", width: "94%" }}
            />
            <p style={{ color: "red", margin: "4px 0 0" }}>{errors.email?.message}</p>
          </div>

          <div>
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              style={{ padding: "10px", fontSize: "1rem", width: "94%" }}
            />
            <p style={{ color: "red", margin: "4px 0 0" }}>{errors.password?.message}</p>
          </div>

          <button type="submit" style={{ padding: "10px", cursor: "pointer" }}>
            Register
          </button>
        </form>

        {/* Navigation link to login screen */}
        <p style={{ textAlign: "center" }}>Already have an account?</p>
        <button onClick={() => navigate("/login")} style={{ padding: "10px", cursor: "pointer" }}>
          Login Instead
        </button>
      </div>
    </div>
  );
}

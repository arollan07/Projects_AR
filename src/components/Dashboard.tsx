import { useAuth } from "../context/AuthContext";
import useFetchUser from "../hooks/useFetchUser";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const { data: userDoc, isLoading } = useFetchUser(currentUser?.uid);

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (userDoc) {
      setUsername(userDoc.username || "");
      setBio(userDoc.bio || "");
    }
  }, [userDoc]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  if (loading || isLoading) return <p>Loading dashboard...</p>;
  if (!currentUser || !userDoc) return <p>User data not found</p>;

  const joinDate = new Date(userDoc.createdAt).toLocaleString();
  const userInitial = userDoc.email?.charAt(0).toUpperCase() || "?";

  return (
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2rem",
          width: "100%",
          maxWidth: "450px",
        }}
      >
        {/* Profile Info Panel */}
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "30px",
            boxShadow: "0 0 15px rgba(0,0,0,0.1)",
            width: "100%",
            textAlign: "center",
          }}
        >
          <div
            style={{
              background: "#e0f7fa",
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              margin: "0 auto 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#00796b",
            }}
          >
            {userInitial}
          </div>
          <h2>Welcome!</h2>
          <p><strong>Email:</strong> {userDoc.email}</p>
          <p><strong>Joined:</strong> {joinDate}</p>
          <p>
            <strong>Current Weather:</strong>{" "}
            {userDoc.weatherIcon && <span style={{ fontSize: "1.5rem" }}>{userDoc.weatherIcon}</span>}{" "}
            {userDoc.weather ?? "Unavailable"}
          </p>
          <button
            onClick={handleLogout}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#ff5252",
              border: "none",
              borderRadius: "6px",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "background 0.3s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#ff1744")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ff5252")}
          >
            Logout
          </button>
        </div>

        {/* Profile Completion Panel */}
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "30px",
            boxShadow: "0 0 15px rgba(0,0,0,0.1)",
            width: "100%",
          }}
        >
          <h3>Profile Completion</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label>Email (read-only)</label>
              <input value={userDoc.email} disabled style={{ width: "95%", padding: "8px" }} />
              <span>{userDoc.email ? " ✅" : " ❌"}</span>
            </div>

            <div>
              <label>Username</label>
              {isEditing ? (
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ width: "100%", padding: "8px" }}
                />
              ) : (
                <div style={{ padding: "8px", background: "#f7f7f7", borderRadius: "6px" }}>
                  {username || "Not set"}
                </div>
              )}
              <span>{username ? " ✅" : " ❌"}</span>
            </div>

            <div>
              <label>Bio</label>
              {isEditing ? (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  style={{ width: "100%", padding: "8px", resize: "none" }}
                />
              ) : (
                <div style={{ padding: "8px", background: "#f7f7f7", borderRadius: "6px" }}>
                  {bio || "Not set"}
                </div>
              )}
              <span>{bio ? " ✅" : " ❌"}</span>
            </div>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                style={{ marginTop: "10px", padding: "8px", cursor: "pointer" }}
              >
                Edit
              </button>
            ) : (
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button
                  onClick={() => setIsEditing(false)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#4caf50",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setUsername(userDoc.username || "");
                    setBio(userDoc.bio || "");
                    setIsEditing(false);
                  }}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#ccc",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

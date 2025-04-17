import { useAuth } from "../context/AuthContext";
import useFetchUser from "../hooks/useFetchUser";

// Component to display the user's profile information
export default function UserProfile() {
  const { currentUser } = useAuth(); // Get the current user from context
  const { data: userDoc } = useFetchUser(currentUser?.uid); // Fetch user data

  if (!currentUser) return <p>Please log in</p>; // Show message if not logged in

  return (
    <div>
      <h2>Welcome, {userDoc?.email}</h2> {/* Display user's email */}
      <p>Account created: {userDoc?.createdAt}</p> {/* Display account creation date */}
    </div>
  );
}

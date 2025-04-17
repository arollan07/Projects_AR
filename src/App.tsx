import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import UserProfile from "./components/UserProfile";
import Dashboard from "./components/Dashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { JSX } from "react";

const queryClient = new QueryClient();

// Wrapper for private routes, redirects to login if not authenticated
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} /> {/* Redirect root to dashboard */}
            <Route path="/login" element={<Login />} /> {/* Login page */}
            <Route path="/register" element={<Register />} /> {/* Registration page */}
            <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} /> {/* Protected profile page */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} /> {/* Protected dashboard */}
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

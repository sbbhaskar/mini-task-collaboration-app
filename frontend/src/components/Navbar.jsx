// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    fetch("http://localhost:5000/api/auth/logout", {
      credentials: "include",
    })
      .then(() => {
        localStorage.removeItem("user");
        navigate("/login");
      })
      .catch((err) => console.error(err));
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between">
      <Link to="/" className="text-xl font-bold">
        🧠 TaskCollab
      </Link>
      <div className="space-x-4">
        {!user && (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </>
        )}
        {user && (
          <>
            <span>Hello, {user.name}</span>
            <button onClick={handleLogout} className="hover:underline">
              Logout
            </button>
          </>
        )}
        {user && user.role !== "admin" && (
          <Link to="/" className="hover:underline">
            Dashboard
          </Link>
        )}
      </div>
    </nav>
  );
}

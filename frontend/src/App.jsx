// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import Navbar from './components/Navbar';

export default function App() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <>
      <Navbar />
      <Routes>
        {/* HOME ROUTE REDIRECT BASED ON ROLE */}
        <Route
          path="/"
          element={
            user ? (
              user.role === 'admin' ? <Navigate to="/admin" /> : <Dashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
  path="/"
  element={
    user ? (
      user.role === 'admin' ? <Navigate to="/admin" /> : <Dashboard />
    ) : (
      <Navigate to="/login" />
    )
  }
/>

        <Route
          path="/admin"
          element={
            user && user.role === 'admin' ? <AdminPanel /> : <Navigate to="/login" />
          }
        />

        {/* 404 */}
        <Route path="*" element={<h1 className="text-center p-10">404 – Page Not Found</h1>} />
      </Routes>
    </>
  );
}

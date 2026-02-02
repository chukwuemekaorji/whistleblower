import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ReportForm from "./pages/ReportForm.jsx";

function App() {
  const isAuthenticated = !!localStorage.getItem("token");

  // Define application routes
return (
  <Router>
    <Routes>
  // Public Route for Whistleblowers - NO LOGIN REQUIRED
  <Route path="/report/:companyToken" element={<ReportForm />} />

// Manager Routes 
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/dashboard" element={<Dashboard />} />
  
// Default redirect 
  <Route path="*" element={<Navigate to="/login" />} />
</Routes>
  </Router>
);
}

export default App;
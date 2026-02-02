import React, { useState } from "react";
import api from "../api.js";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        setIsSubmitting(true); // Change text to "Signing up..."
        try {
            await api.post("/auth/signup", {
                email,
                password,
                company_name: companyName,
            });
            setMessage("Account created! Redirecting to login...🚀");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setMessage(err.response?.data?.detail || "Signup failed. Please try again.");
        }
    };

    return (
        <div style={{ 
            backgroundColor: "#f4f7f6", 
            minHeight: "100vh", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            padding: "20px"
        }}>
            <div style={{ 
                maxWidth: "450px", 
                width: "100%",
                backgroundColor: "white", 
                padding: "2.5rem", 
                borderRadius: "15px", 
                boxShadow: "0 10px 25px rgba(0,0,0,0.05)" 
            }}>
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <h2 style={{ color: "#2c3e50", marginBottom: "0.5rem" }}>Create Manager Account</h2>
                    <p style={{ color: "#7f8c8d", fontSize: "0.9rem" }}>Start protecting your workplace today.</p>
                </div>

                <form onSubmit={handleSignup}>
                    <div style={{ marginBottom: "1.2rem" }}>
                        <label htmlFor="company" style={labelStyle}>Company Name</label>
                        <input 
                            id="company"
                            type="text" 
                            placeholder="e.g. Acme Corp"
                            value={companyName} 
                            onChange={(e) => setCompanyName(e.target.value)} 
                            required 
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginBottom: "1.2rem" }}>
                        <label htmlFor="email" style={labelStyle}>Work Email</label>
                        <input 
                            id="email"
                            type="email" 
                            placeholder="name@company.com"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginBottom: "1.5rem" }}>
                        <label htmlFor="password" style={labelStyle}>Password</label>
                        <input 
                            id="password"
                            type="password" 
                            placeholder="Create a strong password"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            style={inputStyle}
                        />
                    </div>
                    <button
                type="submit"
                disabled={isSubmitting}
                // 3. Hover event listeners
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    ...buttonStyle,
                    // 4. Dynamic styling based on state
                    backgroundColor: isSubmitting 
                        ? "#95a5a6"  // Grey when clicked/submitting
                        : isHovered 
                            ? "#34495e" // Darker blue when hovered
                            : "#2c3e50", // Original blue
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    transition: "background-color 0.3s ease", // Smooth color fade
                }}
            >
                {isSubmitting ? "Signing up..." : "Create Manager Account"}
            </button>
        </form>
                {message && (
                    <p style={{ 
                        marginTop: "1rem", 
                        textAlign: "center", 
                        color: message.includes("failed") ? "#e74c3c" : "#27ae60",
                        fontSize: "0.9rem",
                        fontWeight: "500"
                    }}>
                        {message}
                    </p>
                )}

                <p style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.9rem", color: "#7f8c8d" }}>
                    Already have an account? <Link to="/login" style={{ color: "#3498db", textDecoration: "none", fontWeight: "bold" }}>Log In</Link>
                </p>
            </div>
        </div>
    );
}

// Shared styles for a cleaner look
const labelStyle = {
    display: "block",
    marginBottom: "5px",
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#34495e"
};

const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #dcdde1",
    fontSize: "1rem",
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.2s",
};

const buttonStyle = {
    width: "100%",
    padding: "12px",
    backgroundColor: "#2c3e50",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease"
};
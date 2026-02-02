import React, { useState } from "react";
import api from "../api.js";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    
    // handle loading state
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const navigate = useNavigate();

    // define the login submit handler
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage("");

        try {
            const formData = new URLSearchParams();
            formData.append('username', email);
            formData.append('password', password);

            // We use the full URLSearchParams for FastAPI OAuth compatibility
            const response = await api.post("/auth/login", formData, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            
            localStorage.setItem("token", response.data.access_token);
            navigate("/dashboard");
        } catch (err) {
            // This catches the 401 Unauthorized or 422 errors
            setMessage(err.response?.data?.detail || "Login failed. Check your credentials.");
        } finally {
            setIsSubmitting(false); // Stop loading regardless of success or failure
        }
    };

    // Render the login form
    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <h2 style={{ color: "#2c3e50", marginBottom: "0.5rem" }}>Manager Login</h2>
                    <p style={{ color: "#7f8c8d", fontSize: "0.9rem" }}>Welcome back! Access your dashboard.</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: "1.2rem" }}>
                        <label htmlFor="email" style={labelStyle}>Email Address</label>
                        <input 
                            id="email"
                            name="email"
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
                            name="password"
                            type="password" 
                            placeholder="Your secure password"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            style={inputStyle}
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={isSubmitting} 
                        style={{
                            ...buttonStyle,
                            opacity: isSubmitting ? 0.7 : 1,
                            cursor: isSubmitting ? "not-allowed" : "pointer",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "10px"
                        }}
                    >
                        {isSubmitting ? "Logging in..." : "Log In 😊"}
                    </button>
                </form>

                {message && (
                    <p style={{ 
                        marginTop: "1rem", 
                        textAlign: "center", 
                        color: "#e74c3c", 
                        fontSize: "0.9rem",
                        fontWeight: "500"
                    }}>
                        {message}
                    </p>
                )}

                <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.9rem", color: "#7f8c8d" }}>
                    <p>
                        Don't have an account?🤯<br />
                        <Link to="/signup" style={linkStyle}>Sign Up!</Link>
                    </p>

                </div>
            </div>
        </div>
    );
}

// styles
const containerStyle = { backgroundColor: "#f4f7f6", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" };
const cardStyle = { maxWidth: "400px", width: "100%", backgroundColor: "white", padding: "2.5rem", borderRadius: "15px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" };
const labelStyle = { display: "block", marginBottom: "5px", fontSize: "0.85rem", fontWeight: "600", color: "#34495e" };
const inputStyle = { width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #dcdde1", fontSize: "1rem", boxSizing: "border-box" };
const buttonStyle = { width: "100%", padding: "12px", backgroundColor: "#2c3e50", color: "white", border: "none", borderRadius: "8px", fontSize: "1rem", fontWeight: "bold" };
const linkStyle = { color: "#3498db", textDecoration: "none", fontWeight: "bold" };
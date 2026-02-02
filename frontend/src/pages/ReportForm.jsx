import React, { useState } from "react";
import { useParams } from "react-router-dom"; 
import api from "../api";

export default function ReportForm() {
    
    // Extract companyToken from URL params
    const { companyToken } = useParams(); 
    
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [is_anonymous, setIsAnonymous] = useState(true);
    const [contactInfo, setContactInfo] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post(`/reports/submit/${companyToken}`, {
                title,
                description,
                is_anonymous,
                contact_info: is_anonymous ? null : contactInfo,
            });

            setMessage("Report submitted successfully! Your identity is protected. 🙏");
            setTitle("");
            setDescription("");
            setIsAnonymous(true);
            setContactInfo("");
        } catch (error) {
            setMessage(error.response?.data?.detail || "Failed to submit report.😞");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <h2 style={{ color: "#2c3e50", marginBottom: "0.5rem" }}>🛡️ Secure Incident Report</h2>
                    <p style={{ color: "#7f8c8d", fontSize: "0.9rem" }}>
                        Submit your concern safely and anonymously if you wish.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Subject</label>
                        <input 
                            style={inputStyle}
                            placeholder="Brief title of the incident"
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            required 
                        />
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Description</label>
                        <textarea 
                            style={{ ...inputStyle, minHeight: "150px", resize: "vertical" }}
                            placeholder="Explain exactly what happened..."
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            required 
                        />
                    </div>      

                    <div style={checkCardStyle}>
                        <input
                            type="checkbox"
                            id="anon"
                            checked={is_anonymous}
                            onChange={(e) => setIsAnonymous(e.target.checked)}
                            style={{ width: "20px", height: "20px", cursor: "pointer" }}
                        />
                        <label htmlFor="anon" style={{ cursor: "pointer", fontWeight: "500" }}>
                            Remain Anonymous
                        </label>
                    </div>

                    {!is_anonymous && (
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Contact Info</label>
                            <input 
                                style={inputStyle}
                                placeholder="Email or Phone (Only visible to admins)"
                                value={contactInfo} 
                                onChange={(e) => setContactInfo(e.target.value)} 
                            />
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        style={{
                            ...submitButtonStyle,
                            backgroundColor: isSubmitting ? "#95a5a6" : "#27ae60"
                        }}
                    >
                        {isSubmitting ? "Submitting Securely..." : "Submit Report"}
                    </button>
                </form>

                {message && (
                    <div style={{ 
                        marginTop: "1.5rem", 
                        padding: "1rem", 
                        borderRadius: "8px",
                        textAlign: "center",
                        backgroundColor: message.includes("successfully") ? "#d4edda" : "#f8d7da",
                        color: message.includes("successfully") ? "#155724" : "#721c24"
                    }}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}

// STYLES
const containerStyle = { backgroundColor: "#f0f2f5", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" };
const cardStyle = { maxWidth: "600px", width: "100%", backgroundColor: "white", padding: "2.5rem", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" };
const inputGroupStyle = { marginBottom: "1.2rem" };
const labelStyle = { display: "block", marginBottom: "8px", fontWeight: "600", color: "#34495e" };
const inputStyle = { width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #dcdde1", fontSize: "1rem", boxSizing: "border-box" };
const checkCardStyle = { display: "flex", alignItems: "center", gap: "10px", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "8px", marginBottom: "1.5rem" };
const submitButtonStyle = { width: "100%", padding: "14px", color: "white", border: "none", borderRadius: "8px", fontSize: "1rem", fontWeight: "bold", cursor: "pointer" };
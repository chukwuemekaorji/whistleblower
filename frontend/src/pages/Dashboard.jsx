import React, { useState, useEffect } from "react";
import api from "../api.js";
import ReportCard from "../components/ReportCard.jsx";

export default function Dashboard() {
    const [reports, setReports] = useState([]);
    const [companyToken, setCompanyToken] = useState("");
    const [loading, setLoading] = useState(true);
    
    // ADD THIS STATE HERE - This was the missing variable!
    const [copied, setCopied] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);

            // 1. Fetch user profile to get the token immediately (Works even with 0 reports)
            const userRes = await api.get("/auth/me");
            
            // Checking common nested structures for your token
            const token = userRes.data?.company?.token || userRes.data?.company_token;
            
            if (token) {
                setCompanyToken(token);
            }

            // 2. Fetch reports for the list
            const reportsRes = await api.get("/reports/");
            setReports(reportsRes.data);

        } catch (err) {
            console.error("Error fetching dashboard data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleStatusChange = async (id, status) => {
        try {
            await api.patch(`/reports/${id}/status`, { status });
            fetchData();
        } catch (err) {
            alert("Failed to update status");
        }
    };

    const magicLink = companyToken 
        ? `${window.location.origin}/report/${companyToken}` 
        : "Generating link...";

    return (
        <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", padding: "2rem" }}>
            <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                
                <header style={headerStyle}>
                    <h1 style={{ color: "#2c3e50", margin: 0 }}>🛡️ Reports Dashboard</h1>
                    <button 
                        onClick={() => { localStorage.removeItem("token"); window.location.href = "/login"; }}
                        style={logoutButtonStyle}
                    >
                        Logout
                    </button>
                </header>

                <div style={linkBoxStyle}>
                    <p style={{ margin: "0 0 10px 0", fontWeight: "600", color: "#34495e" }}>
                        📢 Share this Magic Link with employees:
                    </p>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <input 
                            readOnly 
                            value={magicLink} 
                            style={linkInputStyle}
                            onClick={(e) => e.target.select()}
                        />
                        <button 
                            onClick={() => {
                                navigator.clipboard.writeText(magicLink);
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000);
                            }}
                            style={{
                                ...copyButtonStyle,
                                backgroundColor: copied ? "#27ae60" : "#2c3e50"
                            }}
                        >
                            {copied ? "Copied! ✓" : "Copy Link"}
                        </button>
                    </div>
                </div>

                {loading ? (
                    <p>Loading reports...</p>
                ) : reports.length === 0 ? (
                    <div style={emptyStateStyle}>
                        <p>No reports submitted yet. 🍵</p>
                        <p style={{ fontSize: "0.85rem", color: "#95a5a6" }}>
                            Share your link above to start receiving reports.
                        </p>
                    </div>
                ) : (
                    reports.map(report => (
                        <ReportCard 
                            key={report.id} 
                            report={report} 
                            onStatusChange={handleStatusChange} 
                        />
                    ))
                )}
            </div>
        </div>
    );
}

// STYLES
const headerStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", gap: "20px", flexWrap: "wrap" };
const logoutButtonStyle = { padding: "10px 20px", backgroundColor: "#fff", color: "#dc3545", border: "2px solid #dc3545", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" };
const linkBoxStyle = { backgroundColor: "#fff", padding: "1.5rem", borderRadius: "12px", border: "1px solid #e1e8ed", marginBottom: "2rem", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" };
const linkInputStyle = { flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #ced4da", backgroundColor: "#f1f3f5", fontSize: "0.9rem", color: "#495057" };
const copyButtonStyle = { padding: "10px 20px", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", transition: "all 0.3s ease" };
const emptyStateStyle = { textAlign: "center", padding: "4rem", backgroundColor: "white", borderRadius: "12px", border: "1px dashed #ced4da" };
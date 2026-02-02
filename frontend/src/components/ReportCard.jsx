import React from "react";

export default function ReportCard({ report, onStatusChange }) {
    // Logic to pick colors for each status
    const getStatusStyle = (status) => {
        const styles = {
            NEW: { bg: "#e3f2fd", color: "#0d47a1", label: "New" },
            IN_REVIEW: { bg: "#fff3e0", color: "#e65100", label: "In Review" },
            RESOLVED: { bg: "#e8f5e9", color: "#1b5e20", label: "Resolved" },
            REJECTED: { bg: "#ffebee", color: "#b71c1c", label: "Rejected" },
        };
        return styles[status] || { bg: "#f5f5f5", color: "#333", label: status };
    };

    const style = getStatusStyle(report.status);

    return (
        <div style={{
            backgroundColor: "white",
            border: "1px solid #eee",
            borderRadius: "12px",
            padding: "1.5rem",
            marginBottom: "1.5rem",
            boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
            transition: "transform 0.2s"
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <h3 style={{ margin: "0 0 10px 0", color: "#2c3e50" }}>{report.title}</h3>
                <span style={{
                    backgroundColor: style.bg,
                    color: style.color,
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "0.85rem",
                    fontWeight: "bold",
                    textTransform: "uppercase"
                }}>
                    {style.label}
                </span>
            </div>

            <p style={{ color: "#505c6d", lineHeight: "1.5" }}>{report.description}</p>
            
            <hr style={{ border: "0", borderTop: "1px solid #eee", margin: "1rem 0" }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.9rem" }}>
                <div>
                    <p style={{ margin: "2px 0" }}>
                        <strong>Anonymous:</strong> {report.is_anonymous ? "✅ Yes" : "❌ No"}
                    </p>
                    {!report.is_anonymous && (
                        <p style={{ margin: "2px 0", color: "#007bff" }}>
                            <strong>Contact:</strong> {report.contact_info}
                        </p>
                    )}
                </div>

                <div style={{ textAlign: "right" }}>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#888", marginBottom: "5px" }}>
                        UPDATE STATUS
                    </label>
                    <select
                        value={report.status}
                        onChange={(e) => onStatusChange(report.id, e.target.value)}
                        style={{
                            padding: "5px 10px",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                            cursor: "pointer"
                        }}
                    >
                        <option value="NEW">New</option>
                        <option value="IN_REVIEW">In Review</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
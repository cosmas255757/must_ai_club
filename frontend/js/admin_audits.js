const loadFullAuditLogs = async () => {
    const tableBody = document.getElementById("log-body");
    const token = localStorage.getItem("token");

    // Exit silently if this element isn't on the current page
    if (!tableBody) return;

    if (!token) {
        window.location.href = "/login.html";
        return;
    }

    try {
        const response = await fetch("/api/admin/logs?limit=100", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();

        if (result.success) {
            // Clear static rows
            tableBody.innerHTML = "";

            if (result.data && result.data.length > 0) {
                result.data.forEach(log => {
                    const row = document.createElement("tr");

                    // Date Formatting: YYYY-MM-DD HH:MM:SS
                    const date = new Date(log.created_at);
                    const formattedDate = date.toISOString().split('T')[0] + ' ' + date.toLocaleTimeString([], { hour12: false });

                    // Use User Name or a Shortened Log ID if System event
                    const displayUser = log.user_name || (log.id ? `sys_${log.id.substring(0, 5)}` : "System");

                    row.innerHTML = `
                        <td class="timestamp" data-label="Timestamp">${formattedDate}</td>
                        <td class="user-ref" data-label="User ID">${displayUser}</td>
                        <td class="action-text" data-label="Action">${log.action}</td>
                        <td style="color: #10b981;" data-label="Status">SUCCESS</td>
                    `;

                    tableBody.appendChild(row);
                });
            } else {
                tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 20px; color: #64748b;">No logs found in the last 72 hours.</td></tr>`;
            }
        }
    } catch (error) {
        console.error("Audit Log Error:", error);
        if (tableBody) {
            tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color: #ef4444; padding: 20px;">Failed to sync with database.</td></tr>`;
        }
    }
};

// --- SAFE INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
    // 1. Load Audit Logs only if the table exists (Audit Page)
    if (document.getElementById("log-body")) {
        loadFullAuditLogs();
        // Refresh every 10 minutes as per your request (600000ms)
        setInterval(loadFullAuditLogs, 600000);
    }

    // 2. Load Dashboard Data only if count elements exist (Dashboard Page)
    if (document.getElementById("count-users")) {
        if (typeof loadAdminDashboard === "function") loadAdminDashboard();
        if (typeof loadActivityLogs === "function") loadActivityLogs();
        
        // Dashboard refresh (usually faster, e.g., 30s)
        setInterval(() => {
            if (typeof loadAdminDashboard === "function") loadAdminDashboard();
            if (typeof loadActivityLogs === "function") loadActivityLogs();
        }, 30000);
    }

    // 3. Attach Quick Action Buttons ONLY if they exist on the current page
    const btnBackup = document.getElementById("btn-backup");
    const btnCache = document.getElementById("btn-cache");
    const btnLockdown = document.getElementById("btn-lockdown");

    if (btnBackup) {
        btnBackup.addEventListener("click", () => performAdminAction("btn-backup", "backup", "Backup"));
    }
    if (btnCache) {
        btnCache.addEventListener("click", () => performAdminAction("btn-cache", "clear-cache", "Clear Cache"));
    }
    if (btnLockdown) {
        btnLockdown.addEventListener("click", () => {
            if (confirm("CRITICAL: Suspend all non-admin users?")) {
                performAdminAction("btn-lockdown", "lockdown", "Lockdown");
            }
        });
    }
});

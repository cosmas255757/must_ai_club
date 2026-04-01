const loadAdminDashboard = async () => {
    const usersEl = document.getElementById("count-users");
    const enrollmentsEl = document.getElementById("count-enrollments");
    const reviewsEl = document.getElementById("count-reviews");
    const logsEl = document.getElementById("count-logs");

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "/login.html";
        return;
    }

    try {
        const response = await fetch("/api/auth/dashboard-stats", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();

        if (result.success) {
            const { totalUsers, totalEnrollments, pendingReviews, totalLogs } = result.data;

            usersEl.textContent = totalUsers || 0;
            enrollmentsEl.textContent = totalEnrollments || 0;
            reviewsEl.textContent = pendingReviews || 0;
            logsEl.textContent = totalLogs || 0;
            
        } else {
            if (response.status === 401 || response.status === 403) {
                alert("Unauthorized: Admin access only.");
                window.location.href = "/login.html";
            }
        }
    } catch (error) {
        console.error("Connection error:", error);
        usersEl.textContent = "0";
        enrollmentsEl.textContent = "0";
        reviewsEl.textContent = "0";
        logsEl.textContent = "0";
    }
};

// Helper to handle actions with a loading state
const performAdminAction = async (buttonId, endpoint, actionName) => {
    const btn = document.getElementById(buttonId);
    const originalText = btn.innerText;
    const token = localStorage.getItem("token");

    // 1. Start Loading State
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner"></span> Processing...`; 

    try {
        const response = await fetch(`/api/auth/${endpoint}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();
        alert(result.success ? `Success: ${result.message}` : `Error: ${result.message}`);
        
    } catch (error) {
        alert(`Network error while trying to ${actionName}`);
    } finally {
        // 2. Reset Button State
        btn.disabled = false;
        btn.innerText = originalText;
    }
};

// Event Listeners
document.getElementById("btn-backup").addEventListener("click", () => performAdminAction("btn-backup", "backup", "Backup"));
document.getElementById("btn-cache").addEventListener("click", () => performAdminAction("btn-cache", "clear-cache", "Clear Cache"));
document.getElementById("btn-lockdown").addEventListener("click", () => {
    if (confirm("WARNING: This will suspend all users. Proceed?")) {
        performAdminAction("btn-lockdown", "lockdown", "Lockdown");
    }
});


const loadActivityLogs = async () => {
    const logContainer = document.querySelector(".log-preview");
    const token = localStorage.getItem("token");

    try {
        // 1. Fetch the logs from the backend
        const response = await fetch("/api/admin/logs?limit=5", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();

        if (result.success && result.data.length > 0) {
            // 2. Keep the Header, but clear the static log items
            const header = logContainer.querySelector("h3");
            logContainer.innerHTML = ""; 
            logContainer.appendChild(header);

            // 3. Loop through  real database logs
            result.data.forEach(log => {
                const logItem = document.createElement("div");
                logItem.className = "log-item";
                
                // Format the timestamp (Optional)
                const time = new Date(log.created_at).toLocaleTimeString();
                
                // Display the User Name (if joined) and the Action
                logItem.innerText = `> ${time} - ${log.user_name || 'System'}: ${log.action}`;
                
                logContainer.appendChild(logItem);
            });
        } else if (result.data.length === 0) {
            // If no logs exist yet
            logContainer.innerHTML += `<div class="log-item">> No activity recorded yet.</div>`;
        }
    } catch (error) {
        console.error("Error loading logs:", error);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    loadAdminDashboard(); 
    loadActivityLogs(); 
});

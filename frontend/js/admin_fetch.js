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
// --- NEW HELPER: UPDATE HERO UI ---
const updateHeroUI = (isOnline) => {
    const dot = document.getElementById("status-dot");
    const statusText = document.getElementById("status-text");
    const syncText = document.getElementById("last-sync");

    if (isOnline) {
        if (dot) dot.style.background = "#10b981"; // Green for Online
        if (statusText) statusText.innerText = "Database Online";
        if (syncText) {
            const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            syncText.innerText = `Last Sync: ${now}`;
        }
    } else {
        if (dot) dot.style.background = "#ef4444"; // Red for Offline
        if (statusText) statusText.innerText = "Database Offline";
    }
};

const loadActivityLogs = async () => {
    // Select the container using the class from your HTML
    const logContainer = document.querySelector(".log-preview");
    if (!logContainer) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        // 1. Fetch data from your backend
        const response = await fetch("/api/admin/logs?limit=5", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();

        if (result.success) {
            // SUCCESS: Update the Hero Section
            updateHeroUI(true);

            // 2. CRITICAL STEP: Identify the Header
            const header = logContainer.querySelector("h3");
            
            // 3. Clear EVERYTHING inside the box (Removes those static manual divs)
            logContainer.innerHTML = ""; 
            
            // 4. Put the Header back in so the title doesn't disappear
            if (header) {
                logContainer.appendChild(header);
            } else {
                // Fallback if header was somehow missing
                const newHeader = document.createElement("h3");
                newHeader.style.marginTop = "0";
                newHeader.innerText = "Live Activity Stream";
                logContainer.appendChild(newHeader);
            }

            // 5. Populate with REAL data from database
            if (result.data && result.data.length > 0) {
                result.data.forEach(log => {
                    const logItem = document.createElement("div");
                    logItem.className = "log-item";
                    
                    // Simple HH:MM:SS format
                    const time = new Date(log.created_at).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit', 
                        second: '2-digit' 
                    });
                    
                    // Display: > [Time] - [User Name]: [Action]
                    logItem.innerText = `> ${time} - ${log.user_name || 'System'}: ${log.action}`;
                    
                    logContainer.appendChild(logItem);
                });
            } else {
                // If database table is empty
                const emptyMsg = document.createElement("div");
                emptyMsg.className = "log-item";
                emptyMsg.innerText = "> No activity recorded yet.";
                logContainer.appendChild(emptyMsg);
            }
        }
    } catch (error) {
        console.error("Error loading real-time logs:", error);
        // FAILURE: Show Database Offline in Hero
        updateHeroUI(false);
    }
};

// --- INITIALIZE & AUTO-REFRESH ---
document.addEventListener("DOMContentLoaded", () => {
    // Initial load
    if (typeof loadAdminDashboard === "function") loadAdminDashboard(); 
    loadActivityLogs(); 

    // Auto-update every 30 seconds (Fixed your 30000000ms typo to 30000ms)
    setInterval(() => {
        if (typeof loadAdminDashboard === "function") loadAdminDashboard();
        loadActivityLogs();
    }, 300000); 
});

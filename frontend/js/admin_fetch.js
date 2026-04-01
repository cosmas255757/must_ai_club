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

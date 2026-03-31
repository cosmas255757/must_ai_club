const loadAdminDashboard = async () => {
    const usersEl = document.getElementById("count-users");
    const enrollmentsEl = document.getElementById("count-enrollments");
    const reviewsEl = document.getElementById("count-reviews");
    const logsEl = document.getElementById("count-logs");

    // Get token from storage
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "/login.html";
        return;
    }

    try {
        const response = await fetch("/api/admin/dashboard-stats", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();

        if (result.success) {
            const { totalUsers, totalEnrollments, pendingReviews, totalLogs } = result.data;

            // Update UI: Use || 0 to ensure "0" is displayed if the count is null/undefined
            usersEl.textContent = totalUsers || 0;
            enrollmentsEl.textContent = totalEnrollments || 0;
            reviewsEl.textContent = pendingReviews || 0;
            logsEl.textContent = totalLogs || 0;
            
        } else {
            // Handle unauthorized access
            if (response.status === 401 || response.status === 403) {
                alert("Unauthorized: Admin access only.");
                window.location.href = "/login.html";
            }
        }
    } catch (error) {
        console.error("Connection error:", error);
        // Display 0 on error to keep the UI clean
        usersEl.textContent = "0";
        enrollmentsEl.textContent = "0";
        reviewsEl.textContent = "0";
        logsEl.textContent = "0";
    }
};

// Execute once the HTML is ready
document.addEventListener("DOMContentLoaded", loadAdminDashboard);

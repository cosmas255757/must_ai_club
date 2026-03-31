const fetchDashboardStats = async () => {
    //Get the token for additional security
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("No token found, redirecting to login...");
        window.location.href = "/login.html";
        return;
    }

    try {
        // Fetch data from backend
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

            // Update the HTML elements with the counts
            document.getElementById("count-users").innerText = totalUsers;
            document.getElementById("count-enrollments").innerText = totalEnrollments;
            document.getElementById("count-reviews").innerText = pendingReviews;
            document.getElementById("count-logs").innerText = totalLogs;
        } else {
            console.error("Failed to fetch stats:", result.message);
            // If token is expired or unauthorized
            if (response.status === 401 || response.status === 403) {
                alert("Session expired. Please login as admin.");
                window.location.href = "/login.html";
            }
        }
    } catch (error) {
        console.error("Error connecting to backend:", error);
    }
};

// Run the function when the page loads
document.addEventListener("DOMContentLoaded", fetchDashboardStats);

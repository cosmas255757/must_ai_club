(function () {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const path = window.location.pathname;

    if (!token || !user) {
        if (!path.includes("auth.html") && !path.includes("index.html")) {
            window.location.href = "/auth.html";
        }
        return;
    }

    const rolePaths = {
        admin: "/admin/",
        facilitator: "/facilitator/",
        sponsor: "/sponsor/",
        student: "/student/"
    };

    for (const [role, folder] of Object.entries(rolePaths)) {
        if (path.includes(folder) && user.role !== role) {
            alert("Access Denied: You do not have permission for this area.");
            
            window.location.href = `${rolePaths[user.role]}dashboard.html`;
            break;
        }
    }
})();

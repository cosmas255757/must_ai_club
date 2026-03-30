document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user")) || { name: "Student" };
    const currentPath = window.location.pathname;

    // 1. Inject CSS for Layout
    const style = document.createElement('style');
    style.innerHTML = `
        :root {
            --primary: #2c3e50;
            --secondary: #34495e;
            --accent: #3498db;
            --text-light: #ecf0f1;
            --danger: #e74c3c;
        }
        body { display: flex; min-height: 100vh; flex-direction: column; margin: 0; font-family: sans-serif; background: #f4f7f6; }
        .app-container { display: flex; flex: 1; }
        
        /* Sidebar Styling */
        .sidebar { width: 250px; background: var(--primary); color: white; display: flex; flex-direction: column; padding: 20px; box-shadow: 2px 0 5px rgba(0,0,0,0.1); }
        .sidebar h2 { color: var(--accent); margin-bottom: 30px; text-align: center; }
        .sidebar nav a { color: var(--text-light); text-decoration: none; padding: 12px 15px; margin: 5px 0; border-radius: 5px; transition: 0.3s; display: block; }
        .sidebar nav a:hover, .sidebar nav a.active { background: var(--secondary); border-left: 4px solid var(--accent); }
        .logout-btn { margin-top: auto; background: var(--danger); border: none; color: white; padding: 10px; cursor: pointer; border-radius: 5px; }

        /* Footer Styling */
        footer { background: var(--primary); color: white; text-align: center; padding: 20px; margin-top: auto; border-top: 3px solid var(--accent); }
        .footer-content { font-size: 0.9rem; opacity: 0.8; }
        
        .main-content { flex: 1; padding: 30px; }
    `;
    document.head.appendChild(style);

    // 2. Create Sidebar HTML
    const sidebarHTML = `
        <aside class="sidebar">
            <h2>MUST AI HUB</h2>
            <nav>
                <a href="dashboard" class="${currentPath.includes('dashboard') ? 'active' : ''}">📊 Dashboard</a>
                <a href="courses" class="${currentPath.includes('courses') ? 'active' : ''}">📚 Courses</a>
                <a href="events" class="${currentPath.includes('events') ? 'active' : ''}">📅 Events</a>
                <a href="projects" class="${currentPath.includes('projects') ? 'active' : ''}">🚀 Projects</a>
                <a href="profile" class="${currentPath.includes('profile') ? 'active' : ''}">👤 Profile</a>
            </nav>
            <button class="logout-btn" onclick="logout()">Logout</button>
        </aside>
    `;

    // 3. Create Footer HTML
    const footerHTML = `
        <footer>
            <div class="footer-content">
                <p>&copy; 2024 MUST AI HUB - Empowering Innovation</p>
                <small>Mbeya University of Science and Technology</small>
            </div>
        </footer>
    `;

    // 4. Wrap existing content
    const bodyContent = document.body.innerHTML;
    document.body.innerHTML = `
        <div class="app-container">
            ${sidebarHTML}
            <main class="main-content">
                ${bodyContent}
            </main>
        </div>
        ${footerHTML}
    `;
});

// Logout utility
function logout() {
    localStorage.clear();
    window.location.href = "/auth";
}

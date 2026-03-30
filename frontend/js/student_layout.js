document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user")) || { name: "Student" };
    const currentPath = window.location.pathname;

    // 1. Updated CSS for Top Navbar and Sticky Footer
    const style = document.createElement('style');
    style.innerHTML = `
        :root {
            --primary: #2c3e50;
            --secondary: #34495e;
            --accent: #3498db;
            --text-light: #ecf0f1;
            --danger: #e74c3c;
        }
        /* Flex column ensures footer pushes to bottom */
        body { 
            display: flex; 
            flex-direction: column; 
            min-height: 100vh; 
            margin: 0; 
            font-family: sans-serif; 
            background: #f4f7f6; 
        }

        /* Top Navbar Styling */
        .navbar { 
            background: var(--primary); 
            color: white; 
            display: flex; 
            align-items: center; 
            justify-content: space-between; 
            padding: 0 40px; 
            height: 70px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .navbar h2 { color: var(--accent); margin: 0; font-size: 1.5rem; }
        .nav-links { display: flex; gap: 10px; }
        .nav-links a { 
            color: var(--text-light); 
            text-decoration: none; 
            padding: 10px 15px; 
            border-radius: 5px; 
            transition: 0.3s; 
        }
        .nav-links a:hover, .nav-links a.active { 
            background: var(--secondary); 
            border-bottom: 3px solid var(--accent); 
        }

        .main-content { 
            flex: 1; /* This pushes the footer down */
            padding: 30px; 
        }

        /* Footer Styling */
        footer { 
            background: var(--primary); 
            color: white; 
            text-align: center; 
            padding: 20px; 
            border-top: 3px solid var(--accent); 
        }
        .footer-content { font-size: 0.9rem; opacity: 0.8; }
        
        .logout-btn { 
            background: var(--danger); 
            border: none; 
            color: white; 
            padding: 8px 15px; 
            cursor: pointer; 
            border-radius: 5px; 
            margin-left: 15px;
        }
    `;
    document.head.appendChild(style);

    // 2. Create Top Navbar HTML
    const navbarHTML = `
        <header class="navbar">
            <h2>MUST AI HUB</h2>
            <nav class="nav-links">
                <a href="dashboard" class="${currentPath.includes('dashboard') ? 'active' : ''}">📊 Dashboard</a>
                <a href="courses" class="${currentPath.includes('courses') ? 'active' : ''}">📚 Courses</a>
                <a href="events" class="${currentPath.includes('events') ? 'active' : ''}">📅 Events</a>
                <a href="projects" class="${currentPath.includes('projects') ? 'active' : ''}">🚀 Projects</a>
                <a href="profile" class="${currentPath.includes('profile') ? 'active' : ''}">👤 Profile</a>
                <button class="logout-btn" onclick="logout()">Logout</button>
            </nav>
        </header>
    `;

    // 3. Create Footer HTML (Automatic Year)
    const footerHTML = `
        <footer>
            <div class="footer-content">
                <p>&copy; ${new Date().getFullYear()} MUST AI HUB - Empowering Innovation</p>
                <small>Mbeya University of Science and Technology</small>
            </div>
        </footer>
    `;

    // 4. Reconstruct Body
    const bodyContent = document.body.innerHTML;
    document.body.innerHTML = `
        ${navbarHTML}
        <main class="main-content">
            ${bodyContent}
        </main>
        ${footerHTML}
    `;
});

function logout() {
    localStorage.clear();
    window.location.href = "/auth";
}

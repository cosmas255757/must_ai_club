document.addEventListener("DOMContentLoaded", () => {
    const currentPath = window.location.pathname;

    // 1. Inject Responsive & Animated CSS
    const style = document.createElement('style');
    style.innerHTML = `
        :root {
            --primary: #0f172a;
            --secondary: #1e293b;
            --accent: #38bdf8;
            --text-light: #f1f5f9;
            --danger: #ef4444;
            --sidebar-width: 260px;
        }

        * { box-sizing: border-box; transition: all 0.3s ease; }
        body { 
            margin: 0; 
            font-family: 'Inter', sans-serif; 
            background: #f8fafc; 
            display: flex; 
            flex-direction: column; 
            min-height: 100vh;
            overflow-x: hidden;
        }

        /* Layout Animation */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .app-container { display: flex; flex: 1; position: relative; }

        /* Mobile Header */
        .mobile-header {
            display: none;
            background: var(--primary);
            color: white;
            padding: 15px 20px;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        /* Sidebar Styling */
        .sidebar { 
            width: var(--sidebar-width); 
            background: var(--primary); 
            color: white; 
            display: flex; 
            flex-direction: column; 
            padding: 30px 20px; 
            height: 100vh;
            position: fixed;
            left: 0;
            top: 0;
            z-index: 999;
        }

        .sidebar h2 { 
            color: var(--accent); 
            font-size: 1.4rem; 
            margin-bottom: 40px; 
            letter-spacing: 1px;
            text-align: center;
        }

        .sidebar nav a { 
            color: #94a3b8; 
            text-decoration: none; 
            padding: 14px 18px; 
            margin: 8px 0; 
            border-radius: 12px; 
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 500;
        }

        .sidebar nav a:hover { color: white; background: var(--secondary); transform: translateX(5px); }
        .sidebar nav a.active { 
            background: var(--accent); 
            color: var(--primary); 
            box-shadow: 0 4px 15px rgba(56, 189, 248, 0.3);
        }

        .logout-btn { 
            margin-top: auto; 
            background: rgba(239, 68, 68, 0.1); 
            border: 1px solid var(--danger); 
            color: var(--danger); 
            padding: 12px; 
            cursor: pointer; 
            border-radius: 10px;
            font-weight: bold;
        }
        .logout-btn:hover { background: var(--danger); color: white; }

        /* Main Content Area */
        .main-content { 
            flex: 1; 
            margin-left: var(--sidebar-width); 
            padding: 40px; 
            animation: fadeIn 0.6s ease-out;
        }

        /* Footer */
        footer { 
            background: white; 
            color: #64748b; 
            text-align: center; 
            padding: 25px; 
            margin-left: var(--sidebar-width);
            border-top: 1px solid #e2e8f0;
        }

        /* Responsive Logic */
        @media (max-width: 992px) {
            .mobile-header { display: flex; }
            .sidebar { 
                transform: translateX(-100%); 
                width: 100%;
                height: 100%;
            }
            .sidebar.active { transform: translateX(0); }
            .main-content, footer { margin-left: 0; padding: 20px; }
            .menu-toggle { background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; }
        }
    `;
    document.head.appendChild(style);

    // 2. Wrap Body in Component Structure
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = `
        <div class="mobile-header">
            <strong>MUST AI HUB</strong>
            <button class="menu-toggle" id="menuToggle">☰</button>
        </div>
        <div class="app-container">
            <aside class="sidebar" id="sidebar">
                <h2>MUST AI HUB</h2>
                <nav>
                    <a href="dashboard" class="${currentPath.includes('dashboard') ? 'active' : ''}">📊 Dashboard</a>
                    <a href="courses" class="${currentPath.includes('courses') ? 'active' : ''}">📚 Courses</a>
                    <a href="events" class="${currentPath.includes('events') ? 'active' : ''}">📅 Events</a>
                    <a href="projects" class="${currentPath.includes('projects') ? 'active' : ''}">🚀 Projects</a>
                    <a href="profile" class="${currentPath.includes('profile') ? 'active' : ''}">👤 Profile</a>
                </nav>
                <button class="logout-btn" onclick="logout()">Log Out</button>
            </aside>
            <main class="main-content">
                ${originalContent}
            </main>
        </div>
        <footer>
              <p>&copy; ${new Date().getFullYear()} MUST AI HUB - Mbeya University of Science and Technology. All Rights Reserved.</p>
        </footer>
    `;

    // 3. Toggle Mobile Menu Logic
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");

    if (menuToggle) {
        menuToggle.addEventListener("click", () => {
            sidebar.classList.toggle("active");
            menuToggle.innerText = sidebar.classList.contains("active") ? "✕" : "☰";
        });
    }
});

function logout() {
    localStorage.clear();
    window.location.href = "/auth";
}

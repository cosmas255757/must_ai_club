document.addEventListener("DOMContentLoaded", () => {
    const currentPath = window.location.pathname;

    // 1. Inject Advanced Responsive & Indigo Themed CSS
    const style = document.createElement('style');
    style.innerHTML = `
        :root {
            --primary: #1e1b4b; /* Deep Indigo */
            --secondary: #312e81;
            --accent: #818cf8;
            --text-light: #f1f5f9;
            --danger: #ef4444;
            --sidebar-width: 260px;
        }

        * { box-sizing: border-box; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        
        body { 
            margin: 0; 
            font-family: 'Inter', sans-serif; 
            background: #f8fafc; 
            display: flex; 
            flex-direction: column; 
            min-height: 100vh;
            overflow-x: hidden;
        }

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
            z-index: 1100;
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
            z-index: 1050;
        }

        .sidebar h2 { 
            color: var(--accent); 
            font-size: 1.2rem; 
            margin-bottom: 40px; 
            text-align: center; 
            border-bottom: 1px solid rgba(255,255,255,0.1); 
            padding-bottom: 15px;
            letter-spacing: 1px;
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
            color: white; 
            box-shadow: 0 4px 15px rgba(129, 140, 248, 0.4);
            font-weight: bold;
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
            transition: 0.3s;
        }
        .logout-btn:hover { background: var(--danger); color: white; }

        /* Main Content Area */
        .main-content { 
            flex: 1; 
            margin-left: var(--sidebar-width); 
            padding: 40px; 
            animation: fadeIn 0.6s ease-out;
        }

        /* Mobile Overlay */
        .menu-overlay {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(3px);
            z-index: 1040;
            opacity: 0;
        }

        /* Responsive Logic */
        @media (max-width: 992px) {
            .mobile-header { display: flex; }
            
            .sidebar { 
                transform: translateX(-100%); 
                width: 280px; 
            }
            
            .sidebar.active { 
                transform: translateX(0); 
                box-shadow: 10px 0 30px rgba(0,0,0,0.3);
            }

            .sidebar.active ~ .menu-overlay {
                display: block;
                opacity: 1;
            }

            .main-content { 
                margin-left: 0; 
                padding: 20px; 
            }

            .menu-toggle { 
                background: none; 
                border: none; 
                color: white; 
                font-size: 1.5rem; 
                cursor: pointer; 
            }
        }
    `;
    document.head.appendChild(style);

    // 2. Wrap Body in Component Structure
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = `
        <div class="mobile-header">
            <strong>FACILITATOR PORTAL</strong>
            <button class="menu-toggle" id="menuToggle">☰</button>
        </div>
        <div class="app-container">
            <aside class="sidebar" id="sidebar">
                <h2>FACILITATOR PORTAL</h2>
                <nav>
                    <a href="dashboard" class="${currentPath.includes('dashboard') ? 'active' : ''}">🏠 Dashboard</a>
                    <a href="manage-courses" class="${currentPath.includes('manage-courses') ? 'active' : ''}">📚 My Courses</a>
                    <a href="review-projects" class="${currentPath.includes('review-projects') ? 'active' : ''}">⚖️ Review Projects</a>
                    <a href="announcements" class="${currentPath.includes('announcements') ? 'active' : ''}">📢 Announcements</a>
                    <a href="profile" class="${currentPath.includes('profile') ? 'active' : ''}">👤 Profile</a>
                </nav>
                <button class="logout-btn" onclick="logout()">Log Out</button>
            </aside>
            <div class="menu-overlay" id="menuOverlay"></div>
            <main class="main-content">
                ${originalContent}
            </main>
        </div>
        <footer style="text-align: center; padding: 25px; color: #64748b; font-size: 0.9rem; border-top: 1px solid #e2e8f0; background: white; margin-left: var(--sidebar-width); transition: margin 0.3s;">
             <p>&copy; ${new Date().getFullYear()} MUST AI HUB - Faculty Division. All Rights Reserved.</p>
        </footer>
    `;

    // 3. Toggle Mobile Menu Logic
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");
    const menuOverlay = document.getElementById("menuOverlay");
    const footer = document.querySelector('footer');

    function toggleMenu() {
        const isActive = sidebar.classList.toggle("active");
        menuToggle.innerText = isActive ? "✕" : "☰";
    }

    if (menuToggle) menuToggle.addEventListener("click", toggleMenu);
    if (menuOverlay) menuOverlay.addEventListener("click", toggleMenu);

    // Adjust footer margin for mobile
    if (window.innerWidth <= 992) {
        footer.style.marginLeft = "0";
    }
});

function logout() {
    localStorage.clear();
    window.location.href = "/auth";
}

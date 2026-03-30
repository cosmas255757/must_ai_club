document.addEventListener("DOMContentLoaded", () => {
    const currentPath = window.location.pathname;

    const style = document.createElement('style');
    style.innerHTML = `
        :root {
            --primary: #064e3b; /* Deep Emerald */
            --secondary: #065f46;
            --accent: #10b981;
            --text-light: #f1f5f9;
            --sidebar-width: 260px;
        }

        * { box-sizing: border-box; transition: all 0.25s ease; }
        body { margin: 0; font-family: 'Inter', sans-serif; background: #f8fafc; display: flex; flex-direction: column; min-height: 100vh; }

        .app-container { display: flex; flex: 1; }

        /* Sidebar */
        .sidebar { 
            width: var(--sidebar-width); background: var(--primary); color: white; 
            display: flex; flex-direction: column; padding: 30px 20px; height: 100vh; position: fixed; 
        }
        .sidebar h2 { color: var(--accent); font-size: 1.2rem; margin-bottom: 40px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px;}
        
        .sidebar nav a { 
            color: #a7f3d0; text-decoration: none; padding: 14px 18px; margin: 8px 0; 
            border-radius: 12px; display: flex; align-items: center; gap: 12px; font-weight: 500;
        }
        .sidebar nav a:hover { color: white; background: var(--secondary); }
        .sidebar nav a.active { background: var(--accent); color: white; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4); }

        .main-content { flex: 1; margin-left: var(--sidebar-width); padding: 40px; }
    `;
    document.head.appendChild(style);

    document.body.innerHTML = `
        <div class="app-container">
            <aside class="sidebar">
                <h2>SPONSOR PORTAL</h2>
                <nav>
                    <a href="dashboard" class="${currentPath.includes('dashboard') ? 'active' : ''}">💹 Dashboard</a>
                    <a href="contributions" class="${currentPath.includes('contributions') ? 'active' : ''}">🤝 Contributions</a>
                    <a href="reports" class="${currentPath.includes('reports') ? 'active' : ''}">📊 Impact Reports</a>
                    <a href="profile" class="${currentPath.includes('profile') ? 'active' : ''}">👤 Profile</a>
                </nav>
                <button style="margin-top:auto; background:none; border:1px solid #ef4444; color:#ef4444; padding:10px; border-radius:8px; cursor:pointer;" onclick="logout()">Logout</button>
            </aside>
            <main class="main-content">${document.body.innerHTML}</main>
        </div>
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

function logout() { localStorage.clear(); window.location.href = "/auth"; }

function createNavbar() {
    const header = document.createElement('header');
    header.innerHTML = `
        <nav>
            <a href="index.html" class="logo"> Must AI Platform</a>
            <button class="menu-toggle" id="mobile-menu">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            </button>
            <ul class="nav-links" id="nav-menu">
                <li><a href="index.html">Home</a></li>
                <li><a href="about.html">About</a></li>
                <li><a href="contact.html">Contact</a></li>
                <li><a href="auth.html" class="btn-primary">Login</a></li>
            </ul>
        </nav>
    `;
    document.body.prepend(header);

    const menuBtn = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');

    menuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuBtn.classList.toggle('is-active'); 
    });
}

function createFooter() {
    const footer = document.createElement('footer');
    
    // Applying styles directly via JS
    Object.assign(footer.style, {
        background: 'rgba(10, 15, 29, 0.95)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '40px 20px',
        marginTop: '50px',
        textAlign: 'center',
        color: '#94a3b8',
        fontFamily: "'Inter', sans-serif"
    });

    footer.innerHTML = `
        <div style="max-width: 1200px; margin: 0 auto;">
            <div style="margin-bottom: 20px;">
                <h2 style="color: #fff; font-size: 1.5rem; margin-bottom: 10px;">AI & SIGNAL PROCESSING HUB</h2>
                <p style="font-size: 0.9rem; color: #64748b;">Advancing technology through intelligence and precision.</p>
            </div>
            <div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 20px;">
                <a href="#" style="color: #38bdf8; text-decoration: none; font-size: 0.9rem;">Twitter</a>
                <a href="#" style="color: #38bdf8; text-decoration: none; font-size: 0.9rem;">LinkedIn</a>
                <a href="#" style="color: #38bdf8; text-decoration: none; font-size: 0.9rem;">GitHub</a>
            </div>
            <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.05); margin-bottom: 20px;">
            <p style="font-size: 0.85rem;">
                &copy; ${new Date().getFullYear()} <span style="color: #38bdf8; font-weight: bold;">MUST AI HUB</span>. 
                Empowering Students, Innovators & Sponsors.
            </p>
        </div>
    `;
    document.body.appendChild(footer);
}

document.addEventListener('DOMContentLoaded', () => {
    createNavbar();
    createFooter();
});

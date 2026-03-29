// js/navfooter.js

function createNavbar() {
    const header = document.createElement('header');
    header.innerHTML = `
        <nav>
            <a href="index.html" class="logo">EduPlatform</a>
            <button class="menu-toggle" id="mobile-menu">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            </button>
            <ul class="nav-links" id="nav-menu">
                <li><a href="index.html">Home</a></li>
                <li><a href="about.html">About</a></li>
                <li><a href="contact.html">Contact</a></li>
                <li><a href="auth.html" class="btn-primary">Login / Sign Up</a></li>
            </ul>
        </nav>
    `;
    document.body.prepend(header);

    // Mobile Menu Logic
    const menuBtn = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');

    menuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuBtn.classList.toggle('is-active'); // For animating the bars if you want
    });
}

function createFooter() {
    const footer = document.createElement('footer');
    footer.innerHTML = `
        <div class="footer-container">
            <p>&copy; ${new Date().getFullYear()} EduPlatform. Empowering Students & Sponsors.</p>
        </div>
    `;
    document.body.appendChild(footer);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    createNavbar();
    createFooter();
});

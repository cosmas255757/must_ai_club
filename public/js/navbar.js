document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const navLinks = document.getElementById('nav-links');
    const navUsername = document.getElementById('nav-username');

    if (user) {
        navUsername.innerText = `Hi, ${user.username}`;

        // ✅ If Superadmin, add the extra management links
        if (user.is_superadmin) {
            navLinks.innerHTML += `
                <li><a href="/admin">Users</a></li>
                <li><a href="/roles">Roles & permissions</a></li>
            `;
        }
    }

    // ✅ Logout Logic
    document.getElementById('nav-logout-btn').addEventListener('click', () => {
        localStorage.clear();
        window.location.href = '/login';
    });
});

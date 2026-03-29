function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/auth.html";
}

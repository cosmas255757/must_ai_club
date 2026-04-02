        // Data Handling
        function loadUserData() {
            const userData = localStorage.getItem("user");
            if (userData) {
                const user = JSON.parse(userData);
                document.getElementById("adm-name").textContent = user.name || "N/A";
                document.getElementById("adm-email").textContent = user.email || "N/A";
                document.getElementById("adm-id").textContent = user.id || "---";
                document.getElementById("adm-role-badge").textContent = `Official ${user.role?.toUpperCase() || 'ADMIN'}`;
                
                // Pre-fill modal inputs
                document.getElementById("input-new-name").value = user.name || "";
                document.getElementById("input-new-email").value = user.email || "";
            }
        }

        // Modal Logic
        const modalUpdate = document.getElementById('modal-update');
        const modalPassword = document.getElementById('modal-password');

        document.getElementById('btn-update-details').onclick = () => modalUpdate.style.display = 'flex';
        document.getElementById('btn-reset-password').onclick = () => modalPassword.style.display = 'flex';

        function closeModals() {
            modalUpdate.style.display = 'none';
            modalPassword.style.display = 'none';
        }

        // Close on background click
        window.onclick = (event) => {
            if (event.target == modalUpdate || event.target == modalPassword) {
                closeModals();
            }
        }

        // Save Logic
        document.getElementById('save-profile-btn').onclick = () => {
            const newName = document.getElementById('input-new-name').value;
            const newEmail = document.getElementById('input-new-email').value;
            
            const userData = JSON.parse(localStorage.getItem("user") || "{}");
            userData.name = newName;
            userData.email = newEmail;
            
            localStorage.setItem("user", JSON.stringify(userData));
            loadUserData();
            closeModals();
            alert("Profile Updated Successfully!");
        };

        document.getElementById('save-password-btn').onclick = () => {
            const newPass = document.getElementById('input-new-pass').value;
            if(newPass.length < 8) {
                alert("Password must be at least 8 characters.");
                return;
            }
            alert("Password successfully updated (Local Simulated).");
            closeModals();
        };

        // Init
        document.addEventListener("DOMContentLoaded", loadUserData);
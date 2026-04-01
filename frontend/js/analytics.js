document.addEventListener('DOMContentLoaded', () => {
    // 1. Function to fetch data from the backend
    const fetchAnalytics = async () => {
        const token = localStorage.getItem("token"); // Retrieve your JWT token

        try {
            const response = await fetch('/api/auth/admin/reports', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();

            if (result.success) {
                updateUI(result.data);
            } else {
                console.error("Failed to load reports:", result.message);
            }
        } catch (error) {
            console.error("Error connecting to server:", error);
        }
    };

    // 2. Function to inject data into the HTML IDs
    const updateUI = (data) => {
        const { metrics, registrationTrend, sponsorships } = data;

        // Update Top Metrics
        document.getElementById('total-revenue').innerText = 
            `TZS ${Number(metrics.total_revenue).toLocaleString()}`;
        
        document.getElementById('active-enrollments').innerText = 
            Number(metrics.active_enrollments).toLocaleString();
            
        document.getElementById('success-rate').innerText = 
            `${metrics.success_rate || 0}%`;

        // Update User Registration Chart (Bars)
        const chartContainer = document.getElementById('registration-chart');
        chartContainer.innerHTML = ''; // Clear the mock bars

        registrationTrend.forEach(item => {
            // We calculate height based on the highest count or a fixed scale (e.g., max 100)
            const barHeight = Math.min(item.count * 10, 100); 
            
            const barHTML = `
                <div class="bar" style="height: ${barHeight}%;">
                    <span>${item.month}</span>
                </div>`;
            chartContainer.insertAdjacentHTML('beforeend', barHTML);
        });

        // Update Sponsorship Table
        const tableBody = document.getElementById('sponsorship-table-body');
        tableBody.innerHTML = ''; // Clear mock rows

        sponsorships.forEach(s => {
            const row = `
                <tr>
                    <td><strong>${s.sponsor_name}</strong></td>
                    <td><span style="color: ${s.type === 'money' ? '#10b981' : '#3b82f6'};">${s.type}</span></td>
                    <td>${s.type === 'money' ? 'TZS ' + Number(s.amount).toLocaleString() : s.description}</td>
                    <td>${new Date(s.last_active).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</td>
                </tr>`;
            tableBody.insertAdjacentHTML('beforeend', row);
        });
    };

    // 3. Initial Run
    fetchAnalytics();
});

const API_BASE = "/api";
const token = localStorage.getItem("token");

const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
};

// --- LOAD COURSES ---
async function loadCourses() {
    const res = await fetch(`${API_BASE}/courses`, { headers });
    const courses = await res.json();
    const container = document.getElementById("course-list");
    
    container.innerHTML = courses.map(course => `
        <div class="card">
            <h3>${course.title}</h3>
            <p>${course.description}</p>
            <button onclick="enroll('${course.id}')" class="btn">Enroll Now</button>
        </div>
    `).join('');
}

// --- ENROLL IN COURSE ---
async function enroll(courseId) {
    const res = await fetch(`${API_BASE}/enrollments`, {
        method: "POST",
        headers,
        body: JSON.stringify({ course_id: courseId })
    });
    const data = await res.json();
    alert(data.message || "Enrollment successful!");
}

// --- LOAD ANNOUNCEMENTS ---
async function loadAnnouncements() {
    const res = await fetch(`${API_BASE}/announcements`, { headers });
    const data = await res.json();
    // Logic to display announcements...
}

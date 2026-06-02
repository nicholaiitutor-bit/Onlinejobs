// =====================================
// CHECK ADMIN ACCESS
// =====================================

function isAdmin() {
    return currentUserRole === "admin";
}

// =====================================
// LOAD ADMIN PANEL
// =====================================

async function loadAdminDashboard() {

    if (!isAdmin()) return;

    const usersSnap = await db.collection("users").get();
    const jobsSnap = await db.collection("jobs").get();
    const appsSnap = await db.collection("applications").get();

    document.getElementById("totalUsers").innerText = usersSnap.size;
    document.getElementById("totalJobsAdmin").innerText = jobsSnap.size;
    document.getElementById("totalApplicationsAdmin").innerText = appsSnap.size;
}

// =====================================
// LOAD USERS
// =====================================

async function loadAdminUsers() {

    const container = document.getElementById("adminUsersContainer");
    container.innerHTML = "";

    const snap = await db.collection("users").get();

    snap.forEach(doc => {

        const user = doc.data();

        container.innerHTML += `
            <div class="job-card">

                <h3>${user.email}</h3>
                <p>Role: ${user.role}</p>

                <button onclick="deleteUser('${doc.id}')">
                    Delete User
                </button>

            </div>
        `;
    });
}

// =====================================
// LOAD JOBS
// =====================================

async function loadAdminJobs() {

    const container = document.getElementById("adminJobsContainer");
    container.innerHTML = "";

    const snap = await db.collection("jobs").get();

    snap.forEach(doc => {

        const job = doc.data();

        container.innerHTML += `
            <div class="job-card">

                <h3>${job.title}</h3>
                <p>${job.company}</p>

                <button onclick="deleteJob('${doc.id}')">
                    Delete Job
                </button>

            </div>
        `;
    });
}

// =====================================
// DELETE JOB
// =====================================

async function deleteJob(jobId) {

    if (!confirm("Delete this job?")) return;

    await db.collection("jobs").doc(jobId).delete();

    loadAdminJobs();
}

// =====================================
// DELETE USER
// =====================================

async function deleteUser(userId) {

    if (!confirm("Delete this user?")) return;

    await db.collection("users").doc(userId).delete();

    loadAdminUsers();
}

// =====================================
// ROUTE ADMIN VIEW
// =====================================

function openAdmin(view) {

    if (!isAdmin()) return;

    showView(view);

    if (view === "adminDashboard") {
        loadAdminDashboard();
    }

    if (view === "adminUsers") {
        loadAdminUsers();
    }

    if (view === "adminJobs") {
        loadAdminJobs();
    }
}

// =====================================
// POST JOB (EMPLOYER)
// =====================================

async function postJob() {

    if (!currentUser || currentUserRole !== "employer") {
        alert("Only employers can post jobs.");
        return;
    }

    const title = document.getElementById("jobTitle").value;
    const company = document.getElementById("jobCompany").value;
    const salary = document.getElementById("jobSalary").value;
    const description = document.getElementById("jobDescription").value;

    if (!title || !company || !description) {
        alert("Please complete all required fields.");
        return;
    }

    await db.collection("jobs").add({
        title,
        company,
        salary,
        description,
        ownerId: currentUser.uid,
        createdAt: getTimestamp(),
        active: true
    });

    alert("Job posted!");

    loadMyJobs();
}

// =====================================
// LOAD ALL JOBS (JOBSEEKER)
// =====================================

async function loadJobs() {

    const container = document.getElementById("jobsContainer");
    if (!container) return;

    container.innerHTML = "";

    const snapshot = await db.collection("jobs")
        .where("active", "==", true)
        .orderBy("createdAt", "desc")
        .get();

    snapshot.forEach(doc => {

        const job = doc.data();

        container.innerHTML += `
            <div class="job-card">

                <h3>${job.title}</h3>
                <p>${job.company}</p>
                <p>${job.salary || ""}</p>
                <p>${job.description}</p>

                ${currentUserRole === "jobseeker" ? `
                    <button onclick="applyJob('${doc.id}')">
                        Apply
                    </button>
                ` : ""}

            </div>
        `;
    });
}

// =====================================
// LOAD MY JOBS (EMPLOYER)
// =====================================

async function loadMyJobs() {

    const container = document.getElementById("myJobsContainer");
    if (!container) return;

    container.innerHTML = "";

    const snapshot = await db.collection("jobs")
        .where("ownerId", "==", currentUser.uid)
        .orderBy("createdAt", "desc")
        .get();

    snapshot.forEach(doc => {

        const job = doc.data();

        container.innerHTML += `
            <div class="job-card">

                <h3>${job.title}</h3>
                <p>${job.company}</p>

                <button onclick="viewApplicants('${doc.id}', '${job.title}')">
                    View Applicants
                </button>

            </div>
        `;
    });
}

// =====================================
// APPLY JOB (JOBSEEKER)
// =====================================

async function applyJob(jobId) {

    if (currentUserRole !== "jobseeker") {
        alert("Only jobseekers can apply.");
        return;
    }

    const existing = await db.collection("applications")
        .where("jobId", "==", jobId)
        .where("applicantId", "==", currentUser.uid)
        .get();

    if (!existing.empty) {
        alert("Already applied.");
        return;
    }

    await db.collection("applications").add({
        jobId,
        applicantId: currentUser.uid,
        status: "pending",
        createdAt: getTimestamp()
    });

    alert("Applied successfully!");
}

// =====================================
// VIEW APPLICANTS (EMPLOYER)
// =====================================

async function viewApplicants(jobId, jobTitle) {

    showView("applicants");

    const container = document.getElementById("applicantsContainer");
    container.innerHTML = "";

    const snapshot = await db.collection("applications")
        .where("jobId", "==", jobId)
        .get();

    for (const doc of snapshot.docs) {

        const app = doc.data();

        const userDoc = await db.collection("users")
            .doc(app.applicantId)
            .get();

        const user = userDoc.data();

        container.innerHTML += `
            <div class="applicant-card">

                <h3>${user.email}</h3>

                <p>Status: ${app.status}</p>

                <button onclick="updateApplicationStatus('${doc.id}', 'accepted')">
                    Accept
                </button>

                <button onclick="updateApplicationStatus('${doc.id}', 'rejected')">
                    Reject
                </button>

                <button onclick="messageApplicant('${app.applicantId}', '${jobId}', '${jobTitle}')">
                    Message
                </button>

            </div>
        `;
    }
}

// =====================================
// UPDATE APPLICATION STATUS
// =====================================

async function updateApplicationStatus(appId, status) {

    await db.collection("applications")
        .doc(appId)
        .update({ status });

    alert("Application " + status);
}

// =====================================
// SEARCH JOBS
// =====================================

function searchJobs(keyword) {

    const items = document.querySelectorAll(".job-card");

    items.forEach(item => {

        const text = item.innerText.toLowerCase();

        item.style.display =
            text.includes(keyword.toLowerCase())
                ? "block"
                : "none";
    });
}

// =====================================
// LIVE SEARCH
// =====================================

const jobSearchInput = document.getElementById("jobSearch");

if (jobSearchInput) {

    jobSearchInput.addEventListener("input", (e) => {
        searchJobs(e.target.value);
    });

}

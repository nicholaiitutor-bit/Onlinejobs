// =====================================
// POST JOB (EMPLOYER)
// =====================================

async function postJob() {

    if (!currentUser || currentUserRole !== "employer") {
        alert("Only employers can post jobs.");
        return;
    }

    const title =
        document.getElementById("jobTitle").value;

    const company =
        document.getElementById("jobCompany").value;

    const salary =
        document.getElementById("jobSalary").value;

    const description =
        document.getElementById("jobDescription").value;

    if (!title || !company || !description) {
        alert("Please complete all required fields.");
        return;
    }

    try {

        await db.collection("jobs").add({
            title,
            company,
            salary,
            description,
            ownerId: currentUser.uid,
            createdAt: getTimestamp(),
            active: true
        });

        alert("Job posted successfully!");

        document.getElementById("jobTitle").value = "";
        document.getElementById("jobCompany").value = "";
        document.getElementById("jobSalary").value = "";
        document.getElementById("jobDescription").value = "";

        loadMyJobs();

    } catch (error) {
        console.error(error);
    }
}

// =====================================
// LOAD ALL JOBS (JOBSEEKER)
// =====================================

async function loadJobs() {

    const container =
        document.getElementById("jobsContainer");

    if (!container) return;

    container.innerHTML = "";

    try {

        const snapshot =
            await db.collection("jobs")
            .where("active", "==", true)
            .orderBy("createdAt", "desc")
            .get();

        if (snapshot.empty) {
            renderEmptyState(
                "jobsContainer",
                "No jobs available"
            );
            return;
        }

        snapshot.forEach(doc => {

            const job = doc.data();

            container.innerHTML += `
                <div class="job-card">

                    <h3>${job.title}</h3>

                    <p>${job.company}</p>

                    <p>${job.salary || ""}</p>

                    <p>${job.description}</p>

                    ${
                        currentUserRole === "jobseeker"
                        ? `<button onclick="applyJob('${doc.id}')">
                            Apply
                           </button>`
                        : ""
                    }

                </div>
            `;
        });

    } catch (error) {
        console.error(error);
    }
}

// =====================================
// LOAD MY JOBS (EMPLOYER)
// =====================================

async function loadMyJobs() {

    if (!currentUser) return;

    const container =
        document.getElementById("myJobsContainer");

    if (!container) return;

    container.innerHTML = "";

    try {

        const snapshot =
            await db.collection("jobs")
            .where("ownerId", "==", currentUser.uid)
            .orderBy("createdAt", "desc")
            .get();

        if (snapshot.empty) {
            renderEmptyState(
                "myJobsContainer",
                "No jobs posted yet"
            );
            return;
        }

        snapshot.forEach(doc => {

            const job = doc.data();

            container.innerHTML += `
                <div class="job-card">

                    <h3>${job.title}</h3>

                    <p>${job.company}</p>

                    <p>${job.salary || ""}</p>

                    <p>${job.description}</p>

                    <button onclick="viewApplicants('${doc.id}')">
                        View Applicants
                    </button>

                </div>
            `;
        });

    } catch (error) {
        console.error(error);
    }
}

// =====================================
// APPLY TO JOB (JOBSEEKER)
// =====================================

async function applyJob(jobId) {

    if (!currentUser || currentUserRole !== "jobseeker") {
        alert("Only jobseekers can apply.");
        return;
    }

    try {

        const alreadyApplied =
            await db.collection("applications")
            .where("jobId", "==", jobId)
            .where("applicantId", "==", currentUser.uid)
            .get();

        if (!alreadyApplied.empty) {
            alert("You already applied to this job.");
            return;
        }

        await db.collection("applications").add({
            jobId,
            applicantId: currentUser.uid,
            status: "pending",
            createdAt: getTimestamp()
        });

        alert("Application submitted!");

        loadJobs();

    } catch (error) {
        console.error(error);
    }
}

// =====================================
// VIEW APPLICANTS (EMPLOYER)
// =====================================

async function viewApplicants(jobId) {

    showView("applicants");

    const container =
        document.getElementById("applicantsContainer");

    container.innerHTML = "";

    try {

        const snapshot =
            await db.collection("applications")
            .where("jobId", "==", jobId)
            .get();

        if (snapshot.empty) {
            renderEmptyState(
                "applicantsContainer",
                "No applicants yet"
            );
            return;
        }

        for (const doc of snapshot.docs) {

            const app = doc.data();

            const userDoc =
                await db.collection("users")
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

                </div>
            `;
        }

    } catch (error) {
        console.error(error);
    }
}

// =====================================
// UPDATE APPLICATION STATUS
// =====================================

async function updateApplicationStatus(appId, status) {

    try {

        await db.collection("applications")
        .doc(appId)
        .update({
            status
        });

        alert("Application " + status);

    } catch (error) {
        console.error(error);
    }
}

// =====================================
// SEARCH JOBS
// =====================================

function searchJobs(keyword) {

    const items =
        document.querySelectorAll(".job-card");

    items.forEach(item => {

        const text =
            item.innerText.toLowerCase();

        item.style.display =
            text.includes(keyword.toLowerCase())
            ? "block"
            : "none";

    });

}

// =====================================
// LIVE SEARCH HOOK
// =====================================

const jobSearchInput =
    document.getElementById("jobSearch");

if (jobSearchInput) {

    jobSearchInput.addEventListener("input", (e) => {
        searchJobs(e.target.value);
    });

}

// =====================================
// DASHBOARD
// =====================================

async function loadDashboard() {

    if (!currentUser) return;

    try {

        await loadEmployerStats();

    } catch (error) {

        console.error(error);

    }

}

// =====================================
// EMPLOYER STATS
// =====================================

async function loadEmployerStats() {

    const uid = currentUser.uid;

    try {

        // =============================
        // JOB COUNT
        // =============================

        const jobsSnapshot =
            await db.collection("jobs")
            .where("ownerId", "==", uid)
            .get();

        const totalJobs =
            jobsSnapshot.size;

        document.getElementById(
            "totalJobs"
        ).innerText = totalJobs;

        // =============================
        // APPLICANT COUNT
        // =============================

        let applicantCount = 0;

        for (const jobDoc of jobsSnapshot.docs) {

            const appSnapshot =
                await db.collection("applications")
                .where("jobId", "==", jobDoc.id)
                .get();

            applicantCount += appSnapshot.size;
        }

        document.getElementById(
            "totalApplicants"
        ).innerText = applicantCount;

        // =============================
        // MESSAGE COUNT
        // =============================

        const chatsSnapshot =
            await db.collection("chats")
            .where("users", "array-contains", uid)
            .get();

        document.getElementById(
            "totalMessages"
        ).innerText = chatsSnapshot.size;

    } catch (error) {

        console.error(error);

    }

}

// =====================================
// RECENT JOBS
// =====================================

async function loadRecentJobs() {

    if (!currentUser) return;

    const uid = currentUser.uid;

    try {

        const snapshot =
            await db.collection("jobs")
            .where("ownerId", "==", uid)
            .orderBy("createdAt", "desc")
            .limit(5)
            .get();

        let html = "";

        snapshot.forEach(doc => {

            const job = doc.data();

            html += `
                <div class="job-card">

                    <h3>${job.title || "Untitled Job"}</h3>

                    <p>
                        ${job.company || ""}
                    </p>

                    <p>
                        ${job.salary || ""}
                    </p>

                </div>
            `;
        });

        const dashboardView =
            document.getElementById(
                "view-dashboard"
            );

        let existing =
            document.getElementById(
                "recentJobsSection"
            );

        if (existing) {
            existing.remove();
        }

        const section =
            document.createElement("div");

        section.id =
            "recentJobsSection";

        section.innerHTML = `
            <h2 style="margin-top:30px;">
                Recent Jobs
            </h2>

            ${html || `
                <div class="empty-state">
                    No jobs yet.
                </div>
            `}
        `;

        dashboardView.appendChild(section);

    } catch (error) {

        console.error(error);

    }

}

// =====================================
// REFRESH DASHBOARD
// =====================================

async function refreshDashboard() {

    await loadEmployerStats();

    await loadRecentJobs();

}

// =====================================
// DASHBOARD AUTO LOAD
// =====================================

async function initializeDashboard() {

    await refreshDashboard();

}

// =====================================
// LIVE DASHBOARD UPDATES
// =====================================

function enableDashboardRealtime() {

    if (!currentUser) return;

    db.collection("jobs")
        .where(
            "ownerId",
            "==",
            currentUser.uid
        )
        .onSnapshot(() => {

            refreshDashboard();

        });

}

// =====================================
// DASHBOARD ENTRY
// =====================================

async function loadDashboard() {

    await refreshDashboard();

    enableDashboardRealtime();

}

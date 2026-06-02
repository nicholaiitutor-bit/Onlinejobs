function postJob() {

    db.collection("jobs").add({
        title: jobTitle.value,
        company: jobCompany.value,
        salary: jobSalary.value,
        description: jobDescription.value,
        ownerId: currentUser.uid,
        createdAt: new Date().toISOString()
    });

    alert("Job posted!");
}

function loadJobs() {

    const container = document.getElementById("jobsContainer");

    db.collection("jobs").onSnapshot(snap => {

        container.innerHTML = "";

        snap.forEach(doc => {

            const job = doc.data();

            container.innerHTML += `
                <div class="job-card" onclick="openJob('${doc.id}')">
                    <h3>${job.title}</h3>
                    <p>${job.company}</p>
                </div>
            `;
        });
    });
}

function loadEmployerJobs() {
    loadJobs();
}

function openJob(jobId) {
    loadJobDetail(jobId);
    showView("jobDetail");
}

async function loadJobDetail(jobId) {

    const job = await db.collection("jobs").doc(jobId).get();

    document.getElementById("jobDetailContainer").innerHTML = `
        <h2>${job.data().title}</h2>
        <p>${job.data().description}</p>
    `;

    const apps = await db.collection("applications")
        .where("jobId", "==", jobId).get();

    let html = "";

    apps.forEach(a => {
        html += `<div class="applicant-card">${a.data().applicantId}</div>`;
    });

    document.getElementById("jobDetailApplicants").innerHTML = html;
}

function postJob() {

```
db.collection("jobs").add({
    title: document.getElementById("jobTitle").value,
    company: document.getElementById("jobCompany").value,
    salary: document.getElementById("jobSalary").value,
    description: document.getElementById("jobDescription").value,
    ownerId: currentUser.uid,
    createdAt: new Date().toISOString()
})
.then(() => {
    alert("Job posted successfully");
    loadEmployerJobs();
});
```

}

// ================= JOB SEEKER JOBS =================

function loadJobs() {

```
const container = document.getElementById("jobsContainer");

if (!container) return;

db.collection("jobs")
.orderBy("createdAt", "desc")
.onSnapshot(snapshot => {

    container.innerHTML = "";

    snapshot.forEach(doc => {

        const job = doc.data();

        container.innerHTML += `
            <div class="job-card" onclick="openJob('${doc.id}')">

                <h3>${job.title}</h3>

                <p>${job.company}</p>

                <small>${job.salary || ""}</small>

            </div>
        `;
    });

});
```

}

// ================= EMPLOYER JOBS =================

function loadEmployerJobs() {

```
const container = document.getElementById("myJobsContainer");

if (!container || !currentUser) return;

db.collection("jobs")
.where("ownerId", "==", currentUser.uid)
.orderBy("createdAt", "desc")
.onSnapshot(snapshot => {

    container.innerHTML = "";

    if (snapshot.empty) {

        container.innerHTML = `
            <div class="job-card">
                <h3>No jobs posted yet</h3>
            </div>
        `;

        return;
    }

    snapshot.forEach(doc => {

        const job = doc.data();

        container.innerHTML += `
            <div class="job-card">

                <h3>${job.title}</h3>

                <p>${job.company}</p>

                <p>${job.salary || ""}</p>

                <button onclick="openJob('${doc.id}')">
                    View Applicants
                </button>

            </div>
        `;

    });

});
```

}

// ================= OPEN JOB =================

function openJob(jobId) {

```
loadJobDetail(jobId);

showView("jobDetail");
```

}

// ================= JOB DETAILS =================

async function loadJobDetail(jobId) {

```
const jobDoc = await db.collection("jobs").doc(jobId).get();

if (!jobDoc.exists) return;

const job = jobDoc.data();

document.getElementById("jobDetailContainer").innerHTML = `

    <div class="job-card">

        <h2>${job.title}</h2>

        <p><strong>Company:</strong> ${job.company}</p>

        <p><strong>Salary:</strong> ${job.salary || "Not specified"}</p>

        <p>${job.description}</p>

    </div>

`;

loadApplicants(jobId);
```

}

// ================= LOAD APPLICANTS =================

async function loadApplicants(jobId) {

```
const container =
    document.getElementById("jobDetailApplicants");

container.innerHTML = "";

const snapshot = await db
    .collection("applications")
    .where("jobId", "==", jobId)
    .get();

if (snapshot.empty) {

    container.innerHTML = `
        <div class="applicant-card">
            No applicants yet.
        </div>
    `;

    return;
}

snapshot.forEach(doc => {

    const app = doc.data();

    container.innerHTML += `

        <div class="applicant-card">

            <p>
                Applicant:
                ${app.applicantId}
            </p>

            <button
                onclick="messageApplicant('${app.applicantId}','${jobId}')">

                Message Applicant

            </button>

        </div>

    `;

});
```

}

// ================= APPLY =================

function applyToJob(jobId) {

```
db.collection("applications")
.add({

    jobId,

    applicantId: currentUser.uid,

    createdAt: new Date().toISOString()

})
.then(() => {

    alert("Application submitted");

});
```

}

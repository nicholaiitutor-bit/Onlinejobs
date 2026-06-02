async function loadAdmin() {

    const users = await db.collection("users").get();
    const jobs = await db.collection("jobs").get();

    document.getElementById("totalUsers").innerText = users.size;
    document.getElementById("totalJobsAdmin").innerText = jobs.size;
}

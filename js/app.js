function showView(view) {

    document.querySelectorAll(".view").forEach(v => {
        v.style.display = "none";
    });

    const el = document.getElementById("view-" + view);
    if (el) el.style.display = "block";
}

auth.onAuthStateChanged(async user => {

    if (!user) return;

    currentUser = user;

    const userDoc = await db.collection("users").doc(user.uid).get();

    currentUserRole = userDoc.data().role;

    document.getElementById("userEmail").innerText = user.email;

    // ROLE UI
    if (currentUserRole === "employer") {
        document.getElementById("jobseekerMenu").style.display = "none";
        document.getElementById("employerMenu").style.display = "block";
        showView("dashboard");
        loadEmployerJobs();
    }

    if (currentUserRole === "jobseeker") {
        document.getElementById("employerMenu").style.display = "none";
        document.getElementById("jobseekerMenu").style.display = "block";
        showView("findJobs");
        loadJobs();
    }

    if (currentUserRole === "admin") {
        document.getElementById("adminMenu").style.display = "block";
        showView("adminDashboard");
    }
});

function logout() {
    auth.signOut();
}

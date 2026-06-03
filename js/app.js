// ================= DARK MODE =================
function toggleDarkMode() {

    document.body.classList.toggle("dark");

    localStorage.setItem(
        "darkMode",
        document.body.classList.contains("dark")
    );
}

// restore mode
if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
}

// ================= ACTIVE SIDEBAR =================
function setActive(btn) {

    document.querySelectorAll(".sidebar button")
        .forEach(b => b.classList.remove("active"));

    btn.classList.add("active");
}

// ================= VIEW SYSTEM =================
function showView(view) {

    document.querySelectorAll(".view").forEach(v => {
        v.style.display = "none";
    });

    const el = document.getElementById("view-" + view);

    if (el) {
        el.style.display = "block";
        el.classList.add("fade-in");
    }
}
auth.onAuthStateChanged(async user => {

```
if (!user) return;

currentUser = user;

const userDoc =
    await db.collection("users")
    .doc(user.uid)
    .get();

currentUserRole = userDoc.data().role;

document.getElementById("userEmail").innerText =
    user.email;

if (currentUserRole === "employer") {

    document.getElementById("jobseekerMenu").style.display =
        "none";

    document.getElementById("employerMenu").style.display =
        "block";

    loadEmployerJobs();

    showView("dashboard");

}

if (currentUserRole === "jobseeker") {

    document.getElementById("employerMenu").style.display =
        "none";

    document.getElementById("jobseekerMenu").style.display =
        "block";

    loadJobs();

    showView("findJobs");

}
```

});


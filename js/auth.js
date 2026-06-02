// =============================
// AUTH MODAL
// =============================

let authMode = "login";

function openAuth(mode) {

  authMode = mode;

  document.getElementById("authModal").style.display = "block";

  if (mode === "login") {

    document.getElementById("authTitle").innerText = "Login";

    document.getElementById("loginBtn").style.display = "block";
    document.getElementById("registerBtn").style.display = "none";

    document.getElementById("role").style.display = "none";

  } else {

    document.getElementById("authTitle").innerText = "Create Account";

    document.getElementById("loginBtn").style.display = "none";
    document.getElementById("registerBtn").style.display = "block";

    document.getElementById("role").style.display = "block";
  }
}

function closeAuth() {
  document.getElementById("authModal").style.display = "none";
}

// =============================
// REGISTER
// =============================

async function register() {

  try {

    const email =
      document.getElementById("email").value.trim();

    const password =
      document.getElementById("password").value.trim();

    const role =
      document.getElementById("role").value;

    if (!email || !password) {
      return alert("Please complete all fields.");
    }

    const userCredential =
      await auth.createUserWithEmailAndPassword(
        email,
        password
      );

    const uid = userCredential.user.uid;

    // user record

    await db.collection("users")
      .doc(uid)
      .set({
        email,
        role,
        plan: "free",
        createdAt: getTimestamp()
      });

    // profile record

    await db.collection("profiles")
      .doc(uid)
      .set({
        fullName: "",
        title: "",
        bio: "",
        skills: "",
        resumeUrl: "",
        photoUrl: "",
        createdAt: getTimestamp()
      });

    alert("Account created successfully.");

    closeAuth();

  } catch (error) {

    console.error(error);

    alert(error.message);
  }
}

// =============================
// LOGIN
// =============================

async function login() {

  try {

    const email =
      document.getElementById("email").value.trim();

    const password =
      document.getElementById("password").value.trim();

    await auth.signInWithEmailAndPassword(
      email,
      password
    );

    closeAuth();

  } catch (error) {

    console.error(error);

    alert(error.message);
  }
}

// =============================
// LOGOUT
// =============================

async function logout() {

  try {

    await auth.signOut();

  } catch (error) {

    console.error(error);

    alert(error.message);
  }
}

// =============================
// AUTH STATE
// =============================

auth.onAuthStateChanged(async (user) => {

  if (!user) {

    currentUser = null;
    currentUserRole = null;

    document.getElementById("homePage").style.display = "block";
    document.getElementById("appContainer").style.display = "none";

    return;
  }

  currentUser = user;

  document.getElementById("homePage").style.display = "none";
  document.getElementById("appContainer").style.display = "flex";

  document.getElementById("userEmail").innerText =
    user.email;

  try {

    const userDoc =
      await db.collection("users")
        .doc(user.uid)
        .get();

    if (!userDoc.exists) {
      return;
    }

    const userData = userDoc.data();

    currentUserRole = userData.role;

    loadUserInterface();

  } catch (error) {

    console.error(error);

  }

});

// =============================
// ROLE UI
// =============================

function loadUserInterface() {

  const employerMenu =
    document.getElementById("employerMenu");

  const jobseekerMenu =
    document.getElementById("jobseekerMenu");

  if (currentUserRole === "employer") {

    employerMenu.style.display = "block";
    jobseekerMenu.style.display = "none";

    showView("dashboard");

    if (typeof loadDashboard === "function") {
      loadDashboard();
    }

    if (typeof loadMyJobs === "function") {
      loadMyJobs();
    }

  } else {

    employerMenu.style.display = "none";
    jobseekerMenu.style.display = "block";

    showView("findJobs");

    if (typeof loadJobs === "function") {
      loadJobs();
    }

    if (typeof loadMyApplications === "function") {
      loadMyApplications();
    }

    if (typeof loadProfile === "function") {
      loadProfile();
    }

  }
}

// =============================
// CLOSE MODAL CLICK OUTSIDE
// =============================

window.addEventListener("click", (e) => {

  const modal =
    document.getElementById("authModal");

  if (e.target === modal) {
    closeAuth();
  }

});

// =====================================
// LOAD PROFILE
// =====================================

async function loadProfile() {

    if (!currentUser) return;

    try {

        const doc =
            await db.collection("profiles")
            .doc(currentUser.uid)
            .get();

        if (!doc.exists) return;

        const profile = doc.data();

        document.getElementById("fullName").value =
            profile.fullName || "";

        document.getElementById("jobTitleProfile").value =
            profile.title || "";

        document.getElementById("bio").value =
            profile.bio || "";

    } catch (error) {
        console.error(error);
    }
}

// =====================================
// SAVE PROFILE
// =====================================

async function saveProfile() {

    if (!currentUser) return;

    const fullName =
        document.getElementById("fullName").value;

    const title =
        document.getElementById("jobTitleProfile").value;

    const bio =
        document.getElementById("bio").value;

    try {

        await db.collection("profiles")
        .doc(currentUser.uid)
        .update({
            fullName,
            title,
            bio,
            updatedAt: getTimestamp()
        });

        alert("Profile updated!");

    } catch (error) {
        console.error(error);
    }
}

// =====================================
// UPLOAD RESUME
// =====================================

document.addEventListener("change", async (e) => {

    if (e.target.id !== "resumeUpload") return;

    const file = e.target.files[0];

    if (!file) return;

    if (!currentUser) return;

    try {

        const storageRef =
            storage.ref(
                `resumes/${currentUser.uid}/${file.name}`
            );

        const uploadTask =
            await storageRef.put(file);

        const downloadURL =
            await uploadTask.ref.getDownloadURL();

        await db.collection("profiles")
        .doc(currentUser.uid)
        .update({
            resumeUrl: downloadURL,
            updatedAt: getTimestamp()
        });

        alert("Resume uploaded successfully!");

    } catch (error) {
        console.error(error);
    }
});

// =====================================
// VIEW APPLICANT PROFILE (EMPLOYER)
// =====================================

async function viewApplicantProfile(userId) {

    try {

        const doc =
            await db.collection("profiles")
            .doc(userId)
            .get();

        if (!doc.exists) {
            alert("No profile found");
            return;
        }

        const profile = doc.data();

        alert(
            `Name: ${profile.fullName || "N/A"}\n` +
            `Title: ${profile.title || "N/A"}\n` +
            `Bio: ${profile.bio || "N/A"}\n` +
            `Resume: ${profile.resumeUrl || "Not uploaded"}`
        );

    } catch (error) {
        console.error(error);
    }
}

// =====================================
// GET PROFILE DATA (UTILITY)
// =====================================

async function getProfile(userId) {

    try {

        const doc =
            await db.collection("profiles")
            .doc(userId)
            .get();

        if (!doc.exists) return null;

        return doc.data();

    } catch (error) {
        console.error(error);
        return null;
    }
}

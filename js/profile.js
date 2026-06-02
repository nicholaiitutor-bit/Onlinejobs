function saveProfile() {

    db.collection("profiles").doc(currentUser.uid).set({
        fullName: fullName.value,
        title: jobTitleProfile.value,
        bio: bio.value
    });

    alert("Profile saved!");
}

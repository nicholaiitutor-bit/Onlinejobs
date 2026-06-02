function register() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    auth.createUserWithEmailAndPassword(email, password)
        .then(async user => {

            await db.collection("users").doc(user.user.uid).set({
                email,
                role,
                createdAt: new Date().toISOString()
            });

        });
}

function login() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    auth.signInWithEmailAndPassword(email, password);
}

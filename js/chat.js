function sendMessage() {

    db.collection("messages").add({
        text: messageInput.value,
        from: currentUser.uid,
        createdAt: new Date().toISOString()
    });

    messageInput.value = "";
}

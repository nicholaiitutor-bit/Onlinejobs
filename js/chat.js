// =====================================
// CHAT STATE
// =====================================

let activeChatId = null;

// =====================================
// LOAD CHATS (CHAT LIST)
// =====================================

async function loadChats() {

    if (!currentUser) return;

    const container =
        document.getElementById("chatList");

    if (!container) return;

    container.innerHTML = "";

    try {

        const snapshot =
            await db.collection("chats")
            .where("users", "array-contains", currentUser.uid)
            .orderBy("updatedAt", "desc")
            .onSnapshot((snap) => {

                container.innerHTML = "";

                snap.forEach(doc => {

                    const chat = doc.data();

                    const otherUser =
                        chat.users.find(
                            u => u !== currentUser.uid
                        );

                    container.innerHTML += `
                        <div class="chat-card"
                            onclick="openChat('${doc.id}')">

                            <h4>${chat.jobTitle || "Chat"}</h4>

                            <p>${chat.lastMessage || "No messages yet"}</p>

                        </div>
                    `;
                });

            });

    } catch (error) {
        console.error(error);
    }
}

// =====================================
// OPEN CHAT
// =====================================

async function openChat(chatId) {

    activeChatId = chatId;

    const container =
        document.getElementById("chatMessages");

    container.innerHTML = "";

    try {

        db.collection("chats")
        .doc(chatId)
        .collection("messages")
        .orderBy("createdAt")
        .onSnapshot((snap) => {

            container.innerHTML = "";

            snap.forEach(doc => {

                const msg = doc.data();

                const type =
                    msg.senderId === currentUser.uid
                    ? "sent"
                    : "received";

                container.innerHTML += `
                    <div class="chat-bubble ${type}">
                        ${msg.text}
                    </div>
                `;
            });

        });

    } catch (error) {
        console.error(error);
    }
}

// =====================================
// SEND MESSAGE
// =====================================

async function sendMessage() {

    const input =
        document.getElementById("messageInput");

    const text = input.value.trim();

    if (!text || !activeChatId) return;

    try {

        await db.collection("chats")
        .doc(activeChatId)
        .collection("messages")
        .add({
            text,
            senderId: currentUser.uid,
            createdAt: getTimestamp()
        });

        await db.collection("chats")
        .doc(activeChatId)
        .update({
            lastMessage: text,
            updatedAt: getTimestamp()
        });

        input.value = "";

    } catch (error) {
        console.error(error);
    }
}

// =====================================
// CREATE CHAT (AUTO)
// =====================================

async function createChat(jobId, employerId, applicantId, jobTitle) {

    try {

        // check if chat already exists
        const existing =
            await db.collection("chats")
            .where("jobId", "==", jobId)
            .where("users", "array-contains", applicantId)
            .get();

        if (!existing.empty) {
            return existing.docs[0].id;
        }

        const chatRef =
            await db.collection("chats").add({
                jobId,
                jobTitle,
                users: [employerId, applicantId],
                lastMessage: "",
                createdAt: getTimestamp(),
                updatedAt: getTimestamp()
            });

        return chatRef.id;

    } catch (error) {
        console.error(error);
    }
}

// =====================================
// START CHAT FROM APPLICATION
// =====================================

async function messageApplicant(applicantId, jobId, jobTitle) {

    const employerId = currentUser.uid;

    const chatId =
        await createChat(
            jobId,
            employerId,
            applicantId,
            jobTitle
        );

    showView("messages");

    setTimeout(() => {
        openChat(chatId);
    }, 500);
}

// =====================================
// START CHAT FROM JOBSEEKER SIDE
// =====================================

async function messageEmployer(employerId, jobId, jobTitle) {

    const applicantId = currentUser.uid;

    const chatId =
        await createChat(
            jobId,
            employerId,
            applicantId,
            jobTitle
        );

    showView("messages");

    setTimeout(() => {
        openChat(chatId);
    }, 500);
}

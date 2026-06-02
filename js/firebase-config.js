// =============================
// FIREBASE CONFIG
// =============================

const firebaseConfig = {
  apiKey: "AIzaSyAs5VqodQCgH-F-VYbM1zS2BzsoHOQGpzo",
  authDomain: "remote-work-hub-211d8.firebaseapp.com",
  projectId: "remote-work-hub-211d8",
  storageBucket: "remote-work-hub-211d8.firebasestorage.app",
  messagingSenderId: "697750475671",
  appId: "1:697750475671:web:6e609411ae003e6500aad2"
};

// =============================
// INITIALIZE FIREBASE
// =============================

firebase.initializeApp(firebaseConfig);

// =============================
// SERVICES
// =============================

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// =============================
// GLOBAL APP STATE
// =============================

let currentUser = null;
let currentUserRole = null;
let activeChatId = null;
let selectedJobId = null;

// =============================
// COLLECTION NAMES
// =============================

const COLLECTIONS = {
  USERS: "users",
  PROFILES: "profiles",
  JOBS: "jobs",
  APPLICATIONS: "applications",
  CHATS: "chats",
  PAYMENTS: "payments",
  NOTIFICATIONS: "notifications"
};

// =============================
// TIMESTAMP HELPER
// =============================

function getTimestamp() {
  return firebase.firestore.FieldValue.serverTimestamp();
}

// =============================
// DATE FORMATTER
// =============================

function formatDate(date) {

  if (!date) return "";

  try {

    if (date.toDate) {
      return date.toDate().toLocaleString();
    }

    return new Date(date).toLocaleString();

  } catch (error) {
    return "";
  }

}

// =============================
// ALERT HELPER
// =============================

function showAlert(message) {
  alert(message);
}

// =============================
// LOADER HELPERS
// =============================

function showLoader() {
  console.log("Loading...");
}

function hideLoader() {
  console.log("Done.");
}

console.log("Firebase initialized successfully");

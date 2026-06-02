// =====================================
// APP INITIALIZATION
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("Remote Work Hub Loaded");

    hideAllViews();

});

// =====================================
// VIEW SYSTEM
// =====================================

function hideAllViews() {

    const views =
        document.querySelectorAll(".view");

    views.forEach(view => {
        view.style.display = "none";
    });

}

// =====================================
// SHOW VIEW
// =====================================

function showView(viewName) {

    hideAllViews();

    const selectedView =
        document.getElementById(
            "view-" + viewName
        );

    if (selectedView) {
        selectedView.style.display = "block";
    }

    // =========================
    // EMPLOYER VIEWS
    // =========================

    if (viewName === "dashboard") {

        if (typeof loadDashboard === "function") {
            loadDashboard();
        }

    }

    if (viewName === "myJobs") {

        if (typeof loadMyJobs === "function") {
            loadMyJobs();
        }

    }

    if (viewName === "applicants") {

        if (typeof loadApplicants === "function") {
            loadApplicants();
        }

    }

    // =========================
    // JOB SEEKER VIEWS
    // =========================

    if (viewName === "findJobs") {

        if (typeof loadJobs === "function") {
            loadJobs();
        }

    }

    if (viewName === "applications") {

        if (typeof loadMyApplications === "function") {
            loadMyApplications();
        }

    }

    if (viewName === "profile") {

        if (typeof loadProfile === "function") {
            loadProfile();
        }

    }

    // =========================
    // SHARED VIEWS
    // =========================

    if (viewName === "messages") {

        if (typeof loadChats === "function") {
            loadChats();
        }

    }

}

// =====================================
// SIDEBAR ACTIVE BUTTONS
// =====================================

function activateMenu(buttonElement) {

    document
        .querySelectorAll(".sidebar button")
        .forEach(btn => {
            btn.classList.remove("active-menu");
        });

    buttonElement.classList.add("active-menu");

}

// =====================================
// SIMPLE NOTIFICATION
// =====================================

function showToast(message) {

    alert(message);

}

// =====================================
// CONFIRMATION DIALOG
// =====================================

function confirmAction(message) {

    return confirm(message);

}

// =====================================
// FORMAT CURRENCY
// =====================================

function formatCurrency(value) {

    if (!value) return "₱0";

    return "₱" +
        Number(value)
        .toLocaleString();

}

// =====================================
// FORMAT DATE
// =====================================

function formatDateTime(date) {

    try {

        if (date && date.toDate) {

            return date
                .toDate()
                .toLocaleString();

        }

        return new Date(date)
            .toLocaleString();

    } catch {

        return "";

    }

}

// =====================================
// LOADING UI
// =====================================

function showLoading() {

    console.log("Loading...");

}

function hideLoading() {

    console.log("Finished Loading");

}

// =====================================
// EMPTY STATE UI
// =====================================

function renderEmptyState(containerId, text) {

    const container =
        document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = `
        <div class="empty-state">
            <h3>${text}</h3>
        </div>
    `;

}

// =====================================
// SEARCH FILTER
// =====================================

function filterCards(inputId, containerId) {

    const input =
        document.getElementById(inputId);

    const filter =
        input.value.toLowerCase();

    const cards =
        document
            .getElementById(containerId)
            .children;

    Array.from(cards).forEach(card => {

        const text =
            card.innerText.toLowerCase();

        card.style.display =
            text.includes(filter)
            ? "block"
            : "none";

    });

}

// =====================================
// GLOBAL SEARCH LISTENER
// =====================================

const searchInput =
    document.getElementById("jobSearch");

if (searchInput) {

    searchInput.addEventListener("keyup", () => {

        filterCards(
            "jobSearch",
            "jobsContainer"
        );

    });

}

// =====================================
// START APP
// =====================================

hideAllViews();

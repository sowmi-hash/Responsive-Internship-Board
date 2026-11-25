
let internships = [];

// Get HTML elements
const clearSearch = document.getElementById("clearSearch");
const internshipList = document.getElementById("internshipList");
const searchInput = document.getElementById("searchInput");
const domainFilter = document.getElementById("domainFilter");
const resultCount = document.getElementById("resultCount");
// Load internship data from JSON
async function loadInternships() {
    try {
        const response = await fetch("internships.json");

        if (!response.ok) {
            throw new Error("Unable to load internship data");
        }

        const data = await response.json();

        if (!Array.isArray(data.internships)) {
            throw new Error("Invalid internship data");
        }

        internships = data.internships;

        displayInternships(internships);

    } catch (error) {
        internshipList.innerHTML =
            '<p class="no-results" role="alert">Unable to load internships. Please try again.</p>';

        console.error(error);
    }
}

// Display internship cards

// Display internship cards
function displayInternships(data) {
    internshipList.innerHTML = "";

    resultCount.textContent =
        `Showing ${data.length} internship${data.length !== 1 ? "s" : ""}`;

    if (data.length === 0) {
        internshipList.innerHTML =
            '<p class="no-results" role="status">No internships found. Try another search.</p>';
        return;
    }

    data.forEach(internship => {
        const card = document.createElement("div");
        card.className = "internship-card";

        // Internship title
        const title = document.createElement("h3");
        title.textContent = internship.title;

        // Internship ID
        const id = document.createElement("p");
        id.textContent = "ID: " + internship.id;

        // Domain
        const domain = document.createElement("p");
        domain.textContent = "Domain: " + internship.domain;

        // Mode badge
        const mode = document.createElement("span");
        mode.className =
            "mode-badge mode-" + internship.mode.toLowerCase().replace(/\s+/g, "-");
        mode.textContent = internship.mode;

        // Location
        const location = document.createElement("p");
        location.textContent = "Location: " + internship.location;

        // Skills heading
        const skillsHeading = document.createElement("p");
        skillsHeading.textContent = "Required Skills:";

        // Skill tags
        const skillsContainer = document.createElement("div");
        skillsContainer.className = "skills-container";

        internship.skills.forEach(skill => {
            const tag = document.createElement("span");
            tag.className = "skill-tag";
            tag.textContent = skill;
            skillsContainer.appendChild(tag);
        });

        // Openings
        const openings = document.createElement("p");
        openings.textContent = "Openings: " + internship.openings;

        card.append(
            title,
            id,
            domain,
            mode,
            location,
            skillsHeading,
            skillsContainer,
            openings
        );

        internshipList.appendChild(card);
    });
}

// Search and filter internships
function filterInternships() {
    const searchText = searchInput.value.toLowerCase().trim();
    const selectedDomain = domainFilter.value;

    const filteredData = internships.filter(internship => {

        const searchableText = [
            internship.id,
            internship.title,
            internship.domain,
            internship.mode,
            internship.location,
            ...internship.skills
        ].join(" ").toLowerCase();

        const matchesSearch = searchableText.includes(searchText);

        const matchesDomain =
            selectedDomain === "all" ||
            internship.domain === selectedDomain;

        return matchesSearch && matchesDomain;
    });

    displayInternships(filteredData);
}

// Listen for user actions
searchInput.addEventListener("input", filterInternships);
domainFilter.addEventListener("change", filterInternships);
clearSearch.addEventListener("click", function () {
    searchInput.value = "";
    domainFilter.value = "all";
    filterInternships();
});

// Load data when page opens
loadInternships();

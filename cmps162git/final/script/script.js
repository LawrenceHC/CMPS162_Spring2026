let currentAudio = null;
let aboutOpen = false;

function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
}

const movies = [
    { title: "Interstellar", genre: "Sci-Fi", rating: "10", position: "center 30%" },
    { title: "Arrival", genre: "Sci-Fi", rating: "10", position: "center 53%" },
    { title: "Everything Everywhere All At Once", genre: "Sci-Fi/Action", rating: "10", position: "center 70%" },
    { title: "Tomorrowland", genre: "Sci-Fi", rating: "9", position: "center 57%" },
    { title: "ARQ", genre: "Sci-Fi", rating: "9", position: "center 40%" },
    { title: "Knowing", genre: "Sci-Fi", rating: "8" },
    { title: "The Day After Tomorrow", genre: "Disaster", rating: "8" },
    { title: "Annihilation", genre: "Sci-Fi/Horror", rating: "9", position: "center 45%" },
    { title: "The Mist", genre: "Horror", rating: "9", position: "center 47%" },
    { title: "LIFE", genre: "Horror/Sci-Fi", rating: "9", position: "center 40%" },
    { title: "Maze Runner", genre: "Sci-Fi", rating: "9", position: "center 60%" },
    { title: "Edge of Tomorrow", genre: "Sci-Fi", rating: "8", position: "center 17%" }
];

const games = [
    { title: "OneShot", genre: "Adventure", rating: "10", position: "center 27%" },
    { title: "Hollow Knight", genre: "Metroidvania", rating: "10", position: "center 22%" },
    { title: "Hollow Knight: Silksong", genre: "Metroidvania", rating: "10" },
    { title: "Undertale", genre: "RPG", rating: "10", position: "center 27%" },
    { title: "Deltarune", genre: "RPG", rating: "10", position: "center 20%" },
    { title: "Outer Wilds", genre: "Exploration", rating: "10", position: "center 33%" },
    { title: "Geometry Dash", genre: "Platformer", rating: "9" },
    { title: "Omori", genre: "RPG/Horror", rating: "10", position: "center 20%" },
    { title: "Rocket League", genre: "Sports", rating: "9" },
    { title: "Minecraft", genre: "Sandbox", rating: "10" },
    { title: "Terraria", genre: "Sandbox", rating: "10", position: "center 20%" },
    { title: "Portal", genre: "Puzzle", rating: "10", position: "center 87%" },
    { title: "Portal 2", genre: "Puzzle", rating: "10" },
    { title: "5D Chess with Multiverse & Time Travel", genre: "Strategy", rating: "7" },
    { title: "PEAK", genre: "Co-op Multiplayer", rating: "8", position: "center 40%" },
    { title: "Super Mario Galaxy", genre: "Platformer", rating: "10", position: "center 65%" },
    { title: "Super Mario Galaxy 2", genre: "Platformer", rating: "10", position: "center 55%" },
    { title: "The Legend of Zelda: Skyward Sword", genre: "Action-Adventure", rating: "10" }
];

const shows = [
    { title: "Gravity Falls", genre: "Animated/Mystery", rating: "10", position: "center 65%" },
    { title: "Loki", genre: "Sci-Fi", rating: "10", position: "center 20%" },
    { title: "Invincible", genre: "Superhero", rating: "10", position: "center 40%" },
    { title: "Pantheon", genre: "Sci-Fi", rating: "10", position: "center 30%" }
];

// card creation
function createCard(item, folder) {
    const fileName = item.title
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "") + ".jpg";

    const audioFile = item.title
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "") + ".mp3";

    const position = item.position || "center";

    return `
    <div class="card"
        data-audio="audio/${folder}/${audioFile}">

        <img src="images/${folder}/${fileName}" 
             style="object-position: ${position};">

        <div class="card-content">
            <div class="title">${item.title}</div>
            <div class="details">Genre: ${item.genre} | Rating: ${item.rating}</div>
        </div>
    </div>
    `;
}

document.getElementById("showList").innerHTML =
    shows.map(s => createCard(s, "shows")).join("");

document.getElementById("movieList").innerHTML =
    movies.map(m => createCard(m, "movies")).join("");

document.getElementById("gameList").innerHTML =
    games.map(g => createCard(g, "games")).join("");

const overlay = document.getElementById("overlay");

function attachHoverEffects() {
    document.querySelectorAll('.card, .home-card').forEach(card => {

        card.addEventListener('mouseenter', () => {

            // audio (only if it exists)
            const audioPath = card.dataset.audio;
            if (audioPath) {
                playCardAudio(audioPath);
            }

            // overlay
            if (!aboutOpen) overlay.style.opacity = "1";
        });

        card.addEventListener('mouseleave', () => {

            // audio
            if (card.dataset.audio) {
                stopCardAudio();
            }

            // overlay
            if (!aboutOpen) overlay.style.opacity = "0";
        });

    });
}
const aboutModal = document.getElementById("aboutModal");

function openAbout() {
    aboutOpen = true;
    aboutModal.style.display = "flex";
    overlay.style.opacity = "1";
}

function closeAbout() {
    aboutOpen = false;
    aboutModal.style.display = "none";
    overlay.style.opacity = "0";
}

const contactModal = document.getElementById("contactModal");

function openContact() {
    aboutOpen = true; // reuse same flag
    contactModal.style.display = "flex";
    overlay.style.opacity = "1";
}

function closeContact() {
    aboutOpen = false;
    contactModal.style.display = "none";
    overlay.style.opacity = "0";
}

attachHoverEffects();

function playCardAudio(path) {
    if (!path) return;

    const audio = new Audio(path);
    audio.preload = "auto";

    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }

    currentAudio = audio;

    audio.volume = 0;

    audio.addEventListener("loadedmetadata", () => {
        audio.play();

        fadeAudio(audio, 1, 400);

        startPreEndFade(audio);
    });

    audio.addEventListener("error", () => {
        console.log("Missing audio:", path);
    });

    audio.addEventListener("ended", () => {
        cleanupAudio(audio);
    });
}
function stopCardAudio() {
    if (!currentAudio) return;

    const audio = currentAudio;
    currentAudio = null;

    fadeAudio(audio, 0, 300);

    setTimeout(() => {
        audio.pause();
    }, 300);
}

function fadeAudio(audio, targetVolume, duration = 300) {
    const step = 50;
    const diff = targetVolume - audio.volume;
    const volumeStep = diff / (duration / step);

    const interval = setInterval(() => {
        if (!audio) return clearInterval(interval);

        audio.volume += volumeStep;

        if (
            (volumeStep > 0 && audio.volume >= targetVolume) ||
            (volumeStep < 0 && audio.volume <= targetVolume)
        ) {
            audio.volume = targetVolume;
            clearInterval(interval);
        }
    }, step);
}

function startPreEndFade(audio) {
    const check = setInterval(() => {
        if (!audio || audio.paused) {
            clearInterval(check);
            return;
        }

        if (isNaN(audio.duration)) return;

        const remaining = audio.duration - audio.currentTime;

        if (remaining <= 0.5 && !audio._fadingOut) {
            audio._fadingOut = true;

            fadeAudio(audio, 0, 500);

            setTimeout(() => {
                cleanupAudio(audio);
                audio.pause();
            }, 500);

            clearInterval(check);
        }
    }, 50);
}

function cleanupAudio(audio) {
    if (currentAudio === audio) {
        currentAudio = null;
    }
}

const form = document.getElementById("contactForm");

if (form) {

    const fields = [
        { id: "firstName", name: "First Name" },
        { id: "lastName", name: "Last Name" },
        { id: "city", name: "City" },
        { id: "state", name: "State" },
        { id: "zip", name: "Zip Code" }
    ];

    fields.forEach(field => {
        const element = document.getElementById(field.id);
        element.addEventListener("input", () => {
            element.classList.remove("error-field");
            document.getElementById("message").innerHTML = "";
        });
    });

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        let missing = [];
        let message = document.getElementById("message");
        message.innerHTML = "";

        fields.forEach(field => {
            const element = document.getElementById(field.id);
            element.classList.remove("error-field");

            if (element.value.trim() === "") {
                missing.push(field.name);
                element.classList.add("error-field");
            }
        });

        const zip = document.getElementById("zip");
        if (zip.value && !/^\d{5}$/.test(zip.value)) {
            missing.push("Valid Zip Code (5 digits)");
            zip.classList.add("error-field");
        }

        if (missing.length > 0) {
            message.className = "error";
            message.innerHTML = "Missing or invalid fields: " + missing.join(", ");
        } else {
            message.className = "success";
            message.innerHTML = "Form submitted successfully!";
        }
    });
}

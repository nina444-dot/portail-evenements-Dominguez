// Si l’URL change, il suffit de modifier cette ligne
const API_URL =
	"https://demo.theeventscalendar.com/wp-json/tribe/events/v1/events";

const eventsListEl = document.getElementById("events-list"); // Conteneur des événements
const favsListEl = document.getElementById("favorites-list"); // Conteneur des favoris

const modal = document.getElementById("modal"); // Fenêtre modale
const modalBackdrop = document.getElementById("modal-backdrop"); // Fond sombre derrière la modale
const modalClose = document.getElementById("modal-close"); // Bouton de fermeture de la modale
const modalTitle = document.getElementById("modal-title"); // Titre dans la modale
const modalDate = document.getElementById("modal-datetime"); // Date dans la modale
const modalVenue = document.getElementById("modal-venue"); // Lieu dans la modale
const modalDesc = document.getElementById("modal-desc"); // Description dans la modale
const modalLink = document.getElementById("modal-link"); // Lien vers la source

const boutonTheme = document.getElementById("theme-toggle"); // Bouton pour changer le thème

// VARIABLES
let events = []; // Stockage des événements
let favorites = loadFavorites(); // Chargement des favoris depuis localStorage

// Fontions: API
async function loadEvents() {
	try {
		const res = await fetch(API_URL); // Requête HTTP vers l'API
		const data = await res.json(); // Conversion de la réponse en JSON
		console.log("Données API:", data); //Vérifie la structure des données retourné dans la console
		events = data.events || data; // Récupération de la liste des événements

		renderEvents(); // Affiche les événements
		renderFavorites(); // Met à jour les favoris affichés
	} catch (err) {
		eventsListEl.innerHTML =
			"<p>Erreur lors du chargement des événements.</p>"; // Message d'erreur
		console.error("Erreur API :", err); // log en cas de problème
	}
}

// Crée un cookie avec une durée d'un an par défaut
function setCookie(name, value, days = 365) {
	const date = new Date(); // Création d'une date
	date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // Ajout de la durée en millisecondes

	const expires = "expires=" + date.toUTCString(); // Transforme la date en chaine de caractere

	document.cookie = name + "=" + value + ";" + expires + ";path=/"; // Création du cookie
}

// Récuperer le cookie
function getCookie(name) {
	const cookies = document.cookie.split(";"); // Découpe tous les cookies

	for (let c of cookies) {
		c = c.trim(); // Retire les espaces
		if (c.startsWith(name + "=")) {
			// Vérifie si c'est le bon cookie
			return c.substring(name.length + 1); // Retourne sa valeur
		}
	}

	return ""; // Retourne vide si aucun cookie trouvé
}

//Stockage des Favoris (localStorage)
function loadFavorites() {
	return JSON.parse(localStorage.getItem("portail_favorites_v1") || "[]"); // Récupère et convertit
}

function saveFavorites() {
	localStorage.setItem("portail_favorites_v1", JSON.stringify(favorites)); // Sauvegarde en JSON
}

// Fonction: Theme SOMBRE/CLAIR (via cookie)
function applySavedTheme() {
	const theme = getCookie("theme"); // Lis le cookie du thème

	if (theme === "dark") {
		document.body.classList.add("theme-sombre"); // Applique le thème sombre
		boutonTheme.textContent = "Mode clair"; // Met à jour le bouton
	} else {
		document.body.classList.remove("theme-sombre"); // Applique le thème clair
		boutonTheme.textContent = "Mode sombre"; // Met à jour le bouton
	}
}

function toggleTheme() {
	const isDark = document.body.classList.toggle("theme-sombre"); // Inverse le thème

	boutonTheme.textContent = isDark ? "Mode clair" : "Mode sombre"; // Change le texte du bouton

	setCookie("theme", isDark ? "dark" : "light", 365); // Enregistre le choix pendant 1 an
}

function initThemeButton() {
	boutonTheme.addEventListener("click", toggleTheme); // Clic sur le bouton = change de thème
}

// Fonctions: Modale
function getTitle(ev) {
	return ev.title?.rendered || ev.title || ev.event_name || "Titre inconnu"; // Plusieurs choix possibles
}

function getDescription(ev) {
	return (
		ev.excerpt || ev.description || "<p>Aucune description disponible.</p>" // Retourne description ou texte par défaut
	);
}

function fillModal(ev) {
	modalTitle.textContent = getTitle(ev); // Remplit le titre
	modalDate.textContent = "Date : " + (ev.start_date || "Non renseigné"); // Remplit la date
	modalVenue.textContent = "Lieu : " + (ev.venue?.venue || "Inconnu"); // Remplit le lieu
	modalDesc.innerHTML = getDescription(ev); // Remplit la description
	modalLink.href = ev.url || "#"; // Ajoute le lien
}

function showModal(ev) {
	fillModal(ev); // Charge les informations dans la modale
	modal.classList.add("show"); // Affiche la modale
}

function hideModal() {
	modal.classList.remove("show"); // Ferme la modale
}

function initModalButtons() {
	modalBackdrop.onclick = hideModal; // Clic sur le fond = ferme
	modalClose.onclick = hideModal; // Clic sur la croix = ferme
}

// Fonctions : Gestion des Favoris

// Vérifie si un événement est dans les favoris
// id : numéro unique de l'événement
function isFavorite(id) {
	// .includes() regarde si l'ID existe déjà dans le tableau "favorites"
	return favorites.includes(id);
}

// Ajoute ou retire un événement des favoris
function toggleFavorite(id) {
	// Si l'événement est déjà dans les favoris
	if (isFavorite(id)) {
		// .filter() crée un nouveau tableau sans cet ID = donc retire des favoris
		favorites = favorites.filter((f) => f !== id);
	} else {
		// Sinon, on ajoute l'ID dans le tableau
		favorites.push(id);
	}

	// Sauvegarde le tableau mis à jour dans le localStorage
	saveFavorites();

	// Actualise l'affichage des cartes et des favoris
	renderEvents(); // Met à jour les boutons "Ajouter/Retirer"
	renderFavorites(); // Met à jour la liste des favoris dans la zone dédiée
}

// Crée l'affichage visuel d'un favori (dans la liste de droite)
function createFavoriteItem(ev) {
	// Création du conteneur HTML qui va représenter un favori
	const div = document.createElement("div");
	div.className = "fav-item"; // Classe CSS pour le style

	// innerHTML ajoute le nom et la date de l'événement
	div.innerHTML = `
        <strong>${getTitle(ev)}</strong><br>
        <small>${ev.start_date || ""}</small>
    `;

	// Bouton permettant de retirer cet événement des favoris
	const btn = document.createElement("button");
	btn.className = "btn"; // Classe CSS générique
	btn.textContent = "Retirer"; // Texte affiché sur le bouton

	// Lorsqu'on clique → retire ce favori
	btn.onclick = () => toggleFavorite(ev.id);

	// On ajoute le bouton dans le bloc du favori
	div.appendChild(btn);

	// On renvoie l'élément créé pour qu'il soit ajouté dans la liste
	return div;
}

// Affiche la liste des favoris dans la colonne prévue
function renderFavorites() {
	// Si aucun favori enregistré
	if (favorites.length === 0) {
		// On remplace la zone par un simple texte
		favsListEl.textContent = "Aucun événement ajouté.";
		return; // On stoppe la fonction ici
	}

	// Sinon, on vide la zone avant de la remplir
	favsListEl.innerHTML = "";

	// Pour chaque ID présent dans les favoris
	favorites.forEach((id) => {
		// On retrouve l'événement correspondant dans la liste "events"
		const ev = events.find((e) => e.id === id);

		// Si l'événement existe encore
		if (ev) {
			// On crée l'élément visuel et on l'ajoute à l'affichage
			favsListEl.appendChild(createFavoriteItem(ev));
		}
	});
}

// Fonctions: Création des Cartes Evenement

// Génère une carte HTML pour représenter un événement dans la liste principale
function createCard(ev) {
	const card = document.createElement("article"); // Création du conteneur
	card.className = "card"; // Classe CSS pour le style général

	// Contenu visuel de la carte : titre, date, lieu, boutons
	card.innerHTML = `
        <h3 class="card-title">${getTitle(ev)}</h3>
        <p class="card-meta">${ev.start_date || ""} — ${
		ev.venue?.venue || "Lieu inconnu"
	}</p>
        <div class="card-actions">
            <button class="btn btn-detail">Détails</button>
            <button class="btn btn-fav">${
				isFavorite(ev.id) ? "Retirer" : "Ajouter"
			}</button>
        </div>
    `;

	// Bouton "Détails" = ouvre la modale avec les infos de l'événement
	card.querySelector(".btn-detail").onclick = () => showModal(ev);

	// Bouton "Ajouter/Retirer" = gère les favoris
	card.querySelector(".btn-fav").onclick = () => toggleFavorite(ev.id);

	// On renvoie la carte complète pour qu'elle soit ajoutée dans la page
	return card;
}

// Affiche toutes les cartes des événements dans la zone principale
function renderEvents() {
	eventsListEl.innerHTML = ""; // On efface l'ancien contenu

	// Pour chaque événement reçu depuis l'API
	events.forEach((ev) => {
		// On crée une carte et on l'ajoute dans le conteneur principal
		eventsListEl.appendChild(createCard(ev));
	});
}

// Initialisation du Site
function init() {
	applySavedTheme(); // Charge le thème (clair/sombre) sauvegardé dans un cookie
	initThemeButton(); // Active le bouton permettant de changer de thème
	initModalButtons(); // Active les boutons d'ouverture/fermeture de la modale
	loadEvents(); // Charge les événements depuis l'API puis les affiche
}

// Lancement du site au chargement de la page
init();

// Si l’URL change, il suffit de modifier cette ligne
const API_URL =
	"https://demo.theeventscalendar.com/wp-json/tribe/events/v1/events";

const eventsListEl = document.getElementById("events-list");
const favsListEl = document.getElementById("favorites-list");

const modal = document.getElementById("modal");
const modalBackdrop = document.getElementById("modal-backdrop");
const modalClose = document.getElementById("modal-close");
const modalTitle = document.getElementById("modal-title");
const modalDate = document.getElementById("modal-datetime");
const modalVenue = document.getElementById("modal-venue");
const modalDesc = document.getElementById("modal-desc");
const modalLink = document.getElementById("modal-link");

const boutonTheme = document.getElementById("theme-toggle");

let events = [];
let favorites = loadFavorites();

// Crée le cookie avec une durée d'un an
function setCookie(name, value, days = 365) {
	// Calculer la date d'expiration
	const date = new Date();
	date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // jours en millisecondes

	// Convertir la date en texte pour le cookie
	const expires = "expires=" + date.toUTCString();

	// Créer le cookie valable sur tout le site
	document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Lire un cookie
function getCookie(name) {
	const cookies = document.cookie.split(";"); // Séparer tous les cookies

	for (let c of cookies) {
		c = c.trim(); // enlever les espaces
		if (c.startsWith(name + "=")) {
			return c.substring(name.length + 1); // retourner la valeur
		}
	}

	return "";
}

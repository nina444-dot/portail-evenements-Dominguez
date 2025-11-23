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

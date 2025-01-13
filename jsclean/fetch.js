"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let cards = [];
function fetchRepositories(username) {
    return __awaiter(this, void 0, void 0, function* () {
        let url = `https://api.github.com/users/${username}/repos`;
        try {
            let response = yield fetch(url);
            if (!response.ok) {
                console.error("Error fetching repositories", response.statusText);
                return [];
            }
            return yield response.json();
        }
        catch (error) {
            console.error("Error fetching repositories: " + error);
            return [];
        }
    });
}
function fetchLanguages(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let response = yield fetch(url);
            if (!response.ok) {
                console.error("Error fetching languages", response.statusText);
                return {};
            }
            return yield response.json();
        }
        catch (error) {
            console.error("Error fetching languages: " + error);
            return {};
        }
    });
}
function renderRepositories(username) {
    return __awaiter(this, void 0, void 0, function* () {
        let repos = yield fetchRepositories(username);
        let container = document.getElementById('repositories-container');
        if (!container) {
            console.error("No container for repositories");
            return;
        }
        const reposWithLanguage = yield Promise.all(repos.map((repo) => __awaiter(this, void 0, void 0, function* () {
            const languages = yield fetchLanguages(repo.languages_url);
            return Object.assign(Object.assign({}, repo), { languages });
        })));
        container.innerHTML = reposWithLanguage.map((repo, index) => `
        <div class="repo-card animating" style="animation-delay: ${index * 0.1}s;">
          <h3><a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a></h3>
          <p>${repo.description || "No description available"}</p>
           <p><strong>Languages:</strong> ${Object.keys(repo.languages).join(', ') || "No language data available"}</p>
        </div>
        `).join('');
        cards = document.querySelectorAll('.repo-card');
    });
}
renderRepositories(`eyeonspringfield`).then(() => { });
const throttle = (func, delay) => {
    let lastCall = 0;
    return (event) => {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            func(event);
        }
    };
};
const worker = new Worker('js/worker.js');
const handleMouseMove = throttle((event) => {
    cards.forEach((card) => {
        let mouseX = event.clientX;
        let mouseY = event.clientY;
        worker.postMessage({ mouseX, mouseY, cardsData: Array.from(cards).map(card => card.getBoundingClientRect()) });
    });
}, 60);
worker.onmessage = function (event) {
    const { boxShadows } = event.data;
    cards.forEach((card, index) => {
        card.style.boxShadow = boxShadows[index];
    });
};
document.addEventListener('mousemove', handleMouseMove);

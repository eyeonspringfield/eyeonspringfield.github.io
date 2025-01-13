interface Repository {
    name: string;
    html_url: string;
    description: string | null;
    languages_url: string;
}

interface LanguageData {
    [language: string]: number;
}

let cards: any[] | NodeListOf<Element> = [];

async function fetchRepositories(username: string): Promise<Repository[]> {
    let url: string = `https://api.github.com/users/${username}/repos`;
    try {
        let response: Response = await fetch(url)
        if(!response.ok) {
            console.error("Error fetching repositories", response.statusText);
            return [];
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching repositories: " + error);
        return [];
    }
}

async function fetchLanguages(url: string): Promise<LanguageData> {
    try{
        let response: Response = await fetch(url)
        if(!response.ok) {
            console.error("Error fetching languages", response.statusText);
            return {};
        }
        return await response.json();
    }catch(error){
        console.error("Error fetching languages: " + error);
        return {};
    }
}

async function renderRepositories(username: string): Promise<void> {
    let repos: Repository[] = await fetchRepositories(username);
    let container: HTMLElement | null = document.getElementById('repositories-container');
    if (!container) {
        console.error("No container for repositories");
        return;
    }

    const reposWithLanguage = await Promise.all(
        repos.map(async repo => {
            const languages = await fetchLanguages(repo.languages_url);
            return { ...repo, languages }
        })
    )

    container.innerHTML = reposWithLanguage.map((repo, index) => `
        <div class="repo-card animating" style="animation-delay: ${index * 0.1}s;">
          <h3><a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a></h3>
          <p>${repo.description || "No description available"}</p>
           <p><strong>Languages:</strong> ${Object.keys(repo.languages).join(', ') || "No language data available"}</p>
        </div>
        `
    ).join('')

    cards = document.querySelectorAll('.repo-card');
}

renderRepositories(`eyeonspringfield`).then(() => {});

const throttle = (func: Function, delay: number) => {
    let lastCall = 0;
    return (event: MouseEvent) => {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            func(event);
        }
    };
};

const worker = new Worker('js/worker.js');

const handleMouseMove = throttle((event: MouseEvent) => {
    cards.forEach((card) => {
        let mouseX = event.clientX;
        let mouseY = event.clientY;
        worker.postMessage({ mouseX, mouseY, cardsData: Array.from(cards).map(card => card.getBoundingClientRect()) });
    });
}, 60)

worker.onmessage = function (event) {
    const { boxShadows } = event.data;
    cards.forEach((card, index) => {
        card.style.boxShadow = boxShadows[index];
    });
};

document.addEventListener('mousemove', handleMouseMove);

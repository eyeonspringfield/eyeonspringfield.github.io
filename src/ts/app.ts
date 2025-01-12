console.log("Script working!")

window.addEventListener("DOMContentLoaded", (event: Event): void => {
    let currentPath: string = window.location.pathname;
    let navLinks: NodeListOf<Element> = document.querySelectorAll('#navbar-container .nav-element a');

    navLinks.forEach(link => {
        let linkHref: string | null = link.getAttribute('href');
        if(linkHref && currentPath.includes(linkHref)) {
            link.classList.add('active');
        }
    })
})

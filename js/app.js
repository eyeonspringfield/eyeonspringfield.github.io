"use strict";
console.log("Script working!");
window.addEventListener("DOMContentLoaded", (event) => {
    let currentPath = window.location.pathname;
    let navLinks = document.querySelectorAll('#navbar-container .nav-element a');
    navLinks.forEach(link => {
        let linkHref = link.getAttribute('href');
        if (linkHref && currentPath.includes(linkHref)) {
            link.classList.add('active');
        }
    });
});

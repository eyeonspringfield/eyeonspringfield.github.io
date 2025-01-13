"use strict";
console.log("Script working!");
window.addEventListener("DOMContentLoaded", (event) => {
    let currentPath = window.location.pathname;
    let navLinks = document.querySelectorAll('#navbar-container .nav-element a');
    let pathExists = false;
    navLinks.forEach(link => {
        let linkHref = link.getAttribute('href');
        if (linkHref && currentPath.includes(linkHref)) {
            link.classList.add('active');
            pathExists = true;
        }
    });
    if (!pathExists) {
        let eye = document.getElementById("eye");
        if (eye) {
            eye.classList.add('active');
        }
    }
});

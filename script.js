const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const yearNode = document.getElementById("year");
const revealNodes = document.querySelectorAll(".reveal");

if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
}

if (navToggle && siteNav) {
    const closeNav = () => {
        navToggle.setAttribute("aria-expanded", "false");
        siteNav.classList.remove("is-open");
        document.body.classList.remove("nav-open");
    };

    navToggle.addEventListener("click", () => {
        const expanded = navToggle.getAttribute("aria-expanded") === "true";
        navToggle.setAttribute("aria-expanded", String(!expanded));
        siteNav.classList.toggle("is-open");
        document.body.classList.toggle("nav-open");
    });

    siteNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeNav);
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 820) {
            closeNav();
        }
    });
}

if ("IntersectionObserver" in window && revealNodes.length) {
    const observer = new IntersectionObserver((entries, observerRef) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observerRef.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    revealNodes.forEach((node) => observer.observe(node));
} else {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
}

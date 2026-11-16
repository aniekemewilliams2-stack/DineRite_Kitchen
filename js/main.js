/**
 * Dine'Rite Kitchen - Main Client Script
 * Handles navigation, mobile drawer accessibility, and scroll interactions.
 */

document.addEventListener("DOMContentLoaded", () => {
    const siteHeader = document.querySelector(".site-header");
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");
    const navItems = document.querySelectorAll(".nav-links a");

    // 1. Mobile Menu Toggle with Accessibility (ARIA)
    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
            menuToggle.setAttribute("aria-expanded", String(!isExpanded));
            navLinks.classList.toggle("active");
        });

        // Close mobile menu when clicking any nav item
        navItems.forEach((link) => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });

        // Close menu when clicking outside
        document.addEventListener("click", (event) => {
            if (!siteHeader.contains(event.target) && navLinks.classList.contains("active")) {
                navLinks.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
            }
        });

        // Close menu on Escape key press
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && navLinks.classList.contains("active")) {
                navLinks.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.focus();
            }
        });
    }

    // 2. Active Section Spy on Scroll
    const sections = document.querySelectorAll("section[id]");
    function updateActiveNavLink() {
        const scrollY = window.pageYOffset;

        sections.forEach((current) => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute("id");

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navItems.forEach((link) => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${sectionId}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }

    window.addEventListener("scroll", updateActiveNavLink, { passive: true });

    // 3. Dynamic Copyright Year
    const copyrightYearEl = document.getElementById("copyright-year");
    if (copyrightYearEl) {
        copyrightYearEl.textContent = new Date().getFullYear();
    }
});

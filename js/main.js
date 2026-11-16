/**
 * Dine'Rite Kitchen - Main Client Script
 * Handles navigation, menu filtering, FAQ accordion, and scroll interactions.
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

    // 2. Menu Category Filtering
    const filterButtons = document.querySelectorAll(".filter-btn");
    const foodCards = document.querySelectorAll(".food-card");

    if (filterButtons.length > 0 && foodCards.length > 0) {
        filterButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                // Update active button state
                filterButtons.forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");

                const targetCategory = btn.getAttribute("data-filter");

                foodCards.forEach((card) => {
                    const cardCategory = card.getAttribute("data-category");
                    if (targetCategory === "all" || cardCategory === targetCategory) {
                        card.classList.remove("hidden");
                    } else {
                        card.classList.add("hidden");
                    }
                });
            });
        });
    }

    // 3. FAQ Accordion Toggle
    const faqQuestions = document.querySelectorAll(".faq-question");
    faqQuestions.forEach((question) => {
        question.addEventListener("click", () => {
            const item = question.parentElement;
            const isActive = item.classList.contains("active");

            // Close other items (optional single-accordion behavior)
            document.querySelectorAll(".faq-item").forEach((otherItem) => {
                if (otherItem !== item) {
                    otherItem.classList.remove("active");
                    const otherBtn = otherItem.querySelector(".faq-question");
                    if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
                }
            });

            // Toggle current item
            item.classList.toggle("active", !isActive);
            question.setAttribute("aria-expanded", String(!isActive));
        });
    });

    // 4. Active Section Spy on Scroll
    const sections = document.querySelectorAll("section[id]");
    function updateActiveNavLink() {
        const scrollY = window.pageYOffset;

        sections.forEach((current) => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 140;
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

    // 5. Dynamic Copyright Year
    const copyrightYearEl = document.getElementById("copyright-year");
    if (copyrightYearEl) {
        copyrightYearEl.textContent = new Date().getFullYear();
    }
});

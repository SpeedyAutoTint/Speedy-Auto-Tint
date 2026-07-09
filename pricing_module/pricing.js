/*
==========================================================
Speedy Auto Tint
Pricing Center
pricing.js
Version 1.0
==========================================================
*/

document.addEventListener("DOMContentLoaded", () => {

    initializeNavigation();
    initializeSearch();
    initializePrint();
    initializeKeyboardShortcuts();
    initializeAnimations();

});

/*==========================================================
Navigation
==========================================================*/

function initializeNavigation() {

    const buttons = document.querySelectorAll(".navButton");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            buttons.forEach(btn => btn.classList.remove("active"));

            button.classList.add("active");

            const target = document.getElementById(button.dataset.section);

            if (!target) return;

            target.scrollIntoView({

                behavior: "smooth",
                block: "start"

            });

        });

    });

}

/*==========================================================
Search
==========================================================*/

function initializeSearch() {

    const search = document.getElementById("search");

    if (!search) return;

    search.addEventListener("input", function () {

        const value = this.value.toLowerCase().trim();

        const cards = document.querySelectorAll(
            ".card,.wrapCard,.tintCard"
        );

        if (value === "") {

            cards.forEach(card => {

                card.style.display = "";
                card.classList.remove("searchMatch");

            });

            return;

        }

        cards.forEach(card => {

            const text = card.innerText.toLowerCase();

            if (text.includes(value)) {

                card.style.display = "";
                card.classList.add("searchMatch");

            }

            else {

                card.style.display = "none";

            }

        });

    });

}

/*==========================================================
Print
==========================================================*/

function initializePrint() {

    const button = document.getElementById("printButton");

    if (!button) return;

    button.addEventListener("click", () => {

        window.print();

    });

}

/*==========================================================
Keyboard Shortcuts
==========================================================*/

function initializeKeyboardShortcuts() {

    document.addEventListener("keydown", e => {

        if (e.ctrlKey && e.key.toLowerCase() === "f") {

            e.preventDefault();

            const search = document.getElementById("search");

            if (search)
                search.focus();

        }

        if (e.ctrlKey && e.key.toLowerCase() === "p") {

            e.preventDefault();

            window.print();

        }

    });

}

/*==========================================================
Scroll Active Navigation
==========================================================*/

window.addEventListener("scroll", () => {

    const sections = document.querySelectorAll(".category");

    const buttons = document.querySelectorAll(".navButton");

    let current = "";

    sections.forEach(section => {

        const top = section.offsetTop - 120;

        if (window.scrollY >= top)
            current = section.id;

    });

    buttons.forEach(button => {

        button.classList.remove("active");

        if (button.dataset.section === current)
            button.classList.add("active");

    });

});

/*==========================================================
Entrance Animation
==========================================================*/

function initializeAnimations() {

    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("flash");

            }

        });

    }, {

        threshold: .2

    });

    document.querySelectorAll(".card,.wrapCard,.tintCard,.notes")
        .forEach(item => observer.observe(item));

}

/*==========================================================
Future Pricing Loader
==========================================================*/
/*
The current HTML contains fixed values.

Version 2 will populate the page automatically from
pricing-data.js or Supabase.

Example:

Pricing.tint.individual.forEach(...)
Pricing.wraps.fullVehicle.forEach(...)

No HTML edits required when prices change.
*/

/*==========================================================
Quick Helpers
==========================================================*/

function showMessage(message) {

    console.log("[Pricing Center] " + message);

}

function flashElement(element) {

    if (!element) return;

    element.classList.remove("flash");

    void element.offsetWidth;

    element.classList.add("flash");

}

/*==========================================================
Version Information
==========================================================*/

console.log(
    "Speedy Auto Tint Pricing Center v1.0 Loaded"
);

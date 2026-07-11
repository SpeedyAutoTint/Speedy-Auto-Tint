/*
==========================================================
 Speedy Auto Tint — Pricing Center UI
 Nav, search, hamburger menu, notes, print
==========================================================
*/

document.addEventListener("DOMContentLoaded", () => {
    initHamburger();
    initPrint();
    initSearch();
    initNotesForm();

    document.addEventListener("pricing:rendered", () => {
        initSectionNav();
        setActiveSection();
        window.addEventListener("scroll", setActiveSection, { passive: true });
    });

    document.addEventListener("pricing:notes-changed", () => {
        if (window.PricingRender) {
            fetch("../pricing-data/pricing.json")
                .then(r => r.json())
                .then(data => window.PricingRender.renderNotes(data))
                .catch(() => {});
        }
    });
});

function initHamburger() {
    const hamburger = document.getElementById("hamburger");
    const mobileMenu = document.getElementById("mobile-menu");
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener("click", () => {
        const isOpen = mobileMenu.classList.toggle("open");
        hamburger.classList.toggle("open", isOpen);
        hamburger.setAttribute("aria-expanded", isOpen);
    });

    mobileMenu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => closeMenu(hamburger, mobileMenu));
    });

    document.addEventListener("click", e => {
        if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
            closeMenu(hamburger, mobileMenu);
        }
    });
}

function closeMenu(hamburger, mobileMenu) {
    mobileMenu.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
}

function initSectionNav() {
    document.querySelectorAll(".navButton[data-section]").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.section;
            if (window.PricingRender) window.PricingRender.scrollToSection(id);
        });
    });

    const mobileNav = document.getElementById("mobileSectionNav");
    if (mobileNav) {
        mobileNav.querySelectorAll("button[data-section]").forEach(btn => {
            btn.addEventListener("click", () => {
                const hamburger = document.getElementById("hamburger");
                const mobileMenu = document.getElementById("mobile-menu");
                if (window.PricingRender) window.PricingRender.scrollToSection(btn.dataset.section);
                if (hamburger && mobileMenu) closeMenu(hamburger, mobileMenu);
            });
        });
    }
}

function setActiveSection() {
    const sections = document.querySelectorAll(".category, .notes-section");
    const buttons = document.querySelectorAll(".navButton[data-section]");
    if (!sections.length) return;

    let current = "";
    const offset = 100;

    sections.forEach(sec => {
        if (sec.getBoundingClientRect().top <= offset) current = sec.id;
    });

    buttons.forEach(btn => {
        btn.classList.toggle("active", btn.dataset.section === current);
    });
}

function initPrint() {
    const btn = document.getElementById("printButton");
    if (btn) btn.addEventListener("click", () => window.print());

    document.addEventListener("keydown", e => {
        if ((e.ctrlKey || e.metaKey) && e.key === "p") {
            e.preventDefault();
            window.print();
        }
    });
}

function initSearch() {
    const input = document.getElementById("search");
    if (!input) return;

    input.addEventListener("input", () => {
        const q = input.value.trim().toLowerCase();

        document.querySelectorAll(".price-table tbody tr").forEach(row => {
            const text = row.dataset.search || row.textContent.toLowerCase();
            row.classList.toggle("hidden-by-search", q.length > 0 && !text.includes(q));
        });

        document.querySelectorAll(".category").forEach(section => {
            if (!q) {
                section.classList.remove("hidden-by-search");
                return;
            }
            const visibleRows = section.querySelectorAll(".price-table tbody tr:not(.hidden-by-search)");
            const hasChecklist = section.querySelector(".checklist");
            section.classList.toggle("hidden-by-search", visibleRows.length === 0 && !hasChecklist);
        });
    });
}

function initNotesForm() {
    const input = document.getElementById("newNoteInput");
    const btn = document.getElementById("addNoteBtn");
    if (!input || !btn || !window.PricingRender) return;

    function addNote() {
        const text = input.value.trim();
        if (!text) return;

        const notes = window.PricingRender.loadCustomNotes();
        notes.push({ id: "note_" + Date.now(), text, added: new Date().toISOString() });
        window.PricingRender.saveCustomNotes(notes);
        input.value = "";
        document.dispatchEvent(new CustomEvent("pricing:notes-changed"));
    }

    btn.addEventListener("click", addNote);
    input.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            e.preventDefault();
            addNote();
        }
    });
}

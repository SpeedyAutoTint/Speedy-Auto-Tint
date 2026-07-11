/*
==========================================================
 Speedy Auto Tint — Pricing Center dynamic renderer
 Builds all category tables from pricing-data/pricing.json
==========================================================
*/

document.addEventListener("DOMContentLoaded", async () => {

    if (typeof PricingService === "undefined") {
        console.error("[Pricing Center] PricingService not found");
        return;
    }

    const content = document.getElementById("pricingContent");
    const loader = document.getElementById("loadingOverlay");
    if (!content) return;

    try {
        const data = await PricingService.load("../pricing-data/pricing.json");
        renderAllCategories(data, content);
        renderReference(data, content);
        renderNotes(data);
        buildNav(data);
        hideLoader(loader);
        document.dispatchEvent(new CustomEvent("pricing:rendered"));
        console.log("[Pricing Center] Prices loaded from pricing.json");
    } catch (err) {
        console.error("[Pricing Center] Could not load pricing.json:", err);
        hideLoader(loader);
        content.innerHTML = '<p style="color:var(--red);padding:2rem 0;">Could not load pricing data. Check that pricing-data/pricing.json is reachable.</p>';
    }
});

function hideLoader(loader) {
    if (loader) loader.classList.add("hidden");
}

function slugify(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function renderAllCategories(data, container) {
    const categories = PricingService.categories(data);

    categories.forEach(category => {
        const services = PricingService.byCategory(data, category);
        const section = document.createElement("section");
        section.className = "category";
        section.id = slugify(category);
        section.dataset.category = category;

        const title = document.createElement("div");
        title.className = "sectionTitle";
        title.innerHTML = "<h2>" + esc(category) + "</h2>";
        section.appendChild(title);

        const subcats = groupBySubcategory(services);

        Object.keys(subcats).forEach(sub => {
            const block = document.createElement("div");
            block.className = "subcategory-block";

            if (sub !== "__none__") {
                const h3 = document.createElement("h3");
                h3.textContent = sub;
                block.appendChild(h3);
            }

            const isTintShades = category === "Window Tint" && sub === "Full Vehicle Tint";
            block.appendChild(buildTable(subcats[sub], isTintShades));
            section.appendChild(block);
        });

        container.appendChild(section);
    });
}

function groupBySubcategory(services) {
    const groups = {};
    services.forEach(svc => {
        const key = svc.subcategory || "__none__";
        if (!groups[key]) groups[key] = [];
        groups[key].push(svc);
    });
    return groups;
}

function buildTable(services, isTintShades) {
    const wrap = document.createElement("div");
    wrap.className = "price-table-wrap";

    const table = document.createElement("table");
    table.className = "price-table";

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    if (isTintShades) {
        headerRow.innerHTML = "<th>Shade</th><th>Price</th><th>Badge</th>";
    } else {
        headerRow.innerHTML = "<th>Service</th><th>Price</th>";
    }
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    services.forEach(svc => {
        const row = document.createElement("tr");
        row.dataset.search = buildSearchText(svc);

        if (isTintShades) {
            const shade = svc.shade || svc.name;
            const badgeClass = badgeClassFor(svc.badge);
            row.innerHTML =
                "<td>" + esc(shade) + "</td>" +
                '<td class="price-cell">' + esc(PricingService.priceText(svc)) + "</td>" +
                '<td class="badge-cell">' + (svc.badge ? '<span class="badge ' + badgeClass + '">' + esc(svc.badge) + "</span>" : "—") + "</td>";
        } else {
            const label = svc.name;
            row.innerHTML =
                "<td>" + esc(label) + "</td>" +
                '<td class="price-cell">' + esc(PricingService.priceText(svc)) + "</td>";
        }

        if (svc.popular) row.classList.add("popular-row");
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    wrap.appendChild(table);
    return wrap;
}

function badgeClassFor(badge) {
    if (!badge) return "";
    const lower = badge.toLowerCase();
    if (lower.includes("popular")) return "popular";
    if (lower === "legal") return "legal";
    if (lower === "limo") return "limo";
    return "";
}

function buildSearchText(svc) {
    return [svc.name, svc.shade, svc.category, svc.subcategory, svc.badge]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
}

function renderReference(data, container) {
    const section = document.createElement("section");
    section.className = "category";
    section.id = "reference";

    section.innerHTML =
        '<div class="sectionTitle"><h2>Quick Reference</h2></div>' +
        '<div class="referenceGrid"></div>';

    const grid = section.querySelector(".referenceGrid");

    if (data.laborTimes && data.laborTimes.length) {
        const card = document.createElement("div");
        card.className = "reference-card";
        const rows = data.laborTimes.map(item =>
            "<tr><td>" + esc(item.service) + "</td><td class=\"price-cell\">" + esc(item.time) + "</td></tr>"
        ).join("");

        card.innerHTML =
            "<h3>Average Install Times</h3>" +
            '<div class="price-table-wrap"><table class="price-table">' +
            "<thead><tr><th>Service</th><th>Time</th></tr></thead>" +
            "<tbody>" + rows + "</tbody></table></div>";
        grid.appendChild(card);
    }

    if (data.checklist && data.checklist.length) {
        const card = document.createElement("div");
        card.className = "reference-card";
        const items = data.checklist.map(item => "<li>" + esc(item) + "</li>").join("");
        card.innerHTML = "<h3>Customer Checklist</h3><ul class=\"checklist\">" + items + "</ul>";
        grid.appendChild(card);
    }

    container.appendChild(section);
}

function renderNotes(data) {
    const list = document.getElementById("notesList");
    if (!list) return;

    list.innerHTML = "";

    const staticNotes = (data.notes || []).slice();
    const serviceNotes = [];
    (data.services || []).forEach(svc => {
        if (Array.isArray(svc.notes)) {
            svc.notes.forEach(n => serviceNotes.push(svc.name + ": " + n));
        } else if (svc.note) {
            serviceNotes.push(svc.name + ": " + svc.note);
        }
    });

    staticNotes.concat(serviceNotes).forEach(text => {
        list.appendChild(createNoteItem(text, true));
    });

    loadCustomNotes().forEach(note => {
        list.appendChild(createNoteItem(note.text, false, note.id));
    });
}

function createNoteItem(text, isStatic, noteId) {
    const li = document.createElement("li");
    if (isStatic) li.classList.add("static-note");

    const span = document.createElement("span");
    span.className = "note-text";
    span.textContent = text;

    const del = document.createElement("button");
    del.className = "note-delete";
    del.type = "button";
    del.textContent = "Remove";
    del.setAttribute("aria-label", "Remove note");

    if (!isStatic) {
        del.addEventListener("click", () => {
            const notes = loadCustomNotes().filter(n => n.id !== noteId);
            saveCustomNotes(notes);
            document.dispatchEvent(new CustomEvent("pricing:notes-changed"));
        });
    }

    li.appendChild(span);
    li.appendChild(del);
    return li;
}

function loadCustomNotes() {
    try {
        const raw = localStorage.getItem("pricingReferenceNotes");
        const parsed = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(parsed)) return [];
        return parsed.map((note, i) => {
            if (typeof note === "string") return { id: "legacy_" + i, text: note };
            if (!note.id) note.id = "legacy_" + i;
            return note;
        });
    } catch {
        return [];
    }
}

function saveCustomNotes(notes) {
    localStorage.setItem("pricingReferenceNotes", JSON.stringify(notes));
}

function buildNav(data) {
    const desktopNav = document.getElementById("sectionNav");
    const mobileNav = document.getElementById("mobileSectionNav");
    if (!desktopNav && !mobileNav) return;

    const items = PricingService.categories(data).map(cat => ({
        id: slugify(cat),
        label: cat
    }));
    items.push({ id: "reference", label: "Quick Reference" });
    items.push({ id: "notes", label: "Notes" });

    if (desktopNav) {
        desktopNav.innerHTML = "";
        items.forEach(item => {
            const btn = document.createElement("button");
            btn.className = "navButton";
            btn.type = "button";
            btn.dataset.section = item.id;
            btn.textContent = shortLabel(item.label);
            desktopNav.appendChild(btn);
        });
    }

    if (mobileNav) {
        mobileNav.innerHTML = "";
        items.forEach(item => {
            const li = document.createElement("li");
            const btn = document.createElement("button");
            btn.type = "button";
            btn.dataset.section = item.id;
            btn.textContent = item.label;
            btn.addEventListener("click", () => scrollToSection(item.id));
            li.appendChild(btn);
            mobileNav.appendChild(li);
        });
    }
}

function shortLabel(label) {
    const map = {
        "Window Tint": "Tint",
        "Tint Removal": "Removal",
        "Vehicle Wrap": "Wraps",
        "Vinyl Graphics": "Graphics",
        "Paint Protection Film": "PPF"
    };
    return map[label] || label;
}

function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function esc(str) {
    const d = document.createElement("div");
    d.textContent = str == null ? "" : String(str);
    return d.innerHTML;
}

window.PricingRender = {
    renderNotes,
    loadCustomNotes,
    saveCustomNotes,
    scrollToSection
};

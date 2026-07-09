/*
==========================================================
 Speedy Auto Tint
 Pricing Center — dynamic renderer
 Populates the existing pricing-reference.html markup with
 live values from pricing-data/pricing.json. The HTML
 structure/styling is untouched; only the price text nodes
 are filled in, so tron.css / print.css keep working as-is.
==========================================================
*/

document.addEventListener("DOMContentLoaded", async () => {

    if (typeof PricingService === "undefined") {
        console.error("[Pricing Center] PricingService not found — check that pricing-service.js loaded before pricing-render.js");
        return;
    }

    try {
        const data = await PricingService.load("../pricing-data/pricing.json");
        renderIndividualWindows(data);
        renderFullVehicleTint(data);
        renderRemoval(data);
        renderWraps(data);
        console.log("[Pricing Center] Prices loaded from pricing.json");
    } catch (err) {
        console.error("[Pricing Center] Could not load pricing.json:", err);
        flagLoadError();
    }

});

/* ---------- Individual Windows table (#tint first .card) ---------- */

function renderIndividualWindows(data) {
    const card = document.querySelector("#tint .cardGrid .card");
    if (!card) return;

    card.querySelectorAll("table tbody tr").forEach(row => {
        const cells = row.querySelectorAll("td");
        if (cells.length < 2) return;
        const name = cells[0].textContent.trim();
        const svc = PricingService.findByName(data, name, { category: "Window Tint", subcategory: "Individual Windows" });
        if (svc) cells[1].textContent = PricingService.priceText(svc);
    });
}

/* ---------- Full vehicle tint cards (.tintCard) ---------- */

function renderFullVehicleTint(data) {
    document.querySelectorAll("#tint .tintCard").forEach(card => {
        const shadeEl = card.querySelector(".tintPercent");
        const priceEl = card.querySelector(".price");
        const badgeEl = card.querySelector(".badge");
        if (!shadeEl || !priceEl) return;

        const shade = shadeEl.textContent.trim();
        const svc = data.services.find(s =>
            s.category === "Window Tint" &&
            s.subcategory === "Full Vehicle Tint" &&
            s.shade === shade
        );
        if (!svc) return;

        priceEl.textContent = PricingService.priceText(svc);
        if (badgeEl && svc.badge) badgeEl.textContent = svc.badge;
    });
}

/* ---------- Tint removal table (#removal .card) ---------- */

function renderRemoval(data) {
    const card = document.querySelector("#removal .card");
    if (!card) return;

    card.querySelectorAll("table tbody tr").forEach(row => {
        const cells = row.querySelectorAll("td");
        if (cells.length < 2) return;
        const name = cells[0].textContent.trim();
        const svc = PricingService.findByName(data, name, { category: "Tint Removal" });
        if (svc) cells[1].textContent = PricingService.priceText(svc);
    });
}

/* ---------- Wrap grid (.wrapCard) ---------- */

function renderWraps(data) {
    document.querySelectorAll("#wrap .wrapCard").forEach(card => {
        if (card.classList.contains("highlight")) return; // "Bring Your Own Wrap" stays a blank fill-in line
        const h3 = card.querySelector("h3");
        const priceDiv = card.querySelector("div");
        if (!h3 || !priceDiv) return;

        const name = h3.textContent.trim();
        const svc = PricingService.findByName(data, name, { category: "Vehicle Wrap" }) ||
                    PricingService.findByName(data, name, { category: "Chrome Delete" });
        if (svc) priceDiv.textContent = PricingService.priceText(svc);
    });
}

/* ---------- Fallback if pricing.json can't be reached ---------- */

function flagLoadError() {
    const hero = document.querySelector(".hero p");
    if (!hero) return;
    const warning = document.createElement("p");
    warning.style.color = "var(--red, #ff5252)";
    warning.style.marginTop = "12px";
    warning.textContent = "⚠ Live pricing data could not be loaded — figures shown may be outdated. Check that pricing-data/pricing.json is reachable from this page.";
    hero.insertAdjacentElement("afterend", warning);
}

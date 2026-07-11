/*
==========================================================
 Speedy Auto Tint
 Pricing Service
 Shared loader + formatting helpers for pricing.json

 Every page that needs a price (employee Pricing Center,
 customer dashboard quote builder, kiosk, future POS)
 should load this file and call PricingService.load().
 Update prices in ONE place: pricing-data/pricing.json
==========================================================
*/

(function (root) {

    const DEFAULT_PATH = "pricing-data/pricing.json";

    let cache = null;
    let cachePromise = null;

    /* ---------- Load ---------- */

    function load(path) {
        if (cache) return Promise.resolve(cache);
        if (cachePromise) return cachePromise;

        const url = path || DEFAULT_PATH;

        cachePromise = fetch(url, { cache: "no-store" })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to load " + url + " (" + res.status + ")");
                }
                return res.json();
            })
            .then(data => {
                cache = data;
                return data;
            })
            .catch(err => {
                cachePromise = null;
                throw err;
            });

        return cachePromise;
    }

    function invalidate() {
        cache = null;
        cachePromise = null;
    }

    /* ---------- Formatting ---------- */

    function money(value) {
        if (value === null || value === undefined) return "Custom Quote";
        if (value === "") return "__________";
        if (typeof value === "number") return "$" + value.toLocaleString();
        return "$" + value;
    }

    // Human readable price string for any service record from pricing.json
    function priceText(svc) {
        if (!svc) return "—";
        if (svc.custom) return "Custom Quote";
        if (svc.min != null && svc.max != null) {
            if (svc.min === svc.max) return money(svc.min);
            return "$" + svc.min + "-$" + svc.max;
        }
        if (svc.plusMinimum) return money(svc.price) + "+";
        if (typeof svc.price === "number") return money(svc.price);
        return "—";
    }

    // Best numeric value to use for quote math (uses the low end of a range)
    function numericValue(svc) {
        if (!svc) return 0;
        if (svc.custom) return 0;
        if (typeof svc.price === "number") return svc.price;
        if (svc.min != null) return svc.min;
        return 0;
    }

    /* ---------- Lookups ---------- */

    function findById(data, id) {
        return (data.services || []).find(s => s.id === id) || null;
    }

    // Matches a display name against a service's name or any alias, optionally scoped to a category/subcategory
    function findByName(data, name, opts) {
        opts = opts || {};
        const services = data.services || [];
        return services.find(s => {
            if (opts.category && s.category !== opts.category) return false;
            if (opts.subcategory && s.subcategory !== opts.subcategory) return false;
            if (s.name === name) return true;
            if (Array.isArray(s.aliases) && s.aliases.includes(name)) return true;
            return false;
        }) || null;
    }

    function byCategory(data, category) {
        return (data.services || []).filter(s => s.category === category);
    }

    function categories(data) {
        const seen = [];
        (data.services || []).forEach(s => {
            if (!seen.includes(s.category)) seen.push(s.category);
        });
        return seen;
    }

    root.PricingService = {
        load,
        invalidate,
        money,
        priceText,
        numericValue,
        findById,
        findByName,
        byCategory,
        categories,
        DEFAULT_PATH
    };

})(typeof window !== "undefined" ? window : this);

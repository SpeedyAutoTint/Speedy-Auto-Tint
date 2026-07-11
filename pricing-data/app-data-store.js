/*
==========================================================
 Speedy Auto Tint
 Browser data store adapter

 Today this wraps localStorage so kiosk.html and customer_dashboard.html
 share one consistent API. When Supabase or another hosted database is
 added, replace the methods in this file instead of editing each screen.
==========================================================
*/

(function (root) {
    const config = {
        backend: "localStorage",
        supabaseUrl: "",
        supabaseAnonKey: ""
    };

    function configure(nextConfig) {
        Object.assign(config, nextConfig || {});
    }

    function readRaw(key) {
        try {
            return root.localStorage.getItem(key);
        } catch (err) {
            console.error("[SpeedyDataStore] Read failed for", key, err);
            return null;
        }
    }

    function writeRaw(key, value) {
        try {
            root.localStorage.setItem(key, value);
            return true;
        } catch (err) {
            console.error("[SpeedyDataStore] Write failed for", key, err);
            return false;
        }
    }

    function readJSON(key, fallback) {
        const raw = readRaw(key);
        if (!raw) return fallback;
        try {
            const parsed = JSON.parse(raw);
            return parsed == null ? fallback : parsed;
        } catch (err) {
            console.error("[SpeedyDataStore] JSON parse failed for", key, err);
            return fallback;
        }
    }

    function writeJSON(key, value) {
        return writeRaw(key, JSON.stringify(value));
    }

    function readRequests() { return readJSON("quoteRequests", []); }
    function writeRequests(list) { return writeJSON("quoteRequests", Array.isArray(list) ? list : []); }
    function readCustomers() { return readJSON("customers", []); }
    function writeCustomers(list) { return writeJSON("customers", Array.isArray(list) ? list : []); }
    function readAppointments() { return readJSON("appointments", null); }
    function writeAppointments(list) { return writeJSON("appointments", Array.isArray(list) ? list : []); }

    function readQuotesByRequest() {
        const quotes = readJSON("quotesByRequest", {});
        return quotes && typeof quotes === "object" && !Array.isArray(quotes) ? quotes : {};
    }

    function writeQuotesByRequest(map) {
        return writeJSON("quotesByRequest", map && typeof map === "object" ? map : {});
    }

    async function syncStatus() {
        return {
            backend: config.backend,
            ready: config.backend === "localStorage",
            message: config.backend === "localStorage"
                ? "Using this device's browser storage. Data will not sync across devices yet."
                : "Backend adapter is configured here, but remote sync is not implemented yet."
        };
    }

    root.SpeedyDataStore = {
        configure,
        readRaw,
        writeRaw,
        readJSON,
        writeJSON,
        readRequests,
        writeRequests,
        readCustomers,
        writeCustomers,
        readAppointments,
        writeAppointments,
        readQuotesByRequest,
        writeQuotesByRequest,
        syncStatus
    };
})(window);

# Speedy-Auto-Tint

Static site files for Speedy Auto Tint.

## File Structure

```
/
|-- index.html                 Splash / entry page
|-- main.html                  Main site, services, about, quote form
|-- thank-you.html              Quote submission confirmation
|-- customer_dashboard.html     Internal dashboard — queue, quote requests, quote builder
|-- kiosk.html                  iPad lobby kiosk (new / returning / check appointment)
|-- pricing-data/
|   |-- pricing.json            SINGLE SOURCE OF TRUTH for all prices
|   `-- pricing-service.js      Shared loader/formatting helpers for pricing.json
|-- pricing_module/
|   |-- pricing-reference.html  Employee pricing reference (reads pricing.json live)
|   |-- pricing-render.js       Populates pricing-reference.html from pricing.json
|   |-- css/tron.css, css/print.css
|   `-- js/pricing.js           Nav, search, print, keyboard shortcuts (unchanged)
|-- images/                    Site media
`-- README.md
```

## Centralized pricing

`pricing-data/pricing.json` is the only place prices live. Everything else —
the employee Pricing Center, the dashboard's quote builder, and eventually
the kiosk/POS — reads from this file through `pricing-data/pricing-service.js`.

To change a price: edit `pricing.json`, save, refresh the page. Nothing else
needs to change.

**Note:** a few services (Paint Protection Film, Commercial Wrap, Bring Your
Own Wrap, custom removal jobs) are marked `"custom": true` with no set price —
these show as "Custom Quote" everywhere until real pricing is added.

**Path note:** `pricing-reference.html` lives one folder down in
`pricing_module/`, so it loads the JSON via `../pricing-data/pricing.json`.
`customer_dashboard.html` and `kiosk.html` live at the repo root and load it
via `pricing-data/pricing.json`. If you move any of these files, update the
`fetch`/`<script src>` paths to match.

## Local storage keys (no backend yet)

Everything below lives in the browser's `localStorage` on the device it was
entered on. There's no server, so data doesn't sync between devices yet —
see "Next steps" below.

| Key | Written by | Read by |
|---|---|---|
| `quoteRequests` | main.html quote form (currently paused), kiosk.html walk-ins | customer_dashboard.html |
| `customers` | kiosk.html | kiosk.html (returning customer lookup) |
| `appointments` | (none yet — seeded with demo data) | kiosk.html (check appointment) |
| `quotesByRequest` | customer_dashboard.html quote builder | customer_dashboard.html |

A walk-in created on the kiosk is a `quoteRequests` entry with
`source: "walk-in"` and a `queueStatus` (`waiting` / `in-progress` / `ready` /
`done`), which is what powers the dashboard's "Today's Queue" panel. It also
still has the CRM `status` field (`new` / `contacted` / `scheduled` /
`completed`) used everywhere else, so walk-ins show up in the same table as
web-form leads.

## Kiosk / Guided Access setup (iPad)

1. Open `kiosk.html` in Safari on the iPad.
2. Settings → Accessibility → Guided Access → turn on, set a passcode.
3. Open `kiosk.html`, triple-click the side/home button to start Guided
   Access. This locks the iPad to that one page (no home screen, no
   notifications).
4. Triple-click again + passcode to exit Guided Access for staff use.

The page already disables pinch-zoom, text selection, and callout menus, and
auto-returns to the Welcome screen after 90 seconds idle so it's always ready
for the next walk-in.

## Next steps

- The Quotes/Queue data currently lives in per-device `localStorage`. For a
  real multi-device setup (kiosk in the lobby + dashboard at the front desk
  + phone in your pocket), this needs to move to a shared backend — a small
  hosted database (Supabase/Firebase) or the Formspree+Webhook relay
  mentioned in earlier notes both work.
- Appointments are currently read-only demo data on the kiosk. Building the
  real Appointments module (calendar, drag-and-drop scheduling) is what
  will let "Check Appointment" show real bookings.
- Photos are referenced by filename only right now (no image data is
  stored) to avoid blowing past localStorage's size limit — once there's a
  backend, swap this for real uploads.

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

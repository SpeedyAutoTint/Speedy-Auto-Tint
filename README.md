# Speedy-Auto-Tint
# Speedy Auto Tint

Static site files for Speedy Auto Tint.

## File Structure

```
/
|-- index.html                 Splash / entry page
|-- main.html                  Main site, services, about, quote form
|-- thank-you.html             Quote submission confirmation
|-- dashboard.html             Internal quote dashboard
|-- start-phone-preview.ps1    Local phone preview launcher
|-- images/                    Site media
`-- README.md
```

http://YOUR_WIFI_IP:8000/main.html
http://YOUR_WIFI_IP:8000/dashboard.html
```

Open the Dashboard URL on your phone while your phone is on the same Wi-Fi. Keep
the PowerShell window open while previewing.

If you will not have a laptop running, local phone preview is not possible from
these files alone. Put the site on a host such as GitHub Pages, Netlify, or your
web host, then open:

```text
https://your-site.example/dashboard.html
```

Important: the current Dashboard uses localStorage, so quote data is per
device/browser. For shared real customer requests across phone and computer, use
a real backend, database, or Formspree webhook workflow.

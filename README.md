# Speedy Auto Tint — Site Setup Guide

## File Structure

```
/
├── index.html          ← Splash/entry page
├── main.html           ← Main site (services, about, quote form)
├── thank-you.html      ← Post-form submission confirmation
├── dashboard.html      ← Internal customer dashboard (not linked publicly)
├── images/
│   ├── Main.png
│   └── l100-5300-window-tinting-animated-led-sign-giant.gif
└── README.md
```

---

## Step 1 — Set Up Form Email Notifications (Free · Formspree)

The quote form uses **Formspree** — a free, no-server form backend that
emails you every submission. No database, no backend code needed.

### Setup (5 minutes):

1. Go to → https://formspree.io and create a **free account**
2. Click **New Form** → name it "Speedy Auto Tint Quote"
3. **Copy your Form ID** (looks like: `xrgvkwpq`)
4. Open `main.html` and find this line (~line 430):
   ```
   action="https://formspree.io/f/YOUR_FORM_ID"
   ```
   Replace `YOUR_FORM_ID` with your actual ID:
   ```
   action="https://formspree.io/f/xrgvkwpq"
   ```
5. In Formspree Dashboard → **Settings** → confirm your notification email
6. **Test it**: Submit the form once, then check your inbox

### What you get (free tier):
- 50 submissions/month (upgrade ~$10/mo for unlimited)
- Email notification for every submission
- Spam filtering built in
- Honeypot field already included in the form (`_gotcha`)

---

## Step 2 — SMS Text Notifications (Optional)

Formspree's free tier doesn't include SMS directly, but here are two
free/cheap options:

### Option A — Zapier (Free tier, easiest)
1. In Formspree → **Integrations** → **Webhooks** — add a webhook URL
2. Create a free Zapier account → zapier.com
3. New Zap: Trigger = **Webhooks by Zapier** (catch hook) →
   Action = **Gmail** "Send Email" (or SMS via Google Voice if set up)
4. Free Zapier tier: 100 tasks/month

### Option B — Ntfy.sh (Completely free push notifications)
1. Install the **ntfy** app on your phone (iOS/Android, free)
2. Subscribe to a private topic, e.g.: `speedyautotint-quotes-abc123`
3. In Formspree Webhooks, add:
   `https://ntfy.sh/speedyautotint-quotes-abc123`
4. You'll get an instant push notification on your phone for each submission
5. **No account required, completely free**
   → Full docs: https://ntfy.sh/docs/

### Option C — Twilio (Paid, ~$1/mo for low volume)
Real SMS to your phone number via Twilio trial credit.
Connect via Formspree webhook → Zapier → Twilio SMS action.

---

## Step 3 — Deploy to GitHub Pages

### First-time setup:
1. Create a **GitHub account** at github.com (free)
2. Click **New Repository** → name it `speedy-auto-tint` (or any name)
3. Set visibility to **Private** (recommended for privacy)
4. Upload all files (drag and drop in the GitHub web interface)
5. Go to repo **Settings** → **Pages** → Source: `Deploy from branch`
   → Branch: `main` → Folder: `/ (root)` → Save
6. Your site will be live at:
   `https://yourusername.github.io/speedy-auto-tint/`

### Updating files later:
- In GitHub, click any file → pencil icon to edit → **Commit changes**
- Or use GitHub Desktop app for drag-and-drop updates

### QR Code generation:
1. Once deployed, copy your live URL
2. Go to https://qr.io or https://www.qrcode-monkey.com (free)
3. Generate a QR code pointing to `...github.io/speedy-auto-tint/`
4. Print and place in your office

---

## Step 4 — Dashboard Access

The `dashboard.html` file is intentionally **not linked** from the public site.
Access it by visiting the URL directly:

```
https://yourusername.github.io/speedy-auto-tint/dashboard.html
```

### Privacy notes:
- The dashboard has `<meta name="robots" content="noindex, nofollow">` —
  search engines won't index it
- Customer data is stored in **your browser's localStorage only** —
  nothing is sent to any third-party server
- The dashboard is a companion viewer; actual submissions arrive via email

### Bridging form data to dashboard:
When a submission arrives via Formspree email, you can manually add it
to the dashboard by opening the browser console and running:

```javascript
// Paste this in the browser console on the dashboard page
const existing = JSON.parse(localStorage.getItem('quoteRequests') || '[]');
existing.push({
  id: 'quote_' + Date.now(),
  name: 'Customer Name',
  phone: '256-000-0000',
  email: 'email@example.com',
  year: '2023', make: 'Ford', model: 'Explorer',
  service: 'Full Vehicle Tint',
  addons: ['Ceramic Tint Upgrade'],
  preferred_date: '2026-02-28',
  notes: 'Notes here',
  submissionDate: new Date().toISOString(),
  status: 'new'
});
localStorage.setItem('quoteRequests', JSON.stringify(existing));
location.reload();
```

Or use Formspree's webhook → Zapier to auto-update a shared JSON store.

---

## Privacy & Security Summary

| Item | Status |
|------|--------|
| No analytics or tracking scripts | ✅ |
| No third-party cookies | ✅ |
| No CDN-loaded external JS (except Google Fonts) | ✅ |
| Form data sent only to your Formspree account | ✅ |
| Dashboard not indexed by search engines | ✅ |
| Customer data stored locally (no shared server) | ✅ |
| HTML-escaped output in dashboard (XSS protection) | ✅ |
| Honeypot spam field in form | ✅ |
| No account/login required for quote form | ✅ |

---

## Update Phone Number & Email

In `main.html`, search for:
- `(256) 555-0100` → replace with your real number
- `info@speedyautotint.com` → replace with your real email
- `Huntsville, AL` → update address/hours as needed

In `thank-you.html`, update the phone number shown to customers.

---

## Adding Your Own Photos

### Portfolio / tinting work photos (3 slots)
In `main.html`, find the `<!-- ══════════ PORTFOLIO ══════════ -->` section.
Each slot has a comment like `<!-- TINT PHOTO 1 -->` and looks like:
```html
<img src="" alt="Window Tinting Project" onerror="this.src='..fallback..'">
```
Replace `src=""` with your image path:
```html
<img src="images/tint-job-ford-f150.jpg" alt="F-150 Tint Job">
```
Also update the overlay `<h3>` and `<p>` text with the actual job description.

### Audio/Video installation gallery (6 slots)
Find the `<!-- Installation Gallery -->` comment inside the Audio section.
Each slot has a label in the comment, e.g. `<!-- PHOTO SLOT 1: Replace src="" ... -->`.
Same process — set `src="images/your-photo.jpg"` and the dashed placeholder disappears automatically.

### Recommended photo specs
- Format: JPG or WebP
- Size: 800×600px minimum (1200×900px ideal)
- File size: Under 300KB each (compress at tinypng.com if needed)
- Put all photos in the `images/` folder alongside `Main.png`

### Naming suggestions
```
images/tint-1.jpg           ← tint portfolio slot 1
images/tint-2.jpg           ← tint portfolio slot 2
images/tint-3.jpg           ← tint portfolio slot 3
images/audio-headunit.jpg   ← head unit install
images/audio-speakers.jpg   ← speaker system
images/audio-sub.jpg        ← subwoofer enclosure
images/audio-alarm.jpg      ← alarm install
images/audio-remotestart.jpg← remote start
images/audio-rse.jpg        ← rear seat entertainment
```

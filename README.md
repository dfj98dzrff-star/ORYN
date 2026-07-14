# ORYN — Website

**Identity. Influence. Management.**

A production-ready, single-page marketing site for ORYN, built with only HTML5, CSS3, and vanilla JavaScript. No frameworks, no build step, no dependencies. Drop it on any static host.

---

## Recommended folder structure

```
oryn-site/
├── index.html      # Markup & content
├── styles.css      # Design system & layout
├── script.js       # Particles, reveals, counters, nav
└── README.md        # This file
```

Keep all four files in the same folder. Every path in `index.html` is relative, so the site works from any directory without configuration.

---

## How to upload to GitHub Pages

1. **Create a repository** on GitHub (e.g. `oryn-site`). Public is simplest for Pages.
2. **Add the files.** Either drag `index.html`, `styles.css`, and `script.js` into the repo via the web uploader, or from your terminal:
   ```bash
   git init
   git add .
   git commit -m "ORYN site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/oryn-site.git
   git push -u origin main
   ```
3. **Enable Pages.** In the repo, go to **Settings → Pages**. Under **Build and deployment**, set **Source** to *Deploy from a branch*, choose the **`main`** branch and the **`/ (root)`** folder, then **Save**.
4. **Wait ~1 minute.** Your site publishes at:
   ```
   https://<your-username>.github.io/oryn-site/
   ```

> Tip: `index.html` must sit at the root of the branch/folder you selected, not inside a subfolder.

---

## How to customize text

All copy lives in `index.html` as plain, readable HTML — no templating.

- **Headline / tagline** — edit the `.hero__title` block (the three `<span>` lines) and `.hero__subtitle`.
- **Services** — each service is an `<article class="card">`. Change the `.card__title` and `.card__text`; the `.card__no` is just the number label.
- **Process steps** — edit the `<li class="timeline__item">` entries.
- **Stats** — change the number shown by editing `data-target` (the value it counts up to) and `data-suffix` (e.g. `+`, `K+`) on each `.stat__num`. The visible `0` is just a starting placeholder.
- **Testimonials** — edit the `<blockquote>` text and the `.quote__name` / `.quote__role` inside each `<figure class="quote">`.
- **Contact email** — search `partnerships@oryn.com` and replace every instance (hero CTA, footer, and the final CTA button's `mailto:` link).
- **SEO** — update the `<title>`, `<meta name="description">`, Open Graph tags, and the JSON-LD `Organization` block near the top of `index.html`.

---

## How to replace the logo

The logo is currently the wordmark **ORYN** set in Inter. Three spots reference it:

1. **Navbar** — `<a class="nav__logo">ORYN</a>`
2. **Footer** — `<span class="footer__logo">ORYN</span>`
3. **Favicon** — the inline SVG in the `<link rel="icon">` tag in `<head>`.

**To use an image logo instead:** drop your file (e.g. `logo.svg`) in the folder and swap the nav wordmark:

```html
<a href="#home" class="nav__logo" aria-label="ORYN home">
  <img src="logo.svg" alt="ORYN" height="24" />
</a>
```

For the favicon, replace the inline SVG `href` with `href="favicon.png"` (or `.ico`) and add that file to the folder. Keep logo assets in the same directory as `index.html` so the relative paths resolve.

---

## How to connect a custom domain later

1. **Buy a domain** from any registrar (e.g. `oryn.com`).
2. In the GitHub repo, go to **Settings → Pages → Custom domain**, enter your domain, and **Save**. GitHub writes a `CNAME` file to the repo automatically.
3. **Point DNS** at GitHub, at your registrar:
   - For a subdomain like `www.oryn.com`, add a **CNAME** record pointing to `<your-username>.github.io`.
   - For an apex/root domain like `oryn.com`, add **A** records pointing to GitHub's IPs:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
     (Optionally add an `AAAA` set for IPv6 — see GitHub's docs.)
4. Back in **Settings → Pages**, tick **Enforce HTTPS** once the certificate is issued (can take up to a few hours).

Update the `<link rel="canonical">` and the Open Graph / JSON-LD `url` values in `index.html` to your final domain.

---

## Notes

- **Dark mode only** by design — the palette is fixed to the ORYN brand.
- **Accessibility** — semantic landmarks, a skip link, keyboard-focusable cards, `aria` labels, and full `prefers-reduced-motion` support (particles and animations disable automatically).
- **Performance** — no external JS libraries; fonts load from Google Fonts with `preconnect`; the particle animation pauses when the hero scrolls off-screen.
- **Browser support** — modern evergreen browsers (Chrome, Edge, Firefox, Safari).
```

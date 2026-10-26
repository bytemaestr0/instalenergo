# Instalelectro – React (Vite)

    npm install
    npm run dev      # local dev server
    npm run build    # production build in /dist

- Texts (RO/EN): `src/i18n.js`
- Colors: CSS variables at top of `src/styles.css`
- Contact form opens the visitor's email app (no backend needed). To send directly, connect it to Formspree/EmailJS in `submit()` in `src/App.jsx`.

## Deploy
Push to GitHub, then import the repo on vercel.com. Vercel detects Vite automatically
(Build command: `npm run build`, Output directory: `dist`).
Put photos in `public/images/` as solar.jpg, security.jpg, electric.jpg.

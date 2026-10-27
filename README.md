# Instalenergo – React (Vite)

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

## Contact form -> your email (free)
1. Go to https://web3forms.com, enter the email that should receive requests, copy the Access Key from the email.
2. Locally: copy `.env.example` to `.env` and paste the key after `VITE_WEB3FORMS_KEY=`.
3. On Vercel: Project -> Settings -> Environment Variables -> add `VITE_WEB3FORMS_KEY`, then redeploy.
Without a key the form falls back to opening the visitor's email app.

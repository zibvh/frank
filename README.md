# Ben 10 Game

A 3D Ben 10 alien explorer built with React + Three.js.

## Setup

```bash
npm install
npm run dev       # local dev server at http://localhost:5173
npm run build     # production build → /dist
npm run preview   # preview the build locally
```

## Adding theme songs

1. Drop your audio files into `public/songs/` (MP3, WAV, OGG, etc.)
2. Register them in `src/App.jsx`:

```js
const THEME_SONGS = [
  "/songs/btheme.mp3",
  "/songs/btheme2.mp3",
];
```

Songs shuffle automatically and loop forever in the background.

## GitHub Pages deployment

1. Push this folder to a GitHub repo.
2. Go to **Settings → Pages → Source** and set it to **GitHub Actions**.
3. Every push to `main` will build and deploy automatically.

### Repo not at root?
If your site URL will be `https://username.github.io/ben10-game/` (not a custom domain),
edit `vite.config.js` and set:

```js
base: "/ben10-game/",
```

Then push again.

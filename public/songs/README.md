# Songs

Drop your theme song files here.

Supported formats: MP3, WAV, OGG, M4A, AAC

Then register them in `src/App.jsx` under `THEME_SONGS`:

```js
const THEME_SONGS = [
  "/songs/btheme.mp3",
  "/songs/btheme2.mp3",
];
```

Files in this folder are served as static assets by Vite.
They will be included in the build output automatically.

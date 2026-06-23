# Frank X

Ben 10 alien explorer — React + Three.js, packaged as an Android APK via Capacitor.

## Local dev

```bash
npm install
npm run dev
```

## Building the APK via GitHub Actions

### 1. Set up your keystore secrets

Go to your repo → **Settings → Secrets and variables → Actions** and add:

| Secret name | Value |
|---|---|
| `KEYSTORE_BASE64` | Your `.keystore` file encoded as base64 (see below) |
| `KEYSTORE_PASSWORD` | Your keystore password |
| `KEY_ALIAS` | Your key alias |
| `KEY_PASSWORD` | Your key password |

**To base64-encode your keystore:**
```bash
# macOS / Linux
base64 -i your-key.keystore | pbcopy   # copies to clipboard

# Windows (PowerShell)
[Convert]::ToBase64String([IO.File]::ReadAllBytes("your-key.keystore")) | clip
```

### 2. Push to main

Every push to `main` triggers the workflow. When it finishes:

1. Go to **Actions** tab in your repo
2. Click the latest run
3. Scroll to **Artifacts** at the bottom
4. Download **frank-x-apk**

The zip contains `frank-x.apk` — install it on your phone.

## Adding theme songs

Drop audio files into `public/songs/`, then register in `src/App.jsx`:

```js
const THEME_SONGS = [
  "./songs/btheme.mp3",
  "./songs/btheme2.mp3",
];
```

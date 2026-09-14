# Aura Music Player 🎵

Aura Music is a professional, responsive, and modern hybrid music player application. It seamlessly integrates a high-quality local MP3 player with a powerful **Online Music Search** engine powered by the official YouTube Data API v3 and YouTube IFrame Player API.

## ✨ Features

### Hybrid Playback Engine
* **Local Music Support:** Built-in HTML5 Audio engine to play local MP3 files flawlessly.
* **YouTube Integration:** Completely legitimate and ToS-compliant online playback. It embeds the **Official YouTube IFrame Player API** directly into the UI, allowing you to search and play YouTube music directly from the app without any illegal MP3 extraction.

### Core Player Capabilities
* **Full Playback Controls:** Play, Pause, Next, Previous, Volume Control, and Timeline Scrubbing.
* **Smart Shuffle & Repeat:** Fully functional Shuffle (random playback) and Repeat (loop current track) mechanics for both local and online queues.
* **Favorites System:** Save your preferred tracks. Local and online favorites are persisted efficiently via browser `localStorage`.
* **Category Playlists:** Explore curated local playlists organized by genres (Pop, Bollywood, Bengali).

### UI/UX Design
* **Modern Aesthetic:** A sleek, high-contrast dark theme ("Aura" design system) with vibrant neon green accents and smooth glassmorphism effects.
* **Fully Responsive:** Meticulously designed to work across desktop, tablet, and mobile screens. The player panel intelligently adapts to mobile devices, ensuring all controls (including progress bar and volume) remain accessible and functional on small screens.
* **Visual Feedback:** Interactive vinyl record animations, toast notifications for user actions, and dynamic album artwork swapping.

---

## 🛠️ Setup & Installation

### 1. Running the Application
1. Clone or download this repository.
2. Open the project folder in your preferred code editor (e.g., VS Code).
3. The application is entirely client-side. You can run it instantly using an extension like **Live Server**.
4. Open `index.html` in your web browser.

### 2. Configuring the YouTube Data API v3
**IMPORTANT:** The "Online Music Search" functionality requires a Google Cloud API Key.

1. Navigate to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new Project (e.g., "Aura Music Player").
3. Go to **APIs & Services > Library**.
4. Search for **"YouTube Data API v3"** and click **Enable**.
5. Go to **APIs & Services > Credentials**.
6. Click **Create Credentials** and select **API Key**.
7. Copy the generated API key.
8. *(Recommended)* Apply API key restrictions (HTTP referrers) to secure your key and prevent unauthorized usage.

### 3. Integrating the API Key

1. Open `js/script.js`.
2. Locate the `CONFIG` object at the top of the file:

```javascript
const CONFIG = {
    YOUTUBE_API_KEY: "YOUR_API_KEY", // <--- Paste your API key here
    MAX_RESULTS: 15
};
```
3. Replace `"YOUR_API_KEY"` with your actual key and save the file.

> **Security Note:** While embedding API keys in frontend code is acceptable for local development or student projects, a production deployment should route these API calls through a secure backend service to protect the credentials.

---

## 🏗️ Architecture & Compliance

### Why the IFrame API?
YouTube's Terms of Service strictly prohibit scraping audio streams or converting videos to MP3 files. Aura Music maintains strict compliance by utilizing:
1. **YouTube Data API v3 (`search.list`)**: To securely retrieve video metadata (Title, Channel, Thumbnail, Video ID).
2. **YouTube IFrame Player API**: To embed an official YouTube player. Our custom UI controls interface securely with this embedded iframe via Javascript (`ytPlayer.playVideo()`, `ytPlayer.pauseVideo()`).

### State Management Separation
The application relies on a strict `currentPlaybackMode` state (`local` or `online`):
* **Local Mode:** The HTML5 `<audio>` element handles playback. The UI displays high-res album artwork.
* **Online Mode:** The YouTube `<iframe>` takes control. The UI swaps the artwork for the embedded video player.

This architectural separation ensures that the two playback engines never overlap, preventing audio conflicts and optimizing browser performance.

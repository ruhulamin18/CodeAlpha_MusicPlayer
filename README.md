# Aura Music Player

A polished, responsive music player for local MP3 playback with optional YouTube music discovery. Aura Music Player combines a focused dark interface, smooth playback controls, genre-based playlists, persistent favourites, and an official YouTube player integration.

**Developed by Md. Ruhul Amin**

## Overview

Aura Music Player supports two playback modes:

- **Local Music:** Plays MP3 files stored in `assets/music/` using the browser's native HTML5 Audio API.
- **Online Music:** Searches YouTube through the YouTube Data API v3 and plays selected results through the official YouTube IFrame Player API.

The application is built as a lightweight client-side web app using HTML, CSS, and vanilla JavaScript, with Vite used for local development and production builds.

## Features

### Playback

- Play, pause, previous, and next track controls
- Timeline seeking and volume control
- Shuffle and repeat modes
- Animated vinyl-style artwork
- Automatic track progression
- Responsive player panel for desktop, tablet, and mobile screens

### Local Music Library

- MP3 files loaded from `assets/music/`
- Curated Pop, Bollywood, and Bengali categories
- Local favourites saved in browser `localStorage`
- Album artwork for every track with a built-in fallback artwork
- Search through the local music collection

### YouTube Search

- Search YouTube from within the application
- Official YouTube thumbnails and embedded playback
- Online favourites saved in browser `localStorage`
- Separate local and online playback states to prevent audio conflicts

### User Interface

- Modern dark theme with neon green accents
- Sidebar navigation and genre playlists
- Dynamic playlist headers and song counts
- Toast notifications for user actions
- Mobile-friendly layout and controls

## Technology Stack

- HTML5
- CSS3
- Vanilla JavaScript
- HTML5 Audio API
- YouTube Data API v3
- YouTube IFrame Player API
- Vite

## Project Structure

```text
modern-music-player/
├── assets/
│   └── music/          # Local MP3 files
├── css/
│   └── style.css       # Application styling and responsive layout
├── js/
│   └── script.js       # Player logic, playlists, search, and state
├── index.html          # Main application shell
├── metadata.json       # Application metadata
├── package.json        # Scripts and dependencies
├── tsconfig.json       # TypeScript tooling configuration
└── vite.config.ts      # Vite configuration
```

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm

### Installation

1. Clone the repository or download the project.
2. Open a terminal in the project directory.
3. Install the dependencies:

```bash
npm install
```

### Run Locally

Start the Vite development server:

```bash
npm run dev
```

Then open the local URL shown in the terminal, normally:

```text
http://localhost:3000
```

### Production Build

Create an optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Adding Local Songs

1. Place the MP3 file inside `assets/music/`.
2. Open `js/script.js`.
3. Add a new object to the `localSongs` array using this format:

```javascript
{
    id: 'L20',
    title: 'Song Title',
    artist: 'Artist Name',
    src: '/assets/music/Song Title.mp3',
    cover: 'https://example.com/cover.jpg',
    category: 'Pop'
}
```

Use a unique ID for every track. Supported categories currently include `Pop`, `Bollywood`, and `Bengali`.

## YouTube API Configuration

Online search requires a YouTube Data API v3 key.

1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Create or select a Google Cloud project.
3. Enable **YouTube Data API v3** from the API Library.
4. Create an API key under **APIs & Services > Credentials**.
5. Open `js/script.js` and update the configuration:

```javascript
const CONFIG = {
    YOUTUBE_API_KEY: 'YOUR_API_KEY',
    MAX_RESULTS: 15
};
```

For a public production deployment, restrict the API key by HTTP referrer and consider routing API requests through a secure backend.

## Privacy and Compliance

The application does not extract or download audio from YouTube. Search results use YouTube Data API metadata, while playback uses the official YouTube IFrame Player API. Local audio files are played directly in the user's browser.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Vite development server on port 3000 |
| `npm run build` | Creates the production bundle in `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | Runs the configured TypeScript check |

## Author

**Md. Ruhul Amin**

Built with attention to clean interaction, reliable playback, and an enjoyable listening experience.

/**
 * BEATZ Music Player - JavaScript Logic
 * Upgraded with Official YouTube Data API v3 integration for Online Search.
 */

// =========================================================================
// 1. CONFIGURATION (YOUTUBE API)
// =========================================================================
/* 
   IMPORTANT: Do NOT expose your real API key in production frontend code.
   For this student project demo, replace "YOUR_API_KEY" with a valid key. 
   Instructions on getting a key are in README.md.
*/
const CONFIG = {
    YOUTUBE_API_KEY: "YOUR_API_KEY", 
    MAX_RESULTS: 15
};

// =========================================================================
// 2. STATE VARIABLES
// =========================================================================

// Enums & Engine Modes
const MODE_LOCAL = 'local';
const MODE_ONLINE = 'online';

let currentPlaybackMode = MODE_LOCAL; // Which engine is currently active
let currentView = 'explore';          // Which UI view is active

let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let volumeLevel = 0.8;

// Local Data
let currentLocalIndex = 0;
let localFavorites = JSON.parse(localStorage.getItem('beatz_local_favs')) || [];

// Online Data
let onlineResultsQueue = [];
let currentOnlineIndex = 0;
let onlineFavorites = JSON.parse(localStorage.getItem('beatz_online_favs')) || [];

// =========================================================================
// 3. MUSIC DATA (Local HTML5 MP3s)
// =========================================================================
const localSongs = [
    {
        id: 'L1', title: "A Thousand Years (Lyrics)", artist: "Christina Perri",
        src: "/assets/music/Christina Perri - A Thousand Years (Lyrics).mp3", 
        cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=300&q=80",
        category: "Pop"
    },
    {
        id: 'L2', title: "Believer (Lyrics)", artist: "Imagine Dragons",
        src: "/assets/music/Imagine Dragons - Believer (Lyrics) [W0DM5lcj6mw].mp3",
        cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80",
        category: "Pop"
    },
    {
        id: 'L3', title: "Attention (Lyrics)", artist: "Charlie Puth",
        src: "/assets/music/Charlie Puth - Attention (Lyrics) [Oz5JDtkf1as].mp3",
        cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80",
        category: "Pop"
    },
    {
        id: 'L4', title: "Love Me Like You Do", artist: "Ellie Goulding",
        src: "/assets/music/Ellie Goulding - Love Me Like You Do (Lyrics) [MGdH0Lm7f0I].mp3",
        cover: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80",
        category: "Pop"
    },
    {
        id: 'L5', title: "Perfect (Lyrics)", artist: "Ed Sheeran",
        src: "/assets/music/Ed Sheeran - Perfect (Lyrics) [kPhpHvnnn0Q].mp3",
        cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=300&q=80",
        category: "Pop"
    },
    {
        id: 'L6', title: "Nachange Saari Raat (Junooniyat)", artist: "T-Series",
        src: "/assets/music/Nachange Saari Raat Full Video Song _ JUNOONIYAT _ Pulkit Samrat,Yami Gautam_ T-Series [rxMmistOjCA].mp3", 
        cover: "https://images.unsplash.com/photo-1595972049618-4b711e5cf1b4?auto=format&fit=crop&w=300&q=80",
        category: "Bollywood"
    },
    {
        id: 'L7', title: "Ekhon Ami Onek Valo Tomay Chara", artist: "Slowed + Reverb",
        src: "/assets/music/এখন আমি অনেক ভালো তোমায় ছাড়া থাকতে পারি। ( Slowed + Reverb) [fl1gPghIMME].mp3",
        cover: "https://images.unsplash.com/photo-1533050487297-09b450131914?auto=format&fit=crop&w=300&q=80",
        category: "Bengali"
    },
    {
        id: 'L8', title: "Khola Janala (Lofi Remake)", artist: "SWAT Band",
        src: "/assets/music/খোলা জানালা   Khola Janala (Lofi Remake) SWAT Band   Tahsin Ahmed   Ahmed Shakib.mp3",
        cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=300&q=80",
        category: "Bengali"
    },
    {
        id: 'L9', title: "Kabhi Jo Badal Barse", artist: "Arijit Singh",
        src: "/assets/music/Kabhi Jo Badal Barse  Song Video Jackpot   Arijit Singh   Sachiin J Joshi, Sunny Leone.mp3",
        cover: "https://images.unsplash.com/photo-1595972049618-4b711e5cf1b4?auto=format&fit=crop&w=300&q=80",
        category: "Bollywood"
    },
    {
        id: 'L10', title: "Raabta", artist: "Arijit Singh",
        src: "/assets/music/Arijit Singh - Raabta (Lyrics Video)_ Agent Vinod _ Saif Ali Khan , Kareena Kapoor Khan. [vEe-UgJvUHE].mp3",
        cover: "https://images.unsplash.com/photo-1596726207135-2634354c0cfb?auto=format&fit=crop&w=300&q=80",
        category: "Bollywood"
    },
    {
        id: 'L11', title: "Tum Hi Ho", artist: "Arijit Singh",
        src: "/assets/music/_Tum Hi Ho_ Aashiqui 2 Full Song With Lyrics _ Aditya Roy Kapur, Shraddha Kapoor [Umqb9KENgmk].mp3",
        cover: "https://images.unsplash.com/photo-1517230878791-228b730c7790?auto=format&fit=crop&w=300&q=80",
        category: "Bollywood"
    },
    {
        id: 'L12', title: "Safe And Sound (Lyrics)", artist: "Capital Cities",
        src: "/assets/music/Capital Cities - Safe And Sound (Lyrics) [jR-OsKMD80c].mp3",
        cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=300&q=80",
        category: "Pop"
    },
    {
        id: 'L13', title: "Lemon Tree (Lyrics)", artist: "Fools Garden",
        src: "/assets/music/Lemon Tree - Fools Garden (Lyrics) [fCPoKsTJfDs].mp3",
        cover: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80",
        category: "Pop"
    },
    {
        id: 'L14', title: "Hey, Soul Sister (Lyrics)", artist: "Train",
        src: "/assets/music/Train - Hey, Soul Sister (Lyrics) [-lEPX2fF4Ls].mp3",
        cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80",
        category: "Pop"
    },
    {
        id: 'L15', title: "Pal", artist: "Arijit Singh, Shreya Ghoshal",
        src: "/assets/music/Pal - Lyrical Video   Jalebi   Arijit Singh   Shreya Ghoshal   Rhea & Varun   Javed - Mohsin.mp3",
        cover: "https://images.unsplash.com/photo-1595972049618-4b711e5cf1b4?auto=format&fit=crop&w=300&q=80",
        category: "Bollywood"
    },
    {
        id: 'L16', title: "Pal Pal Dil Ke Paas", artist: "Arijit Singh",
        src: "/assets/music/Pal Pal Dil Ke Paas - Title _ Arijit Singh _ Karan Deol, Sahher _ Parampara, Sachet, Rishi Rich [lgTHGZF3BQw].mp3",
        cover: "https://images.unsplash.com/photo-1517230878791-228b730c7790?auto=format&fit=crop&w=300&q=80",
        category: "Bollywood"
    },
    {
        id: 'L17', title: "Kaun Tujhe", artist: "Amaal Mallik, Palak",
        src: "/assets/music/KAUN TUJHE  Lyrical   M.S. DHONI -THE UNTOLD STORY   Amaal Mallik Palak   Sushant Singh Disha Patani.mp3",
        cover: "https://images.unsplash.com/photo-1596726207135-2634354c0cfb?auto=format&fit=crop&w=300&q=80",
        category: "Bollywood"
    },
    {
        id: 'L18', title: "La La La", artist: "Energetic Dance Pop",
        src: "/assets/music/La La La – Energetic Dance Pop Hit 2025 _ Viral Slap House Vibes.mp3",
        cover: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=300&q=80",
        category: "Pop"
    },
    {
        id: 'L19', title: "Long Distance Love", artist: "Ankan, Afrin",
        src: "/assets/music/Long Distance Love _ Coke Studio Bangla _ Season 3 _ Ankan X Afrin _ Shuvendu [sqJ2QhjBQaw].mp3",
        cover: "https://images.unsplash.com/photo-1533050487297-09b450131914?auto=format&fit=crop&w=300&q=80",
        category: "Bengali"
    }
];

const DEFAULT_COVER = `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
        <rect width="300" height="300" fill="#26332f"/>
        <circle cx="150" cy="150" r="92" fill="#101515" stroke="#79e316" stroke-width="7"/>
        <circle cx="150" cy="150" r="25" fill="#79e316"/>
        <circle cx="150" cy="150" r="9" fill="#101515"/>
        <path d="M150 58v55" stroke="#79e316" stroke-width="7" stroke-linecap="round"/>
    </svg>
`)}`;

function handleCoverError(image) {
    image.onerror = null;
    image.src = DEFAULT_COVER;
}

// =========================================================================
// 4. ICONS
// =========================================================================
const ICONS = {
    playOutline: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`,
    pauseOutline: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`,
    playSolid: `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`,
    pauseSolid: `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`,
    heartOutline: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
    heartFilled: `<svg viewBox="0 0 24 24" fill="var(--heart)" stroke="var(--heart)" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`
};

// =========================================================================
// 5. DOM ELEMENTS
// =========================================================================
const audioHTML5 = new Audio();

// Controls
const mainPlayBtn = document.getElementById('main-play-btn');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const repeatBtn = document.getElementById('repeat-btn');
const progressBar = document.getElementById('progress-bar');
const volumeBar = document.getElementById('volume-bar');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');

// UI Panes & Text
const playerModeLabel = document.getElementById('player-mode-label');
const playerArtWrapper = document.getElementById('player-art-wrapper');
const ytPlayerWrapper = document.getElementById('yt-player-wrapper');
const playerArt = document.getElementById('player-art');
const playerTitle = document.getElementById('player-title');
const playerArtist = document.getElementById('player-artist');

const playlistContainer = document.getElementById('playlist-container');
const totalSongsEl = document.getElementById('total-songs');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const toast = document.getElementById('toast');
const loadingIndicator = document.getElementById('loading-indicator');
const apiKeyWarning = document.getElementById('api-key-warning');

const viewTitleEl = document.getElementById('view-title');
const breadcrumbCurrentEl = document.getElementById('breadcrumb-current');
const viewImageEl = document.getElementById('view-image');
const mainShowcase = document.getElementById('main-showcase');


// =========================================================================
// 6. INITIALIZATION & YOUTUBE API LOAD
// =========================================================================
let ytPlayer;
let isYtApiReady = false;
let ytProgressInterval;

function init() {
    // 1. Load Local Array
    loadLocalSong(currentLocalIndex);
    
    // 2. Load YouTube API
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    
    // 3. Render initial view
    switchView('explore');

    // Init volume
    setVolume(volumeBar.value);
}

window.onYouTubeIframeAPIReady = function() {
    isYtApiReady = true;
    ytPlayer = new YT.Player('ytplayer', {
        height: '100%',
        width: '100%',
        playerVars: {
            'playsinline': 1,
            'controls': 0, // We use our custom UI
            'disablekb': 1,
            'fs': 0,
            'rel': 0
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError
        }
    });
};

function onPlayerReady(event) {
    ytPlayer.setVolume(volumeLevel * 100);
}

function onPlayerStateChange(event) {
    if (currentPlaybackMode !== MODE_ONLINE) return;

    if (event.data === YT.PlayerState.PLAYING) {
        isPlaying = true;
        updatePlayPauseUI();
        startYtProgressTracker();
        // Get precise duration once playing
        durationEl.textContent = formatTime(ytPlayer.getDuration());
    } 
    else if (event.data === YT.PlayerState.PAUSED) {
        isPlaying = false;
        updatePlayPauseUI();
        stopYtProgressTracker();
    }
    else if (event.data === YT.PlayerState.ENDED) {
        playNextOnlineSong(true);
    }
}

function onPlayerError(e) {
    showError("YouTube Player Error. Video might be restricted.", true);
    setTimeout(playNextOnlineSong, 2500);
}

// =========================================================================
// 7. ONLINE SEARCH (YOUTUBE DATA API)
// =========================================================================
async function searchOnlineMusic(query) {
    if (!query.trim()) return;
    
    if (CONFIG.YOUTUBE_API_KEY === "YOUR_API_KEY") {
        showError("Please set your YouTube API Key in js/script.js", true);
        apiKeyWarning.classList.remove('hidden');
        return;
    }
    apiKeyWarning.classList.add('hidden');

    playlistContainer.innerHTML = '';
    loadingIndicator.classList.remove('hidden');

    try {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(query)}&maxResults=${CONFIG.MAX_RESULTS}&key=${CONFIG.YOUTUBE_API_KEY}`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        if (data.items && data.items.length > 0) {
            // Map YT data to our song object format
            onlineResultsQueue = data.items.map(item => ({
                id: item.id.videoId,
                title: decodeHTMLEntities(item.snippet.title),
                artist: decodeHTMLEntities(item.snippet.channelTitle),
                cover: item.snippet.thumbnails.high.url
            }));
            
            renderList(onlineResultsQueue, MODE_ONLINE);
        } else {
            playlistContainer.innerHTML = '<div style="color:var(--text-muted); padding:20px; text-align:center;">No results found for your search.</div>';
        }
    } catch (error) {
        console.error("YT API Error:", error);
        showError("Failed to fetch online music. Check API key or quota.", true);
    } finally {
        loadingIndicator.classList.hidden = true;
        loadingIndicator.classList.add('hidden');
    }
}

// =========================================================================
// 8. PLAYBACK ROUTING & CONTROLS
// =========================================================================

function togglePlayPause() {
    if (isPlaying) {
        pausePlayback();
    } else {
        playPlayback();
    }
}

function playPlayback() {
    isPlaying = true;
    updatePlayPauseUI();
    
    if (currentPlaybackMode === MODE_LOCAL) {
        audioHTML5.play().catch(e => console.warn(e));
        playerArt.classList.add('spin');
        playerArt.classList.remove('paused');
    } else {
        if(isYtApiReady && ytPlayer && ytPlayer.playVideo) {
            ytPlayer.playVideo();
        }
    }
    renderActiveStateInList();
}

function pausePlayback() {
    isPlaying = false;
    updatePlayPauseUI();

    if (currentPlaybackMode === MODE_LOCAL) {
        audioHTML5.pause();
        playerArt.classList.add('paused');
    } else {
        if(isYtApiReady && ytPlayer && ytPlayer.pauseVideo) {
            ytPlayer.pauseVideo();
        }
    }
    renderActiveStateInList();
}

function playNext(isAutoEnded = false) {
    if (isAutoEnded && isRepeat) {
        if (currentPlaybackMode === MODE_LOCAL) {
            audioHTML5.currentTime = 0;
            playPlayback();
        } else {
            if (ytPlayer && typeof ytPlayer.seekTo === 'function') {
                ytPlayer.seekTo(0);
                ytPlayer.playVideo();
            }
        }
        return;
    }

    if (currentPlaybackMode === MODE_LOCAL) {
        let list = localSongs;
        if (currentView === 'local_favourites') {
            list = localSongs.filter(s => localFavorites.includes(s.id));
        } else if (currentView.startsWith('playlist_')) {
            const cat = currentView.split('_')[1];
            list = localSongs.filter(s => s.category === cat);
        }
        
        if (list.length === 0) return;
        
        let currentIdxInList = list.findIndex(s => s.id === localSongs[currentLocalIndex].id);
        if (currentIdxInList === -1) currentIdxInList = 0; // Fallback
        
        let nextIdxInList;
        if (isShuffle) {
            nextIdxInList = Math.floor(Math.random() * list.length);
        } else {
            nextIdxInList = (currentIdxInList + 1) % list.length;
        }
        const globalIdx = localSongs.findIndex(s => s.id === list[nextIdxInList].id);
        
        currentLocalIndex = globalIdx;
        loadLocalSong(currentLocalIndex);
        playPlayback();
    } else {
        playNextOnlineSong(isAutoEnded);
    }
}

function playPrev() {
    if (currentPlaybackMode === MODE_LOCAL) {
        if (audioHTML5.currentTime > 3) {
            audioHTML5.currentTime = 0;
            return;
        }
        
        let list = localSongs;
        if (currentView === 'local_favourites') {
            list = localSongs.filter(s => localFavorites.includes(s.id));
        } else if (currentView.startsWith('playlist_')) {
            const cat = currentView.split('_')[1];
            list = localSongs.filter(s => s.category === cat);
        }
        
        if (list.length === 0) return;
        
        let currentIdxInList = list.findIndex(s => s.id === localSongs[currentLocalIndex].id);
        if (currentIdxInList === -1) currentIdxInList = 0; // Fallback
        
        const prevIdxInList = (currentIdxInList - 1 + list.length) % list.length;
        const globalIdx = localSongs.findIndex(s => s.id === list[prevIdxInList].id);
        
        currentLocalIndex = globalIdx;
        loadLocalSong(currentLocalIndex);
        playPlayback();
    } else {
        playPreviousOnlineSong();
    }
}

function playNextOnlineSong(isAutoEnded = false) {
    if (isAutoEnded && isRepeat) {
        if (ytPlayer && typeof ytPlayer.seekTo === 'function') {
            ytPlayer.seekTo(0);
            ytPlayer.playVideo();
        }
        return;
    }
    if (onlineResultsQueue.length === 0) return;
    
    if (isShuffle) {
        currentOnlineIndex = Math.floor(Math.random() * onlineResultsQueue.length);
    } else {
        currentOnlineIndex = (currentOnlineIndex + 1) % onlineResultsQueue.length;
    }
    loadOnlineSong(onlineResultsQueue[currentOnlineIndex], currentOnlineIndex);
}

function playPreviousOnlineSong() {
    if (onlineResultsQueue.length === 0) return;
    currentOnlineIndex = (currentOnlineIndex - 1 + onlineResultsQueue.length) % onlineResultsQueue.length;
    loadOnlineSong(onlineResultsQueue[currentOnlineIndex], currentOnlineIndex);
}


// =========================================================================
// 9. ENGINE LOADERS
// =========================================================================

function loadLocalSong(index) {
    currentPlaybackMode = MODE_LOCAL;
    const song = localSongs[index];
    if (!song) return;

    // Pause online if running
    if (isYtApiReady && ytPlayer && ytPlayer.pauseVideo) ytPlayer.pauseVideo();

    // Setup Local Audio
    audioHTML5.src = song.src;
    audioHTML5.currentTime = 0;
    
    // UI Switch
    switchToLocalPlayerUI(song);
    updateFavoriteIcon(song.id);
}

function loadOnlineSong(songObj, index) {
    if (!isYtApiReady) {
        showError("YouTube Player is still loading. Please wait.");
        return;
    }
    
    currentPlaybackMode = MODE_ONLINE;
    currentOnlineIndex = index;
    
    // Pause local if running
    audioHTML5.pause();

    // Setup YT Audio/Video
    ytPlayer.loadVideoById(songObj.id);
    
    // UI Switch
    switchToOnlinePlayerUI(songObj);
    updateFavoriteIcon(songObj.id);
}

// =========================================================================
// 10. PLAYER UI SWITCHING
// =========================================================================

function switchToLocalPlayerUI(song) {
    playerModeLabel.textContent = "LOCAL PLAYER";
    
    // Toggle Visibility
    ytPlayerWrapper.classList.add('hidden');
    playerArtWrapper.classList.remove('hidden');
    
    playerArt.onerror = () => handleCoverError(playerArt);
    playerArt.src = song.cover || DEFAULT_COVER;
    playerTitle.textContent = song.title;
    playerArtist.textContent = song.artist;
    
    resetProgressUI();
}

function switchToOnlinePlayerUI(songObj) {
    playerModeLabel.textContent = "ONLINE PLAYER";
    
    // Toggle Visibility
    playerArtWrapper.classList.add('hidden');
    ytPlayerWrapper.classList.remove('hidden');
    
    playerTitle.textContent = songObj.title;
    playerArtist.textContent = songObj.artist;
    
    resetProgressUI();
}

function updatePlayPauseUI() {
    const playIcon = isPlaying ? ICONS.pauseSolid : ICONS.playSolid;
    playBtn.innerHTML = playIcon;
    mainPlayBtn.innerHTML = playIcon;
    
    if (currentPlaybackMode === MODE_LOCAL && isPlaying) {
        playBtn.classList.add('playing');
    } else {
        playBtn.classList.remove('playing');
    }
}

// =========================================================================
// 11. PROGRESS & VOLUME SYNC
// =========================================================================

// Local Tracking
audioHTML5.addEventListener('timeupdate', () => {
    if (currentPlaybackMode !== MODE_LOCAL) return;
    const { duration, currentTime } = audioHTML5;
    if (duration) {
        progressBar.value = (currentTime / duration) * 100;
        currentTimeEl.textContent = formatTime(currentTime);
        durationEl.textContent = formatTime(duration);
    }
});
audioHTML5.addEventListener('ended', () => playNext(true));

// Online Tracking
function startYtProgressTracker() {
    stopYtProgressTracker();
    ytProgressInterval = setInterval(() => {
        if (ytPlayer && isPlaying && currentPlaybackMode === MODE_ONLINE) {
            const curr = ytPlayer.getCurrentTime();
            const dur = ytPlayer.getDuration();
            if (dur > 0) {
                progressBar.value = (curr / dur) * 100;
                currentTimeEl.textContent = formatTime(curr);
            }
        }
    }, 500);
}
function stopYtProgressTracker() {
    clearInterval(ytProgressInterval);
}

// Seek UI 
progressBar.addEventListener('input', (e) => {
    const percent = e.target.value;
    if (currentPlaybackMode === MODE_LOCAL) {
        if (audioHTML5.duration) {
            audioHTML5.currentTime = (percent / 100) * audioHTML5.duration;
        }
    } else {
        if (ytPlayer && ytPlayer.getDuration) {
            const seekTime = (percent / 100) * ytPlayer.getDuration();
            ytPlayer.seekTo(seekTime, true);
        }
    }
});

// Volume
function setVolume(val) {
    volumeLevel = val / 100;
    audioHTML5.volume = volumeLevel;
    if (isYtApiReady && ytPlayer && ytPlayer.setVolume) {
        ytPlayer.setVolume(volumeLevel * 100);
    }
}
volumeBar.addEventListener('input', (e) => setVolume(e.target.value));

function resetProgressUI() {
    progressBar.value = 0;
    currentTimeEl.textContent = "0:00";
    durationEl.textContent = "0:00";
}


// =========================================================================
// 12. VIEW ROUTING & RENDERING (Sidebar Logic)
// =========================================================================
const sidebarNavBtns = document.querySelectorAll('.sidebar-nav-btn');

function switchView(viewName) {
    currentView = viewName;
    sidebarNavBtns.forEach(b => {
        b.classList.remove('active');
        if (b.dataset.view === viewName) b.classList.add('active');
    });

    searchInput.value = ''; // clear search on navigation
    mainShowcase.classList.remove('hidden');

    if (viewName === 'explore') {
        updateHeader("EXPLORE LOCAL", "local", localSongs.length, "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80");
        renderList(localSongs, MODE_LOCAL);
    } 
    else if (viewName === 'local_favourites') {
        const favs = localSongs.filter(s => localFavorites.includes(s.id));
        updateHeader("LOCAL FAVOURITES", "local", favs.length, "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=400&q=80");
        renderList(favs, MODE_LOCAL);
    }
    else if (viewName === 'online_search') {
        // We hide the big banner for online search, since we want focus on the list
        mainShowcase.classList.add('hidden');
        breadcrumbCurrentEl.textContent = "Search YouTube";
        
        if (onlineResultsQueue.length > 0) {
            renderList(onlineResultsQueue, MODE_ONLINE);
        } else {
            playlistContainer.innerHTML = '<div style="color:var(--text-muted); padding:40px; text-align:center;">Use the search bar above to find music on YouTube.</div>';
            totalSongsEl.textContent = '0 Songs';
        }
    }
    else if (viewName === 'online_favourites') {
        mainShowcase.classList.add('hidden');
        breadcrumbCurrentEl.textContent = "Online Favourites";
        
        if (onlineFavorites.length > 0) {
            // Because online favorites are stored complete, we just render them
            onlineResultsQueue = onlineFavorites; 
            renderList(onlineFavorites, MODE_ONLINE);
        } else {
            playlistContainer.innerHTML = '<div style="color:var(--text-muted); padding:40px; text-align:center;">No online favorites saved yet.</div>';
            totalSongsEl.textContent = '0 Songs';
        }
    }
    else if (viewName.startsWith('playlist_')) {
        const category = viewName.split('_')[1];
        const playlistSongs = localSongs.filter(s => s.category === category);
        
        let coverImg = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80";
        if (category === 'Pop') coverImg = "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=400&q=80";
        if (category === 'Bollywood') coverImg = "https://images.unsplash.com/photo-1595972049618-4b711e5cf1b4?auto=format&fit=crop&w=400&q=80";
        if (category === 'Bengali') coverImg = "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=400&q=80";
        
        updateHeader(`${category.toUpperCase()} PLAYLIST`, "local", playlistSongs.length, coverImg);
        renderList(playlistSongs, MODE_LOCAL);
    }
}

sidebarNavBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active from playlist btns if clicking main nav
        document.querySelectorAll('.playlist-nav-btn').forEach(pb => pb.classList.remove('active-playlist'));
        switchView(btn.dataset.view);
    });
});

// Playlist navigation bindings
document.querySelectorAll('.playlist-nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const category = btn.dataset.category;
        
        // Update active classes
        document.querySelectorAll('.playlist-nav-btn').forEach(pb => pb.classList.remove('active-playlist'));
        sidebarNavBtns.forEach(sb => sb.classList.remove('active'));
        btn.classList.add('active-playlist');
        
        switchView(`playlist_${category}`);
    });
});

function updateHeader(title, type, count, imageSrc = null) {
    viewTitleEl.textContent = title;
    breadcrumbCurrentEl.textContent = title;
    totalSongsEl.textContent = `${count} Songs`;
    if (imageSrc) {
        viewImageEl.src = imageSrc;
    } else if (type === 'local') {
        viewImageEl.src = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80";
    }
}

// =========================================================================
// 13. LIST RENDERING (HTML Builder)
// =========================================================================

function renderList(list, type) {
    playlistContainer.innerHTML = '';
    
    // Update counter if we are in online search/fav views
    if (currentView === 'online_search' || currentView === 'online_favourites') {
        totalSongsEl.textContent = `${list.length} Results`;
    } else {
        totalSongsEl.textContent = `${list.length} Songs`;
    }
    
    if (list.length === 0) return;

    list.forEach((song, index) => {
        const row = document.createElement('div');
        row.classList.add('track-row');
        if (type === MODE_ONLINE) row.classList.add('is-online'); // wider thumbnail for YT
        
        // Check active
        let isActive = false;
        if (currentPlaybackMode === MODE_LOCAL && type === MODE_LOCAL && localSongs[currentLocalIndex]?.id === song.id) {
            isActive = true;
        } else if (currentPlaybackMode === MODE_ONLINE && type === MODE_ONLINE && onlineResultsQueue[currentOnlineIndex]?.id === song.id) {
            isActive = true;
        }
        if (isActive) row.classList.add('active');

        // Favorites logic
        let isFav = false;
        if (type === MODE_LOCAL) isFav = localFavorites.includes(song.id);
        else isFav = onlineFavorites.some(f => f.id === song.id);
        
        const heartIcon = isFav ? ICONS.heartFilled : ICONS.heartOutline;
        const playIcon = (isActive && isPlaying) ? ICONS.pauseOutline : ICONS.playOutline;
        
        // Badge
        const badge = type === MODE_ONLINE ? '<span class="track-badge">YouTube</span>' : '';

        row.innerHTML = `
            <div class="track-img">
                <img src="${song.cover || DEFAULT_COVER}" alt="${song.title} artwork" onerror="handleCoverError(this)">
            </div>
            <div class="track-info">
                <span class="track-title">${song.title}</span>
                <span class="track-artist">${song.artist}</span>
                ${badge}
            </div>
            <span class="track-duration">--:--</span>
            <button class="track-action-btn outline-play">${playIcon}</button>
            <button class="track-action-btn heart-btn ${isFav ? 'liked' : ''}" data-id="${song.id}">${heartIcon}</button>
        `;
        
        // Click Handlers
        row.addEventListener('click', (e) => {
            if (e.target.closest('.heart-btn')) return; // handled separately

            if (isActive) {
                togglePlayPause();
            } else {
                if (type === MODE_LOCAL) {
                    const globalIdx = localSongs.findIndex(s => s.id === song.id);
                    currentLocalIndex = globalIdx;
                    loadLocalSong(globalIdx);
                    playPlayback();
                } else {
                    // Update the global online queue to match the currently rendered list (important for favorites view)
                    if(onlineResultsQueue !== list) {
                        onlineResultsQueue = list;
                    }
                    loadOnlineSong(song, index);
                    playPlayback();
                }
            }
        });

        // Heart Btn Logic
        const heartBtn = row.querySelector('.heart-btn');
        heartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (type === MODE_LOCAL) {
                toggleLocalFavorite(song.id);
            } else {
                toggleOnlineFavorite(song);
            }
        });

        playlistContainer.appendChild(row);
    });
}

// Re-renders only the play/pause states without rebuilding the DOM
function renderActiveStateInList() {
    // A simplified approach is just re-rendering the list. 
    // Since UI is lightweight, this works perfectly.
    if (currentView === 'explore' || currentView === 'local_favourites' || currentView.startsWith('playlist_')) {
        let list = localSongs;
        if (currentView === 'local_favourites') {
            list = localSongs.filter(s => localFavorites.includes(s.id));
        } else if (currentView.startsWith('playlist_')) {
            const cat = currentView.split('_')[1];
            list = localSongs.filter(s => s.category === cat);
        }
        renderList(list, MODE_LOCAL);
    } else if (currentView === 'online_search' || currentView === 'online_favourites') {
        renderList(onlineResultsQueue, MODE_ONLINE);
    }
}


// =========================================================================
// 14. FAVORITES LOGIC
// =========================================================================

function toggleLocalFavorite(id) {
    if (localFavorites.includes(id)) {
        localFavorites = localFavorites.filter(fId => fId !== id);
    } else {
        localFavorites.push(id);
    }
    localStorage.setItem('beatz_local_favs', JSON.stringify(localFavorites));
    
    if (currentPlaybackMode === MODE_LOCAL && localSongs[currentLocalIndex].id === id) {
        updateFavoriteIcon(id);
    }
    
    // Refresh view if in favs
    if (currentView === 'local_favourites') switchView('local_favourites');
    else renderActiveStateInList();
}

function toggleOnlineFavorite(songObj) {
    const exists = onlineFavorites.some(f => f.id === songObj.id);
    if (exists) {
        onlineFavorites = onlineFavorites.filter(f => f.id !== songObj.id);
    } else {
        onlineFavorites.push(songObj);
    }
    localStorage.setItem('beatz_online_favs', JSON.stringify(onlineFavorites));
    
    if (currentPlaybackMode === MODE_ONLINE && onlineResultsQueue[currentOnlineIndex].id === songObj.id) {
        updateFavoriteIcon(songObj.id);
    }
    
    // Refresh view if in favs
    if (currentView === 'online_favourites') switchView('online_favourites');
    else renderActiveStateInList();
}

function updateFavoriteIcon(currentId) {
    // Removed player favorite button, so no-op here to prevent errors in list rendering
}

if (shuffleBtn) {
    shuffleBtn.addEventListener('click', () => {
        isShuffle = !isShuffle;
        shuffleBtn.style.color = isShuffle ? 'var(--accent)' : 'var(--text-main)';
        showError(isShuffle ? 'Shuffle Enabled' : 'Shuffle Disabled');
    });
}

if (repeatBtn) {
    repeatBtn.addEventListener('click', () => {
        isRepeat = !isRepeat;
        repeatBtn.style.color = isRepeat ? 'var(--accent)' : 'var(--text-main)';
        showError(isRepeat ? 'Repeat Song Enabled' : 'Repeat Disabled');
    });
}

// =========================================================================
// 15. SEARCH BAR & GLOBAL EVENTS
// =========================================================================

function handleSearchExecute() {
    const query = searchInput.value;
    if (!query) return;

    if (currentView === 'online_search') {
        searchOnlineMusic(query);
    } else if (currentView === 'explore' || currentView === 'local_favourites' || currentView.startsWith('playlist_')) {
        // Local Filter
        let baseList = localSongs;
        if (currentView === 'local_favourites') {
            baseList = localSongs.filter(s => localFavorites.includes(s.id));
        } else if (currentView.startsWith('playlist_')) {
            const cat = currentView.split('_')[1];
            baseList = localSongs.filter(s => s.category === cat);
        }
        
        const filtered = baseList.filter(s => s.title.toLowerCase().includes(query.toLowerCase()) || s.artist.toLowerCase().includes(query.toLowerCase()));
        renderList(filtered, MODE_LOCAL);
    }
}

searchBtn.addEventListener('click', handleSearchExecute);
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSearchExecute();
});

// Controls binding
playBtn.addEventListener('click', togglePlayPause);
mainPlayBtn.addEventListener('click', togglePlayPause);
prevBtn.addEventListener('click', playPrev);
nextBtn.addEventListener('click', playNext);

// Top tabs mock interaction
document.querySelectorAll('.top-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        showError(`Section "${btn.textContent}" coming soon.`);
    });
});

// Utilities
function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function decodeHTMLEntities(text) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
}

function showError(msg, isError = false) {
    toast.textContent = msg;
    toast.className = `toast show ${isError ? 'error' : ''}`;
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}

// Run app
init();

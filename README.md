# JFT Mock Test Platform

[![HTML5](https://img.shields.io/badge/HTML5-E34C26?style=flat&logo=html5&logoColor=white)](https://html5.org/)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive static mock test platform for Japanese language proficiency tests (JFT), nursing care exams, food service certifications, and more. Built with vanilla HTML, CSS, and JavaScript.

## 🎯 Purpose

Provide students with accessible, browser-based mock tests for exam preparation:
- **Real-time testing** with progress tracking and timers
- **Multiple categories**: JFT Basic, Nursing Care (Japanese/Nepali), Food Service, Agriculture, etc.
- **Audio support** for listening comprehension questions (playable twice)
- **Dark mode** for comfortable studying  
- **Mobile-responsive** with Android APK distribution
- **Offline-capable** static site (works with local server)

## ✨ Key Features

**Control Bar** - Fixed bottom bar with time display, dark mode toggle, sound control, and navigation buttons

**Navigation Warnings** - Custom modals prevent accidental data loss when exiting tests (home, back, refresh)

**Audio Player** - Students can play question audio twice for better comprehension

**Download Options** - Dual-server downloads (Google Drive + GitHub) for mobile testing

**Responsive Design** - Optimized for desktop, tablet, and mobile devices

## Features

### Control Bar
- **Fixed bottom bar** on all pages with time, navigation, and utility buttons
- **Time display**: Shows current day name and 24-hour format time (e.g., "Thursday 14:30:45")
- **Dark mode toggle**: Persists preference across sessions
- **Sound toggle**: Controls audio playback for questions
- **Home button** (test pages): Navigate to home page with warning modal
- **Go-to-top button** (home page): Smooth scroll to page top
- **Responsive**: Scales button sizes on mobile devices

### Navigation Warnings
- **Consistent modal popup** for all test exit actions
- Shows warnings for:
  - Home button click
  - Header/title click (on test pages)
  - Back button press
  - Page refresh (F5, Ctrl+R, Cmd+R, browser refresh)
- **Two-button design**: "Continue Test" or "Leave Test"
- **No browser popups**: Custom modal only, no browser default warnings

### Download App
- **Dual servers**: Google Drive and GitHub Releases available
  - **Google Drive**: Direct, fast downloads
  - **GitHub Releases**: Professional distribution with version tracking
- **Easy access**: Both links in footer below credits
- **No expiration**: Both links are permanent (unlike time-limited tokens)
- **User choice**: Users can select preferred download source
- Dark mode compatible

### Audio Player
- **Play twice**: Students can play question audio up to 2 times
- **Helps comprehension**: Allows one replay for better understanding
- **Clear status**: Button text shows "Audio Played (Twice)" when limit reached
- **Session-based**: Play count resets when navigating to different questions
- **Play limit indicator**: Shows "ℹ Can be played **twice only**!" message with each audio question
- **Info icon**: Blue info icon alongside the limit message for visual clarity

### Category Cards Styling
- **Left border accent**: Each test category card displays a colored left border (6px) matching category colors:
  - Food Service: Blue (#1565c0)
  - Agriculture: Green (#388e3c)
  - Nursing Care: Pink/Magenta (#d81b60)
  - JFT Basic: Purple (#7b1fa2)
  - Ground Handling: Teal (#00897b)
  - Building Cleaning: Red (#c62828)

### Password Modal Enhancements
- **Close button (×)**: Positioned in top-right corner of password modal
- **ESC key support**: Press ESC to close modal and return to home page
- **Smooth animations**: Fade-out effect when closing or unlocking

How to preview locally
- Simple: open a `tests/*/index.html` file in a browser.
- Recommended: serve with a local static server. Example (PowerShell):

```powershell
python -m http.server 8000
# then open http://localhost:8000/tests/jft-basic-4/index.html
```

Where to start editing
- Add or update questions in `data/*-data.js` files.
- Images go in `data/images/questions/` or `images/questions/`.
- Layout and UI changes live in `js/` and `data/css/`.
- Control bar features in `data/js/main.js` and `data/css/test.css`.

Control Bar Customization
- **Change button colors**: Edit CSS variables in `data/css/main.css` (--primary, --on-primary)
- **Change warning messages**: Edit `showNavigationWarning()` in `data/js/test-manager.js`
- **Update download link**: Change `apkUrl` and `playStoreUrl` in `data/js/main.js`
- **Adjust spacing**: Modify `.control-bar-content` padding and footer styles in `data/css/test.css` and `data/css/main.css`

If you're an AI or tool
- See `project-metadata/project-metadata.json` for a compact machine-readable summary.
- See `SESSION_CHANGES_LOG.md` for detailed documentation of control bar implementation.

Contact / Author
- Repository owner: `mhzsajan`

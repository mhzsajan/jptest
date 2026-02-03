# JFT Mock Test Platform

[![HTML5](https://img.shields.io/badge/HTML5-E34C26?style=flat&logo=html5&logoColor=white)](https://html5.org/)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive static mock test platform for Japanese language proficiency tests (JFT), nursing care exams, food service certifications, and more. Built with vanilla HTML, CSS, and JavaScript.

## 🎯 Project Objective

### What is This Platform?

**JFT Mock Test Platform** is a comprehensive, browser-based examination preparation system designed for international students and professionals preparing for certifications in Japan. It provides realistic, proctored-style mock tests that help users practice and assess their proficiency before taking actual exams.

### Who Is It For?

- **International Workers**: Preparing for Japanese language proficiency (JFT) exams
- **Healthcare Professionals**: Training for nursing care certifications
- **Food Service Employees**: Preparing for food service industry exams
- **Agriculture Workers**: Training for agricultural certifications
- **Building/Maintenance Staff**: Preparing for building cleaning and ground handling certifications
- **Language Learners**: Anyone wanting to practice Japanese comprehension with audio support

### How It Helps

✅ **Better Exam Preparation**
- Practice with realistic exam conditions (timed tests, multiple questions, progress tracking)
- Familiarize yourself with question formats and difficulty levels
- Identify weak areas and focus study efforts accordingly

✅ **Accessible Learning**
- **Free to use** - No subscription or payment required
- **No registration needed** - Start testing immediately
- **Works offline** - Download the Android APK for offline studying
- **Multiple languages** - Questions available in Japanese and Nepali

✅ **Self-Assessment & Feedback**
- Immediate score results after test completion
- Review answers after submission
- Track progress across multiple attempts
- Understand passing requirements (typically 60-80% depending on exam)

✅ **Mobile-Friendly**
- Practice anywhere, anytime on smartphones or tablets
- Native Android app available for download
- Responsive design for all screen sizes
- Offline capability with downloadable APK

✅ **Real-World Exam Simulation**
- **Timed tests** with countdowns and alerts
- **Audio questions** for listening comprehension (with replay limit like real exams)
- **Image-based questions** for practical understanding
- **Multiple-choice format** matching actual exam structure
- **Password protection** to prevent cheating

### Key Features at a Glance

- **Real-time testing** with progress tracking and timers
- **Multiple test categories**: JFT Basic (4 tests), Nursing Care (Japanese & Nepali), Food Service, Agriculture, Building Cleaning, Ground Handling
- **Audio support** for listening comprehension questions (playable twice, like real exams)
- **Dark mode** for comfortable studying in any lighting condition
- **Mobile-responsive** design optimized for all devices
- **Android APK** available for offline use
- **Offline-capable** static site (works with local server)
- **Dark/Light theme** toggle with persistent preference
- **Navigation safety** - Prevents accidental data loss with confirmation modals
- **Password protected** tests to ensure test integrity

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

## 🚀 Getting Started

### Prerequisites
- **Python 3.x** (to run local server)
- **Modern web browser** (Chrome, Firefox, Safari, Edge)
- **Text editor** (VS Code, Sublime, etc.) for editing questions/code

### Quick Start
```powershell
# 1. Navigate to project directory
cd "g:\VS Code Japan Test"

# 2. Start local server (Python)
python -m http.server 8000

# 3. Open in browser
# http://localhost:8000/tests/jft-basic-4/index.html
# Password: test123
```

### Or Open Directly
- Simply open any file from `tests/*/index.html` in your browser
- Enter password `test123` to unlock test

## � Available Tests

This platform includes **12 comprehensive mock tests** covering various professional certifications in Japan:

### JFT Basic Tests (Japanese Language Proficiency)
| Test | Questions | Duration | Level |
|------|-----------|----------|-------|
| **JFT Basic Test 1** | 55 Questions | 60 minutes | Beginner |
| **JFT Basic Test 2** | 55 Questions | 60 minutes | Beginner |
| **JFT Basic Test 3** | 55 Questions | 60 minutes | Beginner |
| **JFT Basic Test 4** | 60 Questions | 60 minutes | Beginner |

**What it tests**: Basic Japanese language skills including reading, listening, kanji, grammar, and conversation comprehension. Essential for international workers preparing for Japanese proficiency exams.

### Nursing Care Tests
| Test | Questions | Duration | Passing Score |
|------|-----------|----------|---|
| **Nursing Care Japanese Test 1** | 15 Questions | 25 minutes | 60% |
| **Nursing Care Japanese Test 2** | 15 Questions | 25 minutes | 60% |
| **Nursing Care Nepali Test 1** | 45 Questions | 45 minutes | 60% |
| **Nursing Care Nepali Test 2** | 45 Questions | 50 minutes | 60% |

**What it tests**: Knowledge of nursing care procedures, patient safety, hygiene, communication, and professional responsibilities. Critical for healthcare professionals seeking employment in Japanese care facilities.

### Vocational & Professional Certifications
| Test | Questions | Duration | Passing Score |
|------|-----------|----------|---|
| **Food Service Test** | 52 Questions | 60 minutes | 60% |
| **Agriculture Test** | 45 Questions | 50 minutes | 60% |
| **Building Cleaning Test** | 50 Questions | 30 minutes | 60% |
| **Ground Handling Test** | 8 Questions | 15 minutes | 60% |

**What it tests**: Specialized knowledge for various industries in Japan:
- **Food Service**: Food safety, hygiene, serving procedures, customer service
- **Agriculture**: Farming techniques, crop management, equipment operation
- **Building Cleaning**: Cleaning procedures, equipment handling, safety protocols
- **Ground Handling**: Airport operations, cargo handling, safety procedures

## 💡 Study Benefits

### For Individual Learners
- **Self-paced practice** - Study anytime, anywhere
- **Immediate feedback** - Know your score instantly
- **Progress tracking** - Identify improvement areas
- **No pressure** - Practice as many times as needed
- **Realistic format** - Experience actual exam conditions

### For Educational Institutions
- **Assessment tool** - Evaluate student readiness
- **Class assignment** - Assign specific tests to students
- **Progress monitoring** - Track multiple students' performance
- **Cost-effective** - Free platform, no licensing fees
- **Easy deployment** - Can be hosted on any web server

### For Employers/Training Centers
- **Employee verification** - Test employee knowledge before hiring
- **Training validation** - Ensure training effectiveness
- **Certification preparation** - Help employees prepare for official exams
- **Objective assessment** - Standardized testing format

### Adding/Editing Questions
1. Open `tests/{test-name}/{test-name}-data.js`
2. Find the `questions` array
3. Add or modify question objects:
```javascript
{
  text: "Question text here",
  options: ["Option 1", "Option 2", "Option 3"],
  correctAnswer: 0,  // Index of correct option (0-2)
  image: "../../images/questions/test-name/Image.png",  // optional
  audio: "../../data/sound/questions/test-name/audio.mp3"  // optional
}
```

### Changing Test Duration & Passing Score
Edit these properties in `tests/{test-name}/{test-name}-data.js`:
```javascript
const testData = {
  title: "Test Name",
  duration: 50,        // in minutes
  passingScore: 70,    // percentage needed to pass
  questions: [...]
}
```

### Updating UI/Styles
- **Global styles**: `data/css/main.css`
- **Control bar & test page styles**: `data/css/test.css`
- **Dark mode**: Controlled via JavaScript toggle (auto-persists to localStorage)

### Updating Core Features
- **Time display, dark mode, sound**: `data/js/main.js`
- **Test logic, navigation warnings, modals**: `data/js/test-manager.js`
- **Password protection**: Password stored in `test123` (edit in `PasswordProtection` class)

## 🏗️ Technical Architecture

### Why Static Site?

This platform is built as a **static website** (HTML/CSS/JavaScript only) rather than a traditional server-based application for several important reasons:

✅ **Maximum Accessibility**
- Works anywhere - no server installation needed
- Can be hosted on any web server (Apache, Nginx, GitHub Pages, etc.)
- Can run locally without internet connection
- Easy deployment to schools, training centers, workplaces

✅ **Cost-Effective**
- No backend servers required (no hosting fees)
- No database maintenance
- No API infrastructure needed
- Suitable for non-profit organizations and educational institutions

✅ **Fast & Reliable**
- No network latency for database queries
- Works offline after initial load
- No server downtime concerns
- Instant feedback on test submissions

✅ **Privacy-Focused**
- All test data stays on the user's device
- No personal information sent to external servers
- No tracking or user profiling
- Complete data privacy and compliance

✅ **Easy to Customize**
- Source code fully visible and modifiable
- No vendor lock-in
- Can adapt for specific regional needs
- Easy to add new tests and questions

### Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Markup** | HTML5 | Semantic, accessible content structure |
| **Styling** | CSS3 | Responsive design, dark mode, animations |
| **Logic** | Vanilla JavaScript (ES6+) | No dependencies, pure JavaScript |
| **Storage** | Browser localStorage | Session data, user preferences, progress |
| **Audio** | HTML5 `<audio>` | Native audio support for questions |
| **Deployment** | Static files only | Works on any web server |

### Browser Compatibility

Tested and working on:
- ✅ Chrome/Chromium (all versions)
- ✅ Firefox (all versions)
- ✅ Safari (iOS & macOS)
- ✅ Edge (all versions)
- ✅ Mobile browsers (Android Chrome, iOS Safari)

## ⚙️ Important Configuration

### Password Protection
- Default password: `test123`
- To change: Edit `PasswordProtection` class in `data/js/main.js`

### Test Categories & Colors
| Category | Color | CSS Class |
|----------|-------|-----------|
| Food Service | Blue `#1565c0` | `category-food` |
| Agriculture | Green `#388e3c` | `category-agriculture` |
| Nursing Care | Pink `#d81b60` | `category-nursing` |
| JFT Basic | Purple `#7b1fa2` | `category-jft` |
| Ground Handling | Teal `#00897b` | `category-ground-handling` |
| Building Cleaning | Red `#c62828` | `category-building-cleaning` |

### Audio Limits
- Users can play question audio **2 times maximum** per question
- Automatically resets when navigating to a new question

### Recent Updates (December 25, 2025)
✅ **Japanese Text Restored** - All JFT Basic tests (1-4) fixed for proper UTF-8 encoding (225 total questions)
✅ **Image Paths Updated** - Corrected paths after images migration to root level
✅ **Test Initialization Fixed** - Tests now load properly after password entry
✅ **Tracking Removed** - All visitor/attempt tracking disabled (CountAPI removed)
✅ **Password Modal Enhanced** - Added close button (×) and ESC key support

## Changelog

- **v1.0.2 — 2026-02-03**
  - Docs: Added contributors page at `data/contributors.html` and linked it from the site footer.
  - Chore: Bumped homepage footer version to `v1.0.2`.

- **v1.0.1 — 2026-02-03**
  - Fix: Corrected image option paths for Q54 and Q55 in `tests/jft-basic-1/jft-basic-1-data.js` (switched to existing `.jpg` filenames and fixed `ImageQ55C` naming).
  - Note: Data-only fix; no runtime behavior changes.

- **v1.0.0 — 2025-12-25**
  - Initial public release: UTF-8 fixes, image path updates, test initialization fixes, tracking removal, password modal enhancements.


## �️ Data Protection & Backup System

**Backup System Status:** ✅ **ACTIVE**

A comprehensive backup system has been implemented to protect against character encoding corruption (Japanese, Nepali characters displaying as "?????"):

### Backup Location
- **Path:** `backup/` folder at project root
- **Files:** 12 UTF-8 BOM encoded backup files, one per test
- **Coverage:** 394+ questions from all tests (JFT Basic, Nursing Care, Agriculture, Food Service, Building Cleaning, Ground Handling)

### Backup Files
Each backup file contains complete question data in plain text format:
- Question text (Japanese/Nepali/English)
- All options (A, B, C, D)
- Correct answer key
- Image and audio file paths
- Test metadata (duration, passing score, question count)

### Backup Documentation
Complete documentation in `backup/` folder:
- **00_START_HERE.txt** - Quick reference guide
- **BACKUP_README.md** - Master documentation with format specifications
- **RESTORATION_GUIDE.txt** - Technical restoration procedures for AI automation
- **BACKUP_INVENTORY.txt** - Complete inventory mapping backup files to tests
- **CREATION_SUMMARY.txt** - Implementation summary

### Restoration Process
If test questions become corrupted:
1. **Manual restoration:** Use `backup/{test-name}-backup.txt` and manually update `tests/{test-name}/{test-name}-data.js`
2. **Automated restoration:** Refer to restoration procedures in `backup/RESTORATION_GUIDE.txt` for AI-assisted restoration scripts

### Character Encoding Note
All backup files use **UTF-8 with BOM encoding** to properly preserve:
- Japanese: Hiragana (ひらがな), Katakana (カタカナ), Kanji (漢字)
- Nepali: Devanagari script (देवनागरी)
- English: ASCII characters

This ensures compatibility when importing backup data into JavaScript data files.

## 📊 Project Status

**Status:** ✅ **ACTIVE & FUNCTIONAL**
- **12 test categories** fully operational
- **Mobile verified** - Responsive design tested on various devices
- **All 225+ questions** displaying correctly with proper Japanese encoding
- **All features working** - Audio, images, dark mode, navigation warnings, password protection
- **Backup system active** - All 394+ questions protected in `backup/` folder

**Last Updated:** December 25, 2025 | **Backup System Added:** January 7, 2026

## ⚠️ Known Issues & Limitations

| Issue | Workaround | Priority |
|-------|-----------|----------|
| Audio files not preloaded | Audio plays on demand but may have slight delay on first play | Low |
| Password hardcoded in JS | Change `test123` in PasswordProtection class before production | Medium |
| No persistent score storage | Results are lost on page refresh (by design for privacy) | Low |
| CountAPI tracking disabled | No analytics available (privacy feature) | N/A |

**Note:** All critical bugs have been fixed. Minor limitations are by design for privacy and simplicity.

## 🚀 Future Plans & Ideas

- [ ] **Question import UI** - Web interface to add questions without editing JS
- [ ] **Multi-language support** - English, Nepali, other language interfaces
- [ ] **Score history** - Optional localStorage-based score tracking
- [ ] **Timer customization** - Admin panel to adjust test duration per category
- [ ] **Analytics** - Optional privacy-respecting analytics (with user consent)
- [ ] **Certificate generation** - PDF certificates for passing scores
- [ ] **Responsive improvements** - Enhanced tablet experience
- [ ] **Dark mode auto-detect** - Respect system preference (OS dark mode)

## 🔍 Quick Links - Frequently Edited Files

| Task | File | Line(s) |
|------|------|---------|
| **Change password** | `data/js/main.js` | ~477 (CORRECT_PASSWORD) |
| **Edit test questions** | `tests/{test-name}/{test-name}-data.js` | Modify `questions` array |
| **Change test duration** | `tests/{test-name}/{test-name}-data.js` | `duration` property |
| **Change test title** | `tests/{test-name}/{test-name}-data.js` | `title` property |
| **Update UI colors** | `data/css/main.css` | CSS variables section |
| **Dark mode colors** | `data/css/main.css` | `.dark-mode` section |
| **Control bar styling** | `data/css/test.css` | `.control-bar*` classes |
| **Navigation warnings** | `data/js/test-manager.js` | `showNavigationWarning()` |
| **Category card colors** | `index.html` | Inline styles for `.category-*` classes |
| **Home page instructions** | `index.html` | Lines 305-343 |

## 🐛 Debugging Tips

### "Test won't start after password entry"
- **Check:** Browser console for errors (F12 → Console)
- **Check:** `window.testData` is loaded (should see test title in console)
- **Check:** `window.MockTest` class exists
- **Fix:** See `data/js/main.js` - `PasswordProtection.unlockContent()` method

### "Images not showing"
- **Check:** Image file exists in `images/questions/{category}/`
- **Check:** Path in `*-data.js` is correct (relative paths: `../../images/questions/...`)
- **Fix:** Use `scripts/utilities/verify-paths.js` to check all image paths

### "Audio not playing"
- **Check:** Audio file exists in `data/sound/questions/{category}/`
- **Check:** Browser console for CORS or 404 errors
- **Check:** Sound toggle is enabled (check control bar button)
- **Fix:** Run `python -m http.server 8000` instead of opening file directly (CORS issue)

### "Japanese text shows as ?????"
- **Check:** Question file encoding is UTF-8
- **Check:** Server is running (not opening HTML directly)
- **Regenerate:** Run `scripts/import-questions.ps1` with UTF-8 source files
- **Backup:** Check `.bak` files in `tests/jft-basic-*` for previous versions

### "Test not appearing in home page"
- **Check:** HTML file exists in `tests/{test-name}/index.html`
- **Check:** Data file exists as `tests/{test-name}/{test-name}-data.js`
- **Check:** Link in `index.html` points to correct path
- **Restart:** Refresh homepage (Ctrl+F5 for hard refresh)

### "Password not working"
- **Check:** Password is `test123` (case-sensitive)
- **Check:** Check console for JS errors preventing validation
- **Change:** Edit `CORRECT_PASSWORD` in `data/js/main.js` line ~477

## 📚 Quick Reference - File Purposes

**Entry Points:**
- `index.html` - Home page with test selection
- `tests/*/index.html` - Individual test pages

**Core Logic:**
- `data/js/main.js` - UI features, controls, password, dropdowns
- `data/js/test-manager.js` - Test logic, scoring, navigation warnings

**Styling:**
- `data/css/main.css` - Global styles, variables, dark mode
- `data/css/test.css` - Test-specific styles, control bar

**Question Data:**
- `tests/*/\*-data.js` - Question arrays (edit these to change questions)

**Scripts:**
- `scripts/import-questions.ps1` - Auto-import from source files
- `scripts/utilities/` - Path fixing and verification tools

## 📂 Project Structure Overview

### Root-Level Files
- **README.md** - Main project overview and quick start guide (this file)
- **index.html** - Home page with test category selection
- **Full Folder Structure.txt** - Complete directory tree

### Core Directories

| Directory | Purpose |
|-----------|---------|
| `tests/` | 12 test categories (JFT Basic 1-4, Nursing Care Japanese/Nepali 1-2, Food Service, Agriculture, Ground Handling, Building Cleaning) with HTML pages and question data |
| `data/` | Shared resources - CSS (`css/`), JavaScript (`js/`), audio files (`sound/`), and test images |
| `images/questions/` | Question images organized by test category |
| `project-metadata/` | Machine-readable metadata (package.json, project-metadata.json), configuration, and parsing instructions |
| `scripts/` | PowerShell scripts for importing and managing questions |
| `sources/` | Source question files (raw text data for import) |
| `docs/` | **Comprehensive documentation** (see table below) |
| `apk/` | Android APK distribution files |

### 📚 Documentation Files (in `docs/` folder)

| Document | Purpose | Read When... |
|----------|---------|--------------|
| **DEVELOPMENT.md** | Detailed development setup, workflow, recent fixes, and implementation notes | You need to understand the full development process or troubleshoot issues |
| **CHANGELOG.md** | Version history and release notes | You want to see what changed between versions |
| **CONTRIBUTING.md** | Guidelines for contributing to the project | You want to contribute code or improvements |
| **SESSION_CHANGES.md** | Summary of recent session changes and modifications | You want to know what was changed in recent work |
| **SESSION_CHANGES_LOG.md** | Extremely detailed log of control bar implementation, tracking removal, and all UI changes | You need deep technical details of specific features |
| **TEMPLATE_DOCUMENTATION.md** | Template and guidelines for writing documentation | You're adding new features and need to document them |
| **MOBILE_VERIFICATION_SUMMARY.md** | Mobile device compatibility and testing results | You're testing on mobile or need to know device support |
| **MOBILE_VIEW_TESTING_REPORT.md** | Detailed mobile UI/UX testing report with screenshots | You're optimizing for mobile or debugging mobile issues |
| **DOCUMENTATION_UPDATE_SUMMARY.md** | Summary of documentation updates made | You want to see what documentation was changed |
| **DOCUMENTATION_VERIFICATION_2025-12-25.md** | Verification checklist for documentation structure | You need to verify project documentation is complete |
| **IMAGES_MIGRATION_VERIFICATION.md** | Details on image folder migration and path verification | You're troubleshooting image loading issues |
| **RESCAN_SUMMARY_2025-12-25.md** | Summary of project rescan and validation | You need to verify all files and paths are correct |

### Key Scripts (in `scripts/` folder)

| Script | Purpose |
|--------|---------|
| `import-questions.ps1` | PowerShell script to import questions from source `.txt` files into test data `.js` files |
| `debug-parse.ps1` | Debug script for parsing question files |
| `update-audio-questions.ps1` | PowerShell script to update audio paths in question data |
| `generate_test_files.ps1` | Generate test HTML and data files (in `scripts/`) |

### Utility Scripts (in `scripts/utilities/` folder)

| Script | Purpose |
|--------|---------|
| `fix_paths.py` | Python script to fix broken paths in test data |
| `fix-all-paths.js` | JavaScript to fix all paths at once |
| `fix-audio-paths.js` | JavaScript to fix audio file paths |
| `fix-image-paths.js` | JavaScript to fix image file paths |
| `verify-paths.js` | JavaScript to verify all paths are correct |

### Key Code Files

| File | Purpose |
|------|---------|
| `data/js/main.js` | Core functionality: time display, dark mode, sound control, dropdowns, navigation |
| `data/js/test-manager.js` | Test logic: navigation warnings, modal handling, test flow |
| `tests/*/index.html` | Individual test page templates |
| `tests/*/*-data.js` | Question data for each test |
| `data/css/main.css` | Global styles and CSS variables |
| `data/css/test.css` | Test-page-specific styles and control bar |

### Data Structure

**Question Object Format:**
```javascript
{
  text: "Question text in Japanese",
  options: ["Option 1", "Option 2", "Option 3"],
  correctAnswer: 0,           // Index of correct option
  image: "path/to/image.png", // Optional
  audio: "path/to/audio.mp3"  // Optional
}
```

## 🔍 For Different Users

### Starting Development
1. Read **README.md** (this file) for overview
2. Check `docs/DEVELOPMENT.md` for setup
3. Edit question data in `tests/*-data.js` files

### Understanding Changes
- See `docs/SESSION_CHANGES_LOG.md` for detailed control bar implementation
- See `docs/SESSION_CHANGES.md` for recent modifications

### Mobile/Testing
- See `docs/MOBILE_VERIFICATION_SUMMARY.md` for mobile compatibility
- See `docs/MOBILE_VIEW_TESTING_REPORT.md` for testing results

### For AI/Tools
- See `project-metadata/project-metadata.json` for machine-readable summary
- See `docs/DOCUMENTATION_VERIFICATION_2025-12-25.md` for structure verification

## Contact / Author
- Repository owner: `mhzsajan`

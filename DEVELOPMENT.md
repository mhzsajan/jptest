# Development Guide

This doc helps maintainers and developers understand the local workflow and common tasks.

Repository layout (high level)
- `tests/` — per-test folders containing `index.html` and the test's `*-data.js` file.
- `data/` — shared CSS, JS, and other assets used by test pages (`data/js/`, `data/css/`).
- `images/` — icons and question images (migrated to root level in recent session).
- `js/` — application JavaScript (if present separately from `data/js`).

## Recent Fixes (December 25, 2025)

### Japanese Text Restoration
All 4 JFT Basic test files had corrupted Japanese text showing as `?????`. Fixed by:
1. Re-running the PowerShell import script (`scripts/import-questions.ps1`) with original UTF-8 source files
2. Regenerated test data with proper encoding: 55 + 55 + 55 + 60 = 225 total questions
3. Verified all Japanese characters now display correctly in browser

**Affected Files:**
- `tests/jft-basic-1/jft-basic-1-data.js` (55 questions)
- `tests/jft-basic-2/jft-basic-2-data.js` (55 questions)
- `tests/jft-basic-3/jft-basic-3-data.js` (55 questions)
- `tests/jft-basic-4/jft-basic-4-data.js` (60 questions)

### Image Path Corrections
After images folder migration to root level, image paths in test data files needed updating:
- **Old format:** `../../data/images/questions/jft-basic-1/Image Q1.jpg`
- **New format:** `../../images/questions/jft basic test 1/Image Q1.png`

**Changes Applied:**
1. Removed `data/` from all image paths
2. Updated folder names: `jft-basic-X` → `jft basic test X` (with spaces)
3. Changed file extensions: `.jpg` → `.png`
4. Applied to both main question images and option images

**Example Before/After:**
```javascript
// Before (broken)
image: '../../data/images/questions/jft-basic-1/Image Q1.jpg',

// After (fixed)
image: '../../images/questions/jft basic test 1/Image Q1.png',
```

### Test Initialization Fix
Tests were stuck on loading screen after correct password entry. Fixed by:
1. Added test initialization logic to `PasswordProtection.unlockContent()` method in `data/js/main.js`
2. Now creates MockTest instance after modal closes
3. Added validation checks for window.testData and window.MockTest availability

**Code Change:**
```javascript
unlockContent() {
  const modal = document.getElementById('passwordModal');
  modal.style.transition = 'opacity 0.3s ease-out';
  modal.style.opacity = '0';
  
  setTimeout(() => {
    modal.classList.add('hidden');
    
    // NEW: Initialize test if data is available
    if (window.testData && window.MockTest) {
      console.log('Initializing test with data:', window.testData.title);
      window.mockTestInstance = new window.MockTest(window.testData);
    } else {
      console.error('Test data or MockTest class not available');
    }
  }, 300);
}
```

---

## Password Modal Close & ESC Key Handler

### Overview
Password-protected test pages now have improved UX with:
- Close button (×) in top-right corner of password modal
- ESC key support to close modal
- Both redirect to home page with fade animation

### Files Involved
- All 12 `tests/*/index.html` files - Close button HTML
- `data/js/main.js` - ESC key handler and close logic
- `data/css/main.css` - Close button styling

### Implementation Details

#### HTML Structure (all test pages)
```html
<div id="passwordModal" class="password-modal">
  <div class="password-modal-content">
    <!-- NEW: Close button -->
    <button id="passwordModalCloseBtn" class="password-modal-close" aria-label="Close">&times;</button>
    
    <!-- Existing modal content -->
    <div class="password-modal-header">
      ...
    </div>
    ...
  </div>
</div>
```

#### JavaScript (data/js/main.js, PasswordProtection module)

**In `init()` method:**
```javascript
// Get close button reference
const closeBtn = document.getElementById('passwordModalCloseBtn');

// ESC key handler
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.style.display === 'flex') {
    this.closeModal(modal);
  }
});

// Close button click handler
if (closeBtn) {
  closeBtn.addEventListener('click', () => {
    this.closeModal(modal);
  });
}
```

**New `closeModal()` method:**
```javascript
closeModal(modal) {
  // Fade out the modal
  modal.style.transition = 'opacity 0.3s ease-out';
  modal.style.opacity = '0';
  
  // Redirect to home after animation
  setTimeout(() => {
    window.location.href = '../../index.html';
  }, 300);
}
```

#### CSS Styling (data/css/main.css)
```css
.password-modal-content {
  position: relative;  /* For absolute positioning of button */
}

.password-modal-close {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 28px;
  color: var(--on-surface);
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: var(--transition);
  opacity: 0.7;
}

.password-modal-close:hover {
  background-color: rgba(0, 0, 0, 0.1);
  opacity: 1;
}

.dark-mode .password-modal-close:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
```

### User Experience
1. User sees password modal
2. Can close by:
   - Pressing ESC key (redirects to home)
   - Clicking × button (redirects to home)
   - Entering correct password (unlocks test)
3. Both close methods show fade-out animation (0.3s)

---

## Audio Player with Play Limit Indicator

### Overview
Audio questions now display a clear indicator showing "Can be played **twice only**!" next to the play button.

### Files Involved
- `data/js/test-manager.js` - `displayAudioPlayer()` method
- `data/css/test.css` - Audio player styling

### Implementation Details

#### JavaScript (data/js/test-manager.js, displayAudioPlayer method)
```javascript
displayAudioPlayer(question) {
  // ... existing play count logic ...
  
  audioContainer.innerHTML = `
    <div class="audio-player">
      <button class="audio-btn" id="playAudioBtn" ${!canPlay ? 'disabled' : ''}>
        <span class="material-icons">play_arrow</span>
        <span id="audioButtonText">${!canPlay ? 'Audio Played (Twice)' : 'Play Audio'}</span>
      </button>
      <!-- NEW: Play limit indicator -->
      <span class="audio-play-limit">
        <span class="material-icons">info</span>
        <span class="audio-limit-text">Can be played <strong>twice only</strong>!</span>
      </span>
      <audio id="questionAudio" style="display: none;">
        <source src="${question.audio}" type="audio/mpeg">
        Your browser does not support the audio element.
      </audio>
    </div>
  `;
}
```

#### CSS Styling (data/css/test.css)
```css
.audio-player {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  margin: 1rem 0;
  background: var(--background);
  border-radius: 8px;
  padding: 1rem;
}

.audio-play-limit {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  color: var(--on-surface);
  opacity: 0.85;
}

.audio-play-limit .material-icons {
  font-size: 18px;
  color: var(--info);  /* Blue info color */
  flex-shrink: 0;
}

.audio-limit-text strong {
  color: var(--primary);  /* Primary color for emphasis */
  font-weight: 600;
}
```

### Visual Components
1. **Play Button**: Blue button with play icon
2. **Info Icon**: Blue information icon (ℹ)
3. **Limit Text**: "Can be played **twice only**!" with bold emphasis on "twice only"
4. **Layout**: Flexbox horizontal layout for responsive design

### Features
- Responsive: Works on all device sizes
- Accessible: Info icon clearly indicates the restriction
- Dynamic: Message only appears for audio questions
- Persistent: Visible every time audio question is displayed

---

## Category Card Left Border Styling

### Overview
Test category cards on the homepage now display colored left borders matching their category themes, creating visual consistency with the instruction box styling.

### Files Involved
- `index.html` - Inline CSS styles for category cards

### Color Mapping
| Category | Color | Hex Code |
|----------|-------|----------|
| Food Service | Blue | #1565c0 |
| Agriculture | Green | #388e3c |
| Nursing Care | Pink/Magenta | #d81b60 |
| JFT Basic | Purple | #7b1fa2 |
| Ground Handling | Teal | #00897b |
| Building Cleaning | Red | #c62828 |

### Implementation

#### CSS Classes (index.html inline styles)
```css
.category-card.category-food {
  border-left: 6px solid #1565c0 !important;
}

.category-card.category-agriculture {
  border-left: 6px solid #388e3c !important;
}

.category-card.category-nursing {
  border-left: 6px solid #d81b60 !important;
}

.category-card.category-jft {
  border-left: 6px solid #7b1fa2 !important;
}

.category-card.category-ground-handling {
  border-left: 6px solid #00897b !important;
}

.category-card.category-building-cleaning {
  border-left: 6px solid #c62828 !important;
}
```

### Design Pattern
- **6px left border**: Matches instruction box style (5px red border becomes 6px colored)
- **Full-height border**: Extends entire height of card
- **Category matching**: Each color represents the category's theme
- **Visual hierarchy**: Creates clear distinction between test categories

---

## Image Zoom & Pan System

### Overview
Interactive image viewer with zoom, pan, and multi-platform support for both question and answer images.

**Features:**
- Click images to open in modal (16:9 aspect ratio, max 90vw/90vh)
- Zoom In/Out/Reset buttons (50% - 300% range, 25% increments)
- Mouse wheel zoom (scroll up/down to zoom)
- Pan/drag on zoomed images (mouse drag on PC, touch swipe on mobile)
- Horizontal and vertical scrollbars when zoomed
- Auto-reset zoom when opening new image
- Multiple close methods (Escape key, close button, overlay click)

### Files Involved
- `data/js/test-manager.js` - `showQuickView()` method, zoom/pan logic
- `data/css/test.css` - Modal styling, scrollbar customization
- All `tests/*/index.html` files - Modal HTML structure (12 test pages)

### Key Functions

#### showQuickView() in test-manager.js
Main method handling image display, zoom, and pan:

```javascript
showQuickView(imageSrc) {
  // 1. Get all modal elements (overlay, image, buttons, display)
  // 2. Initialize zoom level to 100%
  // 3. Reset image transform before loading new image
  // 4. Set image source and show overlay
  
  // 5. Define zoom functions:
  // - zoomIn(): Increase zoom by 25% (max 300%)
  // - zoomOut(): Decrease zoom by 25% (min 50%)
  // - zoomReset(): Reset to 100%
  // - updateZoomDisplay(): Update % display and apply CSS transform
  
  // 6. Define pan functions:
  // - startPan(): Initialize pan state on mouse/touch down
  // - movePan(): Update scroll position based on drag distance
  // - endPan(): Cleanup pan state
  
  // 7. Define close handlers:
  // - closeHandler(): Remove all listeners, hide modal
  // - escapeHandler(): Close on Escape key
  // - overlayClickHandler(): Close on outside click
  
  // 8. Setup event listeners:
  // - Zoom buttons (click)
  // - Mouse wheel (scroll for zoom)
  // - Mouse drag (pan)
  // - Touch drag (pan)
  // - Keyboard (Escape)
  // - Overlay click (close)
}
```

**Zoom Logic:**
- MIN_ZOOM = 50%, MAX_ZOOM = 300%, ZOOM_STEP = 25%
- Applied via CSS transform: `scale(zoomLevel / 100)`
- Smooth 0.2s transition for zoom animation

**Pan Logic:**
- Only activates when zoom > 100% (prevents accidental pan at normal size)
- Calculates scroll delta based on cursor/touch movement
- Updates imageWrapper scrollLeft/scrollTop
- Works with both mouse and touch events

**Event Cleanup:**
- All listeners properly removed on close
- Prevents memory leaks from multiple image views
- Handlers re-created fresh for each image open

#### displayOptions() in test-manager.js
Enhanced to support clickable images in answer options:

```javascript
displayOptions(options) {
  // ... render options ...
  
  // NEW: Find and make images clickable
  const optionImages = optionElement.querySelectorAll('img');
  optionImages.forEach(img => {
    img.classList.add('question-image');
    img.style.cursor = 'pointer';
    img.addEventListener('click', (e) => {
      e.stopPropagation();  // Prevent option selection
      this.showQuickView(img.src);  // Open image in modal
    });
  });
}
```

**Key Points:**
- `e.stopPropagation()` prevents option selection when clicking image
- Images get `question-image` class for styling
- Works for both question images and answer option images

### CSS Classes

**Modal Structure:**
```css
.image-quickview-overlay { }          /* Full-screen backdrop */
.quickview-container { }              /* Modal box (16:9 ratio) */
.quickview-content { }                /* Image container */
.quickview-image-wrapper { }          /* Scrollable wrapper */
.quickview-image { }                  /* The image itself */
.quickview-controls { }               /* Zoom button container */
.quickview-control-btn { }            /* Individual zoom button */
.quickview-zoom-level { }             /* Zoom % display */
.quickview-close { }                  /* Close (×) button */
```

**Image Styling:**
```css
.question-image {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.question-image:hover {
  transform: scale(1.03);
  box-shadow: 0 6px 20px rgba(66, 133, 244, 0.3);
  filter: brightness(1.05);
}
```

### Scrollbar Customization

Visible scrollbars for zoomed images:

```css
.quickview-image-wrapper::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

.quickview-image-wrapper::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 6px;
}

.quickview-image-wrapper::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
```

### Mobile Considerations

**Touch Support:**
- Touch events mapped to same handlers as mouse
- `e.touches[0]` extracts first touch point
- `{ passive: false }` allows preventDefault() on touch events
- Swipe detected via touch move delta

**CSS for Touch:**
- `touch-action: manipulation` for smooth scrolling
- `user-select: none` prevents text selection during drag
- Cursor states work on touch-capable devices

### Testing Image Zoom

1. **Question Images:**
   - Click on any question image
   - Verify modal opens with zoom controls
   - Test zoom in/out/reset buttons
   - Test mouse wheel zoom
   - Test mouse drag when zoomed

2. **Answer Images:**
   - Click image in answer option
   - Verify modal opens (same as question)
   - Verify option isn't selected (no highlight)
   - Test pan/drag functionality

3. **Mobile Testing:**
   - Open on mobile device or emulator
   - Pinch to zoom (simulated by button taps)
   - Swipe to pan
   - Touch and drag scrollbars

## Control Bar System

### Overview
The control bar is a fixed bottom element visible on all pages (test pages and home). It provides:
- **Time Display**: Day name + 24-hour format time, updates every second
- **Dark Mode Toggle**: Switches theme globally, persists in localStorage
- **Sound Toggle**: Controls audio playback for questions, persists in localStorage
- **Navigation Buttons**: Home (test pages), Go-to-Top (home page)
- **Warning System**: Modal popups for all test exit actions

### Files Involved
- `data/js/main.js` - Time display, go-to-top functionality, app download handler
- `data/js/test-manager.js` - Warning modal system, refresh/back/home prevention
- `data/css/test.css` - Control bar styling, responsive layout
- `data/css/main.css` - Global styles, footer compact layout
- `index.html` - Home page control bar with go-to-top button
- All `tests/*/index.html` files - Test pages with home button in control bar

### Key Functions

#### Time Display (`updateBarTime()` in main.js)
```javascript
function updateBarTime() {
  const barTimeBottom = document.getElementById('barTimeBottom');
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false  // 24-hour format
  });
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
  if (barTimeBottom) barTimeBottom.textContent = `${dayName} ${timeString}`;
}
```
- Called on page load and every 1 second via `setInterval`
- Format: "Thursday 14:30:45"

#### Warning Modal System (`showNavigationWarning()` in test-manager.js)
- Types: 'refresh', 'back', 'home'
- Shows custom modal with two buttons: "Continue Test" and "Leave Test"
- Prevents browser's default warning popup
- Triggered by:
  - F5, Ctrl+R, Cmd+R, browser refresh button (refresh type)
  - Back button press (back type)
  - Home button click, header click (home type)

#### Go to Top (home page only)
```javascript
const goToTopBtn = document.getElementById('goToTopBtn');
if (goToTopBtn) {
  goToTopBtn.addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
```

### Styling

**Control Bar Layout:**
```css
.control-bar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.bar-time-display { flex: 0 0 auto; }  /* Left side, fixed width */
.bar-home-center { position: absolute; left: 50%; transform: translateX(-50%); }
.bar-controls-right { flex: 0 0 auto; }  /* Right side, fixed width */
```

**Responsive Breakpoints:**
- Desktop: 44px buttons, full padding
- 768px: 40px buttons, reduced padding
- 480px: 36px buttons, minimal padding

### Customization

**Change Button Colors:**
Edit `data/css/main.css`:
```css
:root {
  --primary: #1976d2;  /* Button color */
  --on-primary: #ffffff;  /* Text on button */
}
```

**Change Warning Messages:**
Edit `showNavigationWarning()` in `data/js/test-manager.js`:
```javascript
if (type === 'refresh') {
  title = '⏱️ Hold On!';
  message = 'Your custom message here';
}
```

**Update Download Link URLs:**
Edit `data/js/main.js`:
```javascript
const apkUrl = 'https://your-apk-url.com/app.apk';
const playStoreUrl = 'https://play.google.com/store/apps/details?id=your.package.id';
```

**Adjust Control Bar Spacing:**
Edit `data/css/test.css`:
```css
.control-bar-content {
  padding: 0.4rem 1rem;  /* Vertical horizontal */
  gap: 0.8rem;  /* Gap between items */
}
```

**Adjust Footer:**
Edit `data/css/main.css`:
```css
.footer {
  padding: 0.8rem 0;
  margin-top: 1.5rem;
}
```

Common developer tasks
- Preview a test:

```powershell
python -m http.server 8000
# open http://localhost:8000/tests/jft-basic-4/index.html
```

- Add a new test:
  1. Create a folder under `tests/` (e.g., `tests/my-test/`).
  2. Add `index.html` (copy an existing one as a starter).
  3. Add a `my-test-data.js` file in the same folder and point to any images.

- Update questions:
  - Edit the test's `*-data.js` file. Keep the data structure consistent with existing tests.

Notes about paths
- Many test pages use relative fixed paths to `../../data/js/` and `../../data/css/`. When adding or moving files, update those relative imports accordingly.

Optional scripts
- You can add `scripts/run-tests.ps1` to automate starting a server and opening a browser.

Machine / AI notes
- The project provides `project-metadata/project-metadata.json` which contains quick run instructions and flags (e.g., tracking disabled). Tools should read that first.
- See `SESSION_CHANGES_LOG.md` for complete documentation of control bar implementation, including HTML structures, CSS properties, and JavaScript functions.

Image conventions and importing questions
- Plaintext question sources (found at repo root, e.g. `agriculture questions.txt` or `Nursing Care Nepali Test 1.txt`) use markers like `Image Q1A`. When converting to JS `questions` arrays, map `Image Q1A` → `../../images/questions/<test-folder>/Q1A.jpg` (preserve case/extension). Validate that the image file exists.
- There is a helpful importer script at `scripts/import-questions.ps1` which:
  - Parses plaintext question files into `tests/<folder>/*-data.js`.
  - Supports `-DryRun` to validate parsing without writing files and `-AutoImageExt` to probe common extensions.
  - Creates a `.bak` backup of the existing `*-data.js` before overwriting.
  - Normalizes the JS variable name to camelCase and sets `window.testData = <thatVariable>`.
  - Appends a small `DOMContentLoaded` init block to the generated `*-data.js` which unhides the test UI and instantiates `MockTest`.

Example (PowerShell):
```powershell
cd "g:\VS Code Japan Test"
powershell -ExecutionPolicy Bypass -File .\scripts\import-questions.ps1 -SourceFile "Nursing Care Nepali Test 1.txt" -TestFolder "tests/nursing-care-nepali-1" -AutoImageExt -DryRun
```

Backups and safety
- Before making large edits to `tests/*-data.js`, create a backup copy (e.g., `*-data.js.bak`) in the same folder. The importer will create one automatically when overwriting.
- If regenerating `*-data.js`, ensure the data file ends with the init block that sets `window.testData` and instantiates `MockTest`, or the page will remain stuck on a loading screen.

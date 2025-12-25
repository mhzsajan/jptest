# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed (December 25, 2025 - Japanese Text & Test Initialization)
- **Restored Japanese Text Encoding**
  - Re-imported all 4 JFT Basic test questions from original UTF-8 source files (JFT Basic Test 1-4.txt)
  - Fixed corrupted Japanese characters displaying as `?????`
  - Verified proper encoding in all test data files (jft-basic-1/2/3/4-data.js)
  - Total questions restored: 55 + 55 + 55 + 60 = 225 questions with correct Japanese text

- **Fixed Image Paths After Migration**
  - Updated all image paths from `../../data/images/questions/jft-basic-X/` to `../../images/questions/jft basic test X/`
  - Fixed folder names: Changed from hyphens (jft-basic-1) to spaces (jft basic test 1) in image paths
  - Updated file extensions from `.jpg` to `.png` to match actual image files
  - Applied fixes to both question images and option images in all 4 JFT tests
  - Images now load correctly on test pages

- **Fixed Test Initialization After Password Entry**
  - Added test data initialization in `PasswordProtection.unlockContent()` method
  - Tests now properly create MockTest instance after password is entered
  - Resolves loading screen issue where tests would be stuck after password unlock
  - Added console logging for debugging test initialization

### Added (December 25, 2025 - UI Enhancements & Tracking Removal)
- **Audio Play Limit Indicator**
  - Added visual indicator text: "ℹ Can be played **twice only**!" next to audio player button.
  - Info icon in blue (--info color) for better visibility.
  - Clear, bold styling for the "twice only" text in primary color.
  - Helps students understand audio playback restrictions before playing.

- **Category Card Left Border Styling**
  - Added 6px colored left borders to all test category cards on homepage.
  - Colors match category themes:
    - Food Service: Blue (#1565c0)
    - Agriculture: Green (#388e3c)
    - Nursing Care: Pink/Magenta (#d81b60)
    - JFT Basic: Purple (#7b1fa2)
    - Ground Handling: Teal (#00897b)
    - Building Cleaning: Red (#c62828)
  - Provides visual consistency with instruction box styling.
  - Enhanced UI hierarchy and category differentiation.

- **Password Modal Close Functionality**
  - Added close button (×) in top-right corner of password modal.
  - Added ESC key handler to close modal and redirect to home page.
  - Smooth fade-out animation (0.3s) when closing.
  - Implemented on all 12 test pages.
  - Provides better UX for users wanting to exit without password.

### Removed (December 25, 2025 - Privacy & Tracking)
- **Removed Visitor Tracking System**
  - Removed `window.Tracking` object from `data/js/main.js`.
  - Removed CountAPI visitor tracking calls.
  - Removed localStorage-based visitor deduplication.
  - Removed automatic visitor counter increment on test page visits.
  - Eliminated site-wide visitor counter tracking.

- **Removed Qualified Attempt Tracking**
  - Removed attempt qualification logic from `submitTest()` method.
  - Removed qualification checks (10+ minutes, 15+ answered questions).
  - Removed CountAPI attempt tracking calls.
  - Removed attempt counter increment on test submission.
  - Eliminated site-wide qualified attempts counter.

### Added (December 25, 2025 - Image Zoom & Pan Feature)
- **Image Quickview Modal**
  - Added interactive image viewer dialog for question and answer images.
  - Modal available on all 12 test pages with consistent styling and functionality.
  - Dark semi-transparent overlay (rgba 0.9) with centered image display.
  - 16:9 aspect ratio modal (max 90vw/90vh, min 400px x 350px) for optimal viewing.
  - Smooth scale animation (0.7 → 1.0) when modal opens.
  - White background in content area for clear image visibility.

- **Zoom Functionality**
  - **Zoom Controls**: Three-button interface with Zoom In, Zoom Out, and Reset buttons.
  - **Zoom Range**: 50% to 300% with 25% increment per button click.
  - **Zoom Display**: Real-time percentage display (e.g., "100%", "125%", "200%").
  - **Mouse Wheel Zoom**: Scroll up/down on image to zoom in/out (works on PC).
  - **Touch Pinch Zoom**: Support for pinch-to-zoom on mobile devices via scroll simulation.
  - **Auto-Reset**: Zoom level resets to 100% when opening a new image.
  - **Smooth Transitions**: CSS transitions (0.2s ease) for smooth zoom scaling.

- **Pan/Drag Controls**
  - **Mouse Drag**: Click and drag zoomed image on PC to pan (navigate) around image.
  - **Touch Swipe**: Swipe on zoomed image on mobile to pan around.
  - **Smart Activation**: Pan only works when image is zoomed (>100%), preventing interference at 100% zoom.
  - **Cursor Feedback**: Cursor changes to "grab" (hoverable), "grabbing" (while dragging).
  - **Scroll Support**: Horizontal and vertical scrollbars visible and functional when zoomed.
  - **Scrollbar Styling**: Semi-transparent scrollbars with hover effects (webkit-scrollbar compatible).

- **Clickable Images**
  - **Question Images**: Main question images are clickable to open in quickview modal.
  - **Answer Images**: Images within answer options are also clickable for zoom/pan viewing.
  - **Hover Effects**: Images show hover states (scale 1.03, shadow, brightness 1.05).
  - **Click Prevention**: Answer image clicks don't trigger option selection; only open modal.
  - **Visual Feedback**: Rounded corners (8px), pointer cursor, smooth transitions on all image types.

- **Modal Close Options**
  - **Close Button (×)**: Large close button positioned above modal with scale/rotate hover effects.
  - **Escape Key**: Press Escape to close modal from anywhere.
  - **Overlay Click**: Click outside image (on dark overlay) to close modal.
  - **Auto Cleanup**: All event listeners properly removed when modal closes.
  - **Zoom Reset**: Zoom level and transform automatically reset when closing/opening new image.

- **Responsive Design**
  - Works seamlessly on desktop (mouse + wheel) and mobile (touch + swipe).
  - Aspect ratio adapts to content (16:9 format).
  - Touch actions optimized for smooth mobile experience.
  - Padding and sizing responsive to viewport.

### Added (December 25, 2025 - Password Protection Session)
- **Password Protection System**
  - Added password-protected access to all test pages for security and controlled access.
  - Beautiful modal popup with lock icon appears when accessing any test.
  - Default password: `skillpoint123` (easily customizable in `data/js/main.js`).
  - Password required on every page load and refresh (no session persistence).
  - Smooth fade-out animation when correct password is entered.
  - Error message with helpful contact information when incorrect password is entered.
  
- **Password Modal UI**
  - Centered lock icon (🔒) at top of modal for visual attention.
  - Clear "Password Required" heading with instructions.
  - Secure password input field with focus management.
  - Unlock button with hover effects and active states.
  - "Go Back To Home" link for users without password access.
  - Contact message on error: "To acquire the password, please contact Skill Point Education Consultancy or Sajan Maharjan via WhatsApp"
  - Direct WhatsApp link in error message for easy contact.
  - Responsive design that works on all devices.
  - Works in both light and dark modes.
  
- **Footer Standardization**
  - Applied same footer to all test pages as homepage.
  - Footer includes creator credit and Android app download links (Google Drive + GitHub).
  - Made footer more compact with reduced spacing (padding 0.4rem, margin-top 0.8rem).
  - Condensed layout: Two short lines instead of multi-line format.
  - Consistent styling across entire project.

### Added (December 25, 2025 - Afternoon Session)
- **Audio Player Enhancement**
  - Increased audio play limit from 1 to 2 times per question.
  - Students can now replay audio once to help answer questions better.
  - Button text updates: "Play Audio" → "Audio Played" → "Audio Played (Twice)".
  - Uses numeric play counter instead of boolean tracking.

- **Footer Styling Improvements**
  - Added bold font weight (600) to footer text for better visual prominence.
  - Footer now stands out more and is easier to notice.

- **Download Link Enhancement**
  - Updated Android app download link with dual-server option for redundancy.
  - **Google Drive**: Direct link for quick downloads.
  - **GitHub Releases**: Professional release page with version information.
  - Links displayed as: "Download Android App: Google Drive | GitHub".
  - Both links open in new tab, styled with primary color and bold font.
  - Users can choose their preferred download source.

- **APK Distribution**
  - Added new `/apk` folder at project root.
  - Contains compiled `jptest 1.0.0.apk` for mobile distribution.

- **UI Polish**
  - Fixed header background color to match page body background.
  - Removed visual color discontinuity between header and content area.

### Added (December 25, 2025 - Initial Session)
- **Control Bar Redesign**
  - Added bottom fixed control bar on all pages (test pages and home) with time display, buttons, and navigation.
  - Time display shows current day name and 24-hour format time (e.g., "Thursday 14:30:45"), updates every second.
  - Centered home button on test pages with no movement animation on hover.
  - Dark mode and sound toggle buttons grouped together on right side of control bar.
  - Go-to-top button on home page only (center position) with smooth scroll animation.
  - Home button navigation shows warning modal before leaving test.
  
- **Navigation Warnings (December 25, 2025)**
  - Added consistent warning popup for all test exit actions: home button, header click, back button, and refresh.
  - Refresh warning now shows on F5, Ctrl+R, Cmd+R, and browser refresh button clicks.
  - Removed browser's default warning popups in favor of custom warning modal only.
  - Warning modal has two options: "Continue Test" and "Leave Test" with proper styling.

- **Download App Link**
  - Added "Download Android App" plain text link in footer below creator credits.
  - Link detects Android devices and opens Google Play Store; offers direct APK download on other devices.
  - Respects dark mode styling.

- **Mobile UI Improvements**
  - Made Start button fit content on mobile (inline-flex, shrink-to-fit with min-width).
  - Reduced and centered countdown timer on mobile view.
  - Made dark mode button mobile-friendly with responsive sizing.
  - Made navigation buttons (Previous, Skip, Next, Submit) responsive and stacked on mobile.
  - Made test start button mobile-friendly without overflow.
  - Hidden Submit button on mobile initially, then re-enabled it.
  - Hidden "Skip All & Submit" button on mobile view.

- **Navigation & UX**
  - Added modal confirmation dialog for Back button and Home button to warn users about losing test progress.
  - Changed Leave button behavior to navigate directly to home (`../../index.html`) without double-back issues.
  - Unified Home button and Back button to use the same confirmation modal.

- **Test Navigation**
  - Added auto-scroll to question container when pressing Next/Previous buttons.
  - Scroll targets `.question-container` with 50px breathing room from top.

- **Android WebView App**
  - Created minimal Android WebView project to wrap GitHub Pages site.
  - Configured to load `https://mhzsajan.github.io/jpmb`.
  - Added GitHub Actions workflow to build debug APK and upload artifact.

- **Cleanup & Refinement**
  - Removed "Loading counters..." placeholder from results page.
  - Deleted leftover backup file (`tests/jft-basic-1/jft-basic-1-data.js.bak`).
  - Removed site-wide beforeunload warnings per user request.
  - Fixed CSS load order issues (test.css overriding main.css with `!important` flags).

### Changed
- **Control Bar Layout (December 25, 2025)**
  - Reduced footer padding from 2rem to 0.8rem and margin-top from 3rem to 1.5rem for compact layout.
  - Adjusted body padding-bottom from 70px to 20px for tight spacing above control bar.
  - Test pages control bar: [Time Display] [Dark Mode + Sound] with centered [Home Button].
  - Home page control bar: [Time Display] [Go to Top Button] with centered [Dark Mode + Sound].
  
- **CSS Responsive Design**
  - Applied multiple media query breakpoints (768px, 720px, 520px, 480px) for mobile optimization.
  - Adjusted padding, font sizes, and layout for buttons and controls on small screens.
  - Hidden clock/datetime display on mobile with `display: none !important` override.
  - Repositioned start buttons in category cards to use inline-grid centering on mobile.
  - Control bar button sizes scale responsively: 44px (desktop) → 40px (768px) → 36px (480px).

- **JavaScript Behavior**
  - Modified popstate handler to show confirmation modal instead of immediate back navigation.
  - Updated modal Leave handler to use direct window location navigation.
  - Extended modal to support 'home', 'back', and 'refresh' types with appropriate messages.
  - Refresh warning added for beforeunload event without triggering browser's default warning.

### Fixed
- Home button centered positioning using absolute positioning with `left: 50%` and `transform: translateX(-50%)`.
- Home button stays centered on hover without movement animation.
- Removed fancy button styling from download link per user preference (plain text only).
- Browser refresh warning popup removed; only custom modal displays.

### Fixed
- Fixed left-heavy visual offset in mobile start buttons by:
  - Using inline-grid layout with centered alignment.
  - Forcing consistent gap and removing icon margins.
  - Applying asymmetric padding nudges.
  
- Fixed date/time display appearing on mobile by adding CSS override in test.css.
- Fixed Submit button visibility on last question for mobile.
- Fixed navigation modal appearing twice by pushing state back after modal display.

### Removed
- Removed custom beforeunload warnings (replaced with browser defaults, then entirely removed).
- Removed full-width button forcing on Start buttons in category cards for mobile.
- Removed "Skip All & Submit" button from mobile test navigation.

## [Past Sessions]

### Initial Setup
- Created basic test structure with HTML/CSS/JavaScript.
- Set up category grid layout for test selection.
- Implemented MockTest class for test lifecycle management.
- Added timer functionality with countdown.
- Created result page with score calculation.

---

## How to Use This File

- **Added**: New features or significant additions.
- **Changed**: Changes in existing functionality.
- **Fixed**: Bug fixes.
- **Removed**: Removed features or code.
- **Deprecated**: Features that will be removed in a future version.

For more details on changes, refer to specific commit hashes or file modifications.

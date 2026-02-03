# Nursing Care Nepali Test 1 Template Structure Documentation

## Overview
The Nursing Care Nepali Test 1 is the reference template implementation for all test files in this project. It demonstrates the complete structure, initialization, and data format that should be replicated across all other test files.

---

## 1. HTML Structure (`index.html`)

### Document Setup
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Nursing Care Test 1 (Nepali) | Skill Point Education Consultancy</title>
  
  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  
  <!-- External CSS - FIXED PATHS -->
  <link rel="stylesheet" href="../../data/css/main.css">
  <link rel="stylesheet" href="../../data/css/test.css">
</head>
```

**Key Points:**
- All CSS files use relative paths (`../../data/css/`) that work from any test folder
- Google Fonts and Material Icons are loaded for consistent styling and icons
- Character encoding is UTF-8 for international language support

### Accessibility & Utilities
```html
<body id="page-top">
  <!-- Skip to main content link for accessibility -->
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <!-- Date and Time Display -->
  <div class="datetime-display" aria-live="polite">
    <span class="date-part" id="date"></span>
    <span class="time-part" id="time"></span>
  </div>

  <!-- Controls Container -->
  <div class="controls-container">
    <!-- Dark Mode Toggle -->
    <button class="control-btn" id="darkModeToggle" aria-label="Toggle dark mode">
      <span class="material-icons" id="darkModeIcon" aria-hidden="true">dark_mode</span>
      <span id="darkModeText">Dark Mode</span>
    </button>

    <!-- Home Button - FIXED PATH -->
    <a href="../../index.html" class="control-btn home-btn" aria-label="Go to home page">
      <span class="material-icons" aria-hidden="true">home</span>
      <span>Home</span>
    </a>
  </div>
```

**Components:**
- **Skip Link**: Accessibility feature for keyboard navigation
- **DateTime Display**: Shows current date and time (updated every 1 second via `main.js`)
- **Dark Mode Toggle**: Allows users to switch between light/dark themes
- **Home Button**: Navigates back to main index with confirmation dialog

### Brand Header
```html
<header class="brand-header">
  <h1 class="brand-title">Skill Point Education Consultancy</h1>
  <p class="brand-subtitle">Kathmandu, NewPlaza.</p>
  <p class="section-title">SSW Mock Test Platform</p>
</header>
```

**Purpose:** Consistent branding across all test pages

### Main Test Content Structure
```html
<main class="main-content" id="main-content">
  <!-- Loading State -->
  <div class="loading-container" id="loadingContainer">
    <div class="loading-spinner">
      <span class="material-icons">quiz</span>
    </div>
    <h2>Loading Nursing Care Test 1 (Nepali)...</h2>
    <p>Preparing your 10 questions</p>
  </div>

  <!-- Test Container (hidden initially) -->
  <div class="test-container" id="testContainer" style="display: none;">
    <div class="test-header">
      <div class="test-title-container">
        <h1 class="test-title" id="dynamicTestTitle">Nursing Care Test 1 (Nepali)</h1>
        <p class="test-subtitle" id="dynamicTestSubtitle">10 Questions • 16 Minutes</p>
      </div>
      
      <div class="timer-container">
        <div class="timer-label">Remaining Time</div>
        <div class="timer-display" id="timerDisplay">16:00</div>
      </div>
    </div>

    <div class="question-container">
      <!-- Question Counter - Styled like navigation buttons -->
      <div class="question-counter-container">
        <div class="question-counter" id="questionCounter">Question 1 of 10</div>
      </div>
      
      <div class="question-text" id="questionText"></div>
      
      <img id="questionImage" class="question-image" style="display: none;" alt="Question image">
      
      <div class="options-container" id="optionsContainer"></div>
      
      <div class="navigation-controls">
        <button class="nav-btn" id="prevBtn" disabled>
          <span class="material-icons">arrow_back</span>
          Previous
        </button>
        
        <button class="nav-btn skip-all-btn" id="skipAllBtn">
          <span class="material-icons">fast_forward</span>
          Skip All & Submit
        </button>
        
        <button class="nav-btn" id="nextBtn">
          Next
          <span class="material-icons">arrow_forward</span>
        </button>
        
        <button class="nav-btn" id="submitBtn" style="display: none;">
          <span class="material-icons">check_circle</span>
          Submit Test
        </button>
      </div>
    </div>
  </div>
</main>
```

**Layout Breakdown:**

1. **Loading Container** (`id="loadingContainer"`)
   - Initially visible (display: block)
   - Shows animated loading spinner
   - Displays 1 second delay before showing test (built into JS initialization)

2. **Test Container** (`id="testContainer"`)
   - Initially hidden (display: none)
   - Shows after 1 second delay
   - Contains:
     - **Test Header**: Title, subtitle (questions count + duration), and timer
     - **Question Container**: Dynamic question display area
     - **Question Counter**: Shows current question number (e.g., "Question 1 of 10")
     - **Question Text**: The actual question content (populated dynamically)
     - **Question Image**: Optional image support (hidden by default)
     - **Options Container**: Multiple choice options rendered dynamically
     - **Navigation Controls**: Previous, Skip All & Submit, Next, Submit Test buttons

### Footer & Scripts
```html
<footer class="footer">
  <p>Created by <a href="https://wa.me/9779860172118" target="_blank" rel="noopener">Sajan Maharjan</a> | Skill Point Education Consultancy © 2025</p>
</footer>

<!-- External JavaScript - FIXED PATHS AND ORDER -->
<script src="../../data/js/main.js"></script>
<!-- Load test data first - FIXED: Changed to nursing-nepali-1-data.js -->
<script src="nursing-nepali-1-data.js"></script>
<!-- Then load test functionality -->
<script src="../../data/js/test-manager.js"></script>
</body>
</html>
```

**Script Loading Order (CRITICAL):**
1. `main.js` - Core utilities (date/time, dark mode, sound manager)
2. `nursing-nepali-1-data.js` - Test data object (must be test-specific file)
3. `test-manager.js` - MockTest class and initialization (depends on data being loaded first)

**This order is essential** because `test-manager.js` references `window.testData` which is set in the data file.

---

## 2. CSS Classes Used in Template

### Container Classes
- `.test-container` - Main test wrapper (max-width: 1200px)
- `.test-header` - Flexbox header with title and timer
- `.test-title-container` - Title and subtitle wrapper
- `.question-container` - Main question display area
- `.controls-container` - Top navigation controls
- `.options-container` - Multiple choice options wrapper

### Typography & Display
- `.test-title` - Large primary heading (1.8rem, #1976D2)
- `.test-subtitle` - Secondary heading (1.2rem, muted color)
- `.question-counter` - Badge-style counter (blue background, white text, rounded)
- `.question-text` - Question content box (1.2rem, bordered)
- `.question-image` - Max-width: 100%, centered display

### Button Classes
- `.nav-btn` - Navigation buttons (Previous, Next, Submit)
- `.control-btn` - Top control buttons (Dark Mode, Home)
- `.skip-all-btn` - Special styling for Skip All & Submit button
- `.action-btn` - Result page action buttons (Review, Retake, Home)

### State Classes
- `.selected` - Applied to selected option
- `.correct` - Applied to correct answer in review mode
- `.incorrect` - Applied to wrong answer in review mode
- `.disabled` - Applied to disabled buttons

### Timer States
- `.timer-warning` - Applied when ≤15 minutes (orange background, pulsing animation)
- `.timer-critical` - Applied when ≤5 minutes (red background, faster pulsing)

### Dark Mode
- Dark mode toggled via `document.body.classList.toggle('dark-mode')`
- All colors use CSS custom properties that adapt to dark mode

---

## 3. JavaScript Data Structure (`nursing-nepali-1-data.js`)

### Complete Data Object Format
```javascript
const nursingNepaliTest1Data = {
  title: "Nursing Care Test 1 (Nepali)",
  duration: 16,  // minutes
  passingScore: 70,  // percentage
  
  questions: [
    {
      text: "Question text here?",
      options: [
        "Option A",
        "Option B", 
        "Option C",
        "Option D"
      ],
      correctAnswer: 1,  // 0-indexed (0=A, 1=B, 2=C, 3=D)
      image: null  // or "../../data/images/question-1.png"
    },
    // ... more questions
  ]
};

// Make it available globally
window.testData = nursingNepaliTest1Data;

// Initialize test when everything is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, testData:', window.testData);
  console.log('MockTest available:', window.MockTest);
  
  setTimeout(() => {
    const loadingContainer = document.getElementById('loadingContainer');
    const testContainer = document.getElementById('testContainer');
    
    if (loadingContainer && testContainer) {
      loadingContainer.style.display = 'none';
      testContainer.style.display = 'block';
      
      // Initialize the test
      if (window.testData && window.MockTest) {
        console.log('Initializing MockTest...');
        new MockTest(window.testData);
      } else {
        console.error('Missing required components:', {
          testData: !!window.testData,
          MockTest: !!window.MockTest
        });
        
        // Show error message to user (see error handling in code)
      }
    }
  }, 1000);  // 1 second delay before showing test
});
```

### Data Object Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `title` | String | Yes | Test title (appears in page title, test header, and results) |
| `duration` | Number | Yes | Test duration in minutes (used for timer) |
| `passingScore` | Number | Yes | Passing percentage (0-100) |
| `questions` | Array | Yes | Array of question objects (must have at least 1) |

### Question Object Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `text` | String | Yes | Question text/content |
| `options` | Array[String] | Yes | Array of 4 options (must have exactly 4) |
| `correctAnswer` | Number | Yes | 0-indexed answer (0=first, 1=second, 2=third, 3=fourth) |
| `image` | String or null | No | Optional image URL (null if not needed) |
| `audio` | String or null | No | Optional audio file URL for listening comprehension questions |

### Example Question with Audio
```javascript
{
  text: "Listen to the audio and select the correct answer:",
  options: [
    "First option",
    "Second option",
    "Third option",
    "Fourth option"
  ],
  correctAnswer: 2,
  audio: "../../data/sound/questions/jft-basic-4/audio-sample-1.mp3"
}
```

### Audio Player Features
- **Play Limit**: Audio can be played a maximum of 2 times per question
- **Play Count Tracking**: Uses `sessionStorage` to track plays per question
- **Visual Indicator**: Shows "ℹ Can be played **twice only**!" message next to play button
  - Info icon (ℹ) in blue color (`--info` CSS variable)
  - Bold "twice only" text in primary color
- **Button State**:
  - Enabled: Shows "Play Audio" button when plays remaining
  - Disabled: Shows "Audio Played (Twice)" and becomes disabled after 2 plays
- **Session-based Reset**: Play count resets when navigating to different questions
- **Storage Key Format**: `audio_played_q${questionIndex}` (e.g., `audio_played_q0`, `audio_played_q5`)

### Initialization Flow (Critical)
1. HTML loads with loading container visible
2. Scripts load in order: `main.js` → data file → `test-manager.js`
3. Data file creates `window.testData` object
4. Data file's `DOMContentLoaded` waits 1 second
5. After 1 second: hides loading, shows test container
6. Creates new `MockTest(window.testData)` instance
7. MockTest class handles all test logic

---

## 4. MockTest Class Implementation & Parameters

### Constructor
```javascript
class MockTest {
  constructor(testData) {
    this.testData = testData;
    this.currentQuestion = 0;
    this.userAnswers = new Array(testData.questions.length).fill(null);
    this.timer = null;
    this.timeLeft = testData.duration * 60;  // Convert to seconds
    this.warningPlayed = {
      fifteen: false,
      five: false
    };
    this.startTime = new Date();
    this.testCompleted = false;
    this.reviewMode = false;
    
    this.initializeTest();
  }
}
```

### Class Properties

| Property | Type | Purpose |
|----------|------|---------|
| `testData` | Object | Complete test data from data file |
| `currentQuestion` | Number | Current question index (0-based) |
| `userAnswers` | Array | Array of user's answers (null = unanswered) |
| `timer` | ID | setInterval ID for countdown timer |
| `timeLeft` | Number | Remaining seconds on timer |
| `warningPlayed` | Object | Tracks if 15-min and 5-min warnings were played |
| `startTime` | Date | When test started (for time-taken calculation) |
| `testCompleted` | Boolean | Whether user has submitted test |
| `reviewMode` | Boolean | Whether currently in review/results mode |

### Key Methods

#### Initialization Methods
- `initializeTest()` - Calls setupEventListeners, startTimer, displayQuestion, updateProgress, updateTestTitle, setupHomeButton
- `setupEventListeners()` - Attaches click handlers to Previous, Next, Submit, and Skip All buttons
- `updateTestTitle()` - Updates page title and header with test data

#### Display Methods
- `displayQuestion()` - Renders current question text, image (if any), and calls displayOptions
- `displayOptions(options)` - Creates option items with letter markers (A, B, C, D)
- `displayAudioPlayer(question)` - Renders audio player with play limit indicator (shows "Can be played **twice only**!")
- `updateProgress()` - Updates "Question X of Y" counter
- `updateNavigationButtons()` - Enables/disables Previous, Next, Submit buttons based on position

#### User Interaction Methods
- `selectOption(optionIndex)` - Records user's answer, updates UI highlighting
- `previousQuestion()` - Moves to previous question, saves current answer
- `nextQuestion()` - Moves to next question, saves current answer
- `skipAllAndSubmit()` - Shows confirmation dialog, submits test with unanswered as incorrect

#### Timer Methods
- `startTimer()` - Initializes countdown timer (updates every 1 second)
- `updateTimerDisplay()` - Updates timer display, applies warning classes
- `showTimeWarning(minutes)` - Shows "X minutes remaining" popup
- `timeUp()` - Called when timer reaches 0, automatically submits test

#### Submission Methods
- `submitTest()` - Stops timer, calculates score, shows results
- `calculateScore()` - Counts correct answers
- `displayResults(score, percentage, passed)` - Shows results page

#### Review Methods
- `startReviewMode()` - Shows all questions with answers highlighted (correct/incorrect)
- `updateReviewModeDisplay()` - Adds visual feedback for correct/incorrect answers
- `exitReviewMode()` - Returns to results page

#### Utility Methods
- `restoreSelectedAnswer()` - Highlights user's previous answer when navigating back
- `checkAllQuestionsAnswered()` - Shows Submit button when all questions answered
- `formatTimeTaken()` - Calculates and formats elapsed time
- `retakeTest()` - Reloads page to start fresh
- `confirmHomeNavigation()` - Shows warning before leaving test

### Timer Behavior
- **Duration Conversion**: `testData.duration` (minutes) × 60 = seconds
- **Warnings**:
  - At 15 minutes: Orange warning, pulsing timer display
  - At 5 minutes: Red warning (critical), faster pulsing
  - At 0 seconds: Auto-submit test
- **Display Format**: MM:SS (e.g., "16:00", "00:45")

### Answer Recording
- `userAnswers` array matches questions array length
- Index = question number, value = selected option index (0-3) or null
- When user selects option: `this.userAnswers[currentQuestion] = optionIndex`
- When user navigates away: answer is saved automatically

### Scoring System
```javascript
Score = Number of correct answers / Total questions × 100
Passed = (Score ≥ passingScore)
```

### Results Display
Shows:
- Overall pass/fail status with icon (✓ or ✗)
- Score (X/Y format)
- Percentage with pass/fail coloring
- Breakdown: Total, Correct, Incorrect, Unanswered, Passing Score, Your Score, Time Taken
- Stat visualization with color coding
- Action buttons: Review Answers, Retake Test, Back to Home

---

## 5. Initialization & Load Flow

### Script Execution Timeline
```
1. HTML Parser loads DOM
   ↓
2. main.js executes
   - Sets up date/time updater
   - Initializes SoundManager
   - Checks for dark mode preference
   - Sets up event listeners
   ↓
3. Data file (nursing-nepali-1-data.js) executes
   - Creates testData object
   - Sets window.testData
   - Adds DOMContentLoaded listener
   ↓
4. test-manager.js executes
   - Defines MockTest class
   - Sets window.MockTest
   ↓
5. DOM Ready (DOMContentLoaded fires)
   - main.js handlers execute
   - Data file handler waits 1 second
   ↓
6. After 1 second delay
   - Hides loading container
   - Shows test container
   - Creates new MockTest(testData) instance
   ↓
7. MockTest constructor runs
   - Calls initializeTest()
   - Sets up event listeners
   - Starts timer
   - Displays first question
```

### State Transitions
```
LOADING (0-1s)
    ↓
TEST TAKING (1s - timer ends or user submits)
    ↓
RESULTS PAGE (after submit/time-up)
    ↓
[OPTIONAL] REVIEW MODE (if user clicks Review)
    ↓
Back to RESULTS PAGE
    ↓
[Either] RETAKE TEST (reload page → back to LOADING)
[Or] GO HOME (redirect to index.html)
```

---

## 6. CSS Styling Implementation

### Key CSS Classes in test.css

#### Layout Classes
- `.test-container` - Max-width 1200px, auto margins, padding
- `.test-header` - Flexbox, space-between, wrapped for responsive
- `.question-container` - Bordered box with shadow, padding
- `.navigation-controls` - Flexbox for button layout

#### Animation Classes
- `.timer-warning` - Pulsing animation at 15 minutes (1s cycle)
- `.timer-critical` - Pulsing animation at 5 minutes (0.5s cycle)
- `.question-counter:hover` - Transform translateY(-2px)

#### Color Classes
- Primary (Blue): `#1976D2` for titles, buttons, counters
- Success (Green): `#4caf50` for correct answers
- Warning (Orange): `#ff9800` for timer warning, unanswered
- Error (Red): `#f44336` for incorrect answers, time up

#### Responsive Design
- Flex-wrap for mobile compatibility
- Media queries for button layout on small screens
- Max-width image display

---

## 7. Files Requiring Updates

### 1. **Food Service Test** ✓
   - Location: `/tests/food-service/`
   - Files to update:
     - `index.html` - Verify structure matches template
     - `food-service-data.js` - Replace question data with actual food service questions
   - Current state: Partially updated (has agriculture questions)

### 2. **Agriculture Test** ✓
   - Location: `/tests/agriculture/`
   - Files to update:
     - `index.html` - Verify structure matches template
     - `agriculture-data.js` - Replace question data with actual agriculture questions
   - Current state: Partially updated (has food service questions)

### 3. **JFT Basic 1** ✓
   - Location: `/tests/jft-basic-1/`
   - Files to update:
     - `index.html` - Create from template
     - `jft-basic-1-data.js` - Create with actual test questions
   - Data file naming convention: `jft-basic-1-data.js`

### 4. **JFT Basic 2** ✓
   - Location: `/tests/jft-basic-2/`
   - Files to update:
     - `index.html` - Create from template
     - `jft-basic-2-data.js` - Create with actual test questions
   - Data file naming convention: `jft-basic-2-data.js`

### 5. **JFT Basic 3** ✓
   - Location: `/tests/jft-basic-3/`
   - Files to update:
     - `index.html` - Create from template
     - `jft-basic-3-data.js` - Create with actual test questions
   - Data file naming convention: `jft-basic-3-data.js`

### 6. **JFT Basic 4** ✓
   - Location: `/tests/jft-basic-4/`
   - Files to update:
     - `index.html` - Create from template
     - `jft-basic-4-data.js` - Create with actual test questions
   - Data file naming convention: `jft-basic-4-data.js`

### 7. **Nursing Care Japanese 1** ✓
   - Location: `/tests/nursing-care-japanese-1/`
   - Files to update:
     - `index.html` - Verify structure matches template
     - `nursing-japanese-1-data.js` - Replace question data with actual nursing care Japanese questions
   - Data file naming convention: `nursing-japanese-1-data.js`

### 8. **Nursing Care Japanese 2** ✓
   - Location: `/tests/nursing-care-japanese-2/`
   - Files to update:
     - `index.html` - Verify structure matches template
     - `nursing-japanese-2-data.js` - Replace question data with actual nursing care Japanese questions
   - Data file naming convention: `nursing-japanese-2-data.js`

### 9. **Nursing Care Nepali 2** ✓
   - Location: `/tests/nursing-care-nepali-2/`
   - Files to update:
     - `index.html` - Verify structure matches template
     - `nursing-nepali-2-data.js` - Replace question data with actual nursing care Nepali 2 questions
   - Data file naming convention: `nursing-nepali-2-data.js`

### 10. **Nursing Care Nepali 1** ✓ (Reference Template)
   - Location: `/tests/nursing-care-nepali-1/`
   - Files: COMPLETE AND WORKING - Use as reference
   - Data file naming convention: `nursing-nepali-1-data.js`

---

## 8. Common Errors & Troubleshooting

### Script Loading Errors

**Error: "Cannot read property 'questions' of undefined"**
- **Cause**: Data file loaded after test-manager.js or data file not loaded
- **Solution**: Verify script order in HTML - data file MUST come before test-manager.js

**Error: "MockTest is not defined"**
- **Cause**: test-manager.js not loaded
- **Solution**: Check script path, ensure relative paths are correct (../../data/js/test-manager.js)

**Error: "Cannot set property 'testData' on null"**
- **Cause**: window.testData not set by data file
- **Solution**: Verify data file creates `window.testData = nursingNepaliTest1Data`

### Display Issues

**Loading Screen Never Disappears**
- **Cause**: 1-second timeout not firing, usually due to:
  - Elements with wrong IDs
  - MockTest not initializing
- **Solution**: Check browser console for errors, verify element IDs match HTML

**Timer Doesn't Appear**
- **Cause**: `#timerDisplay` element missing or hidden
- **Solution**: Verify `<div class="timer-display" id="timerDisplay">16:00</div>` exists in HTML

**Questions Don't Display**
- **Cause**: `#questionText` missing or options container issues
- **Solution**: Verify all container IDs exist: questionText, optionsContainer, questionCounter

### Data Issues

**Incorrect Answer Shows in Results**
- **Cause**: `correctAnswer` index incorrect (off-by-one error)
- **Solution**: Remember: 0=A, 1=B, 2=C, 3=D (0-indexed)

**Missing or Extra Options**
- **Cause**: Question options array doesn't have exactly 4 items
- **Solution**: Verify each question has exactly 4 options

**Score Always Zero**
- **Cause**: All correctAnswer indices are wrong
- **Solution**: Double-check answer keys

---

## 9. Variable Naming Conventions

### JavaScript Variables
- Test data variable: `nursingNepaliTest1Data` (camelCase)
- Global assignment: `window.testData = nursingNepaliTest1Data`
- File naming: Lowercase with hyphens (e.g., `nursing-nepali-1-data.js`)

### HTML IDs (Must Match Exactly)
- `loadingContainer` - Loading state wrapper
- `testContainer` - Main test wrapper
- `darkModeToggle` - Dark mode button
- `darkModeIcon` - Dark mode icon element
- `darkModeText` - Dark mode text label
- `date` - Date display
- `time` - Time display
- `dynamicTestTitle` - Test title in header
- `dynamicTestSubtitle` - Test subtitle (questions + duration)
- `timerDisplay` - Timer countdown display
- `questionCounter` - Current question counter
- `questionText` - Question text display
- `questionImage` - Question image element
- `optionsContainer` - Multiple choice options wrapper
- `prevBtn` - Previous button
- `nextBtn` - Next button
- `submitBtn` - Submit button
- `skipAllBtn` - Skip All & Submit button
- `page-top` - Body ID for skip link

### CSS Classes (Key Ones)
- `.test-container` - Main test wrapper
- `.test-header` - Test header area
- `.test-title` - Test title text
- `.test-subtitle` - Test subtitle text
- `.question-container` - Question box
- `.question-counter` - Counter badge
- `.question-text` - Question text
- `.options-container` - Options wrapper
- `.option-item` - Individual option
- `.nav-btn` - Navigation button
- `.timer-display` - Timer display
- `.timer-warning` - Warning timer style (≤15 min)
- `.timer-critical` - Critical timer style (≤5 min)
- `.selected` - Selected option state
- `.correct` - Correct answer state
- `.incorrect` - Incorrect answer state

---

## 10. Implementation Checklist

When replicating the template to new test files:

### HTML Structure
- [ ] Doctype and language declared
- [ ] Character encoding UTF-8
- [ ] Viewport meta tag present
- [ ] Page title formatted: "{Test Name} | Skill Point Education Consultancy"
- [ ] All Google Fonts and Material Icons loaded
- [ ] CSS files linked with correct relative paths (../../data/css/)
- [ ] Skip link present
- [ ] DateTime display present with correct IDs
- [ ] Controls container with Dark Mode and Home buttons
- [ ] Brand header with school name and subtitle
- [ ] Loading container with correct ID
- [ ] Test container with all required child elements
- [ ] All required element IDs present (see section 9)
- [ ] Scripts loaded in correct order: main.js → data file → test-manager.js
- [ ] Footer with copyright and creator link

### JavaScript Data File
- [ ] Variable named with pattern `{TestName}Data` (camelCase)
- [ ] Title property set correctly
- [ ] Duration in minutes
- [ ] Passing score (0-100)
- [ ] Exactly one question object for each question
- [ ] Each question has: text, options (4 items), correctAnswer (0-3), image (null or path)
- [ ] Options array has exactly 4 items
- [ ] correctAnswer is 0-indexed (0=A, 1=B, 2=C, 3=D)
- [ ] `window.testData = {varName}` assignment
- [ ] DOMContentLoaded listener with 1-second delay
- [ ] Loading and test containers shown/hidden correctly
- [ ] Error handling for missing components

### CSS Styling
- [ ] test.css linked from ../../data/css/test.css
- [ ] main.css linked from ../../data/css/main.css
- [ ] All CSS classes available (not overridden locally unless needed)
- [ ] Dark mode compatible (uses CSS variables)

### Testing Checklist
- [ ] Page loads with loading spinner
- [ ] After 1 second, test displays with first question
- [ ] Timer counts down correctly
- [ ] All 4 options display as clickable items
- [ ] Selecting option highlights it and saves answer
- [ ] Previous/Next buttons navigate correctly
- [ ] Question counter updates
- [ ] Skip All & Submit button works
- [ ] Unanswered questions warning displays
- [ ] Timer warnings at 15 and 5 minutes
- [ ] Time up auto-submits
- [ ] Results page shows correct calculations
- [ ] Review mode shows correct/incorrect answers
- [ ] Dark mode toggle works
- [ ] Home button with confirmation works

---

## 11. Special Features & Advanced Notes

### Dark Mode Implementation
- Stored in localStorage: `localStorage.getItem('darkMode')`
- Applied via: `document.body.classList.add('dark-mode')`
- All colors use CSS variables that adapt
- Icon changes between 'dark_mode' and 'light_mode'

### Sound Manager
- Managed by `SoundManager` object in main.js
- Methods: `toggle()`, `playClick()`, `playSuccess()`, `playError()`, `playQuestionAudio(type, file)`
- Sound toggles are handled automatically
- Errors fail silently without breaking test

### Review Mode Features
- Read-only review of all answers
- Options show:
  - `.correct` class for correct answer
  - `.selected-correct` for user's correct selection
  - `.selected-incorrect` for user's wrong selection
- Feedback shows: ✓ for correct, ✗ for incorrect, ? for unanswered
- Retake button reloads page

### Time Format
- Display: MM:SS format (e.g., "16:00", "00:45")
- Calculation: `Math.floor(timeLeft / 60)` for minutes
- Padding: `.toString().padStart(2, '0')` ensures zero-padding

### Answer Validation
- Unanswered = null value
- All null answers marked as incorrect on submission
- Warning dialog shows count of unanswered questions

---

## Summary of Key Points

1. **File Naming**: Use test-specific data files (e.g., `nursing-nepali-1-data.js`)
2. **Script Order**: main.js → data file → test-manager.js (CRITICAL)
3. **Element IDs**: Must match exactly (case-sensitive)
4. **Data Format**: 10 questions × 4 options × correct answer (0-3)
5. **Duration**: In minutes (converted to seconds in MockTest)
6. **Paths**: Use relative paths (../../data/) from any test subfolder
7. **Timer**: Auto-submits at 0, warns at 15 and 5 minutes
8. **Results**: Shows score, percentage, detail breakdown, and actions
9. **Responsive**: Flexbox layout adapts to mobile/tablet
10. **Accessible**: Skip links, ARIA labels, semantic HTML

This template ensures consistency across all test implementations while allowing easy customization of test content through the data files.

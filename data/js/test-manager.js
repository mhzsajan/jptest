// Enhanced MockTest class in data/js/test-manager.js
class MockTest {
  constructor(testData) {
    // Clear any existing test instance's timer
    if (window.mockTestInstance && window.mockTestInstance.timer) {
      clearInterval(window.mockTestInstance.timer);
      window.mockTestInstance.timer = null;
    }
    
    this.testData = testData;
    this.currentQuestion = 0;
    this.userAnswers = new Array(testData.questions.length).fill(null);
    this.timer = null;
    this.timerRunning = false;
    this.timeLeft = testData.duration * 60;
    this.warningPlayed = {
      fifteen: false,
      five: false
    };
    this.startTime = new Date();
    this.testCompleted = false;
    this.reviewMode = false;
    this.submissionInProgress = false;
    this.submissionModalListenersAttached = false;
    
    this.initializeTest();
  }
  
  initializeTest() {
    console.log('Initializing test...');
    // Clear all audio played states at the start of each test
    this.clearAudioStates();
    this.setupEventListeners();
    this.setupBrowserWarnings();
    this.startTimer();
    this.displayQuestion();
    this.updateProgress();
    this.updateTestTitle();
    this.setupHomeButton();
  }
  
  setupBrowserWarnings() {
    // Handle browser back button via History API - navigate straight to home
    window.addEventListener('popstate', (e) => {
      if (!this.testCompleted) {
        e.preventDefault();
        // Show a confirmation modal — user will be returned to this page
        this.showNavigationWarning('back');
        // Push state back so the browser doesn't actually navigate away immediately
        window.history.pushState(null, '', window.location.href);
      }
    });

    // Handle beforeunload for browser refresh button and close (show custom warning only)
    window.addEventListener('beforeunload', (e) => {
      if (!this.testCompleted) {
        this.showNavigationWarning('refresh');
        // Don't set returnValue or preventDefault - let our custom popup handle it
        // This prevents the browser's default warning popup
      }
    });

    // Handle keyboard shortcuts for refresh (F5, Ctrl+R, Cmd+R)
    window.addEventListener('keydown', (e) => {
      if (!this.testCompleted) {
        // F5
        if (e.key === 'F5') {
          e.preventDefault();
          this.showNavigationWarning('refresh');
          return false;
        }
        // Ctrl+R (Windows/Linux)
        if (e.ctrlKey && e.key === 'r') {
          e.preventDefault();
          this.showNavigationWarning('refresh');
          return false;
        }
        // Cmd+R (Mac)
        if (e.metaKey && e.key === 'r') {
          e.preventDefault();
          this.showNavigationWarning('refresh');
          return false;
        }
      }
    }, true); // Use capture phase for better detection

    // Push initial state to detect back button press
    window.history.pushState(null, '', window.location.href);
  }

  showNavigationWarning(type) {
    const modal = document.createElement('div');
    modal.className = 'warning-modal navigation-warning';
    
    let title = '';
    let message = '';
    
    if (type === 'refresh') {
      title = '⏱️ Hold On!';
      message = 'Refreshing the page will reset your test progress.<br><br>You\'ll need to start from Question 1 again, and all your answers will be lost.';
    } else if (type === 'back') {
      title = '⬅️ Going Back?';
      message = 'Using the back button will exit your test.<br><br>Your progress will be lost and you\'ll need to start from the beginning.';
    } else if (type === 'home') {
      title = '⚠️ Leave Test?';
      message = 'Are you sure you want to go to the home page?\n\nYour current progress will be lost and you\'ll need to start over.';
    }
    
    modal.innerHTML = `
      <div class="modal-content warning-content">
        <div class="modal-icon warning-icon">
          <span class="material-icons">warning</span>
        </div>
        <h3 class="modal-title">${title}</h3>
        <p class="modal-message">${message}</p>
        <div class="modal-actions">
          <button class="modal-btn secondary" id="continueBtn">
            <span class="material-icons">arrow_forward</span>
            Continue Test
          </button>
          <button class="modal-btn primary danger" id="leaveBtn">
            <span class="material-icons">exit_to_app</span>
            Leave Test
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('continueBtn').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    document.getElementById('leaveBtn').addEventListener('click', () => {
      // Clear all states and allow navigation
      this.testCompleted = true;
      document.body.removeChild(modal);
      if (type === 'back') {
        // Navigate directly to the home page to avoid extra history entries
        window.location.href = '../../index.html';
      } else if (type === 'refresh') {
        window.location.reload();
      } else if (type === 'home') {
        // Navigate to home page from test folders
        window.location.href = '../../index.html';
      }
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  }
  
  clearAudioStates() {
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      if (key.startsWith('audio_played_')) {
        sessionStorage.removeItem(key);
      }
    });
  }

  showCustomConfirmation(title, message, confirmText, cancelText, onConfirm) {
    const isDarkMode = document.body.classList.contains('dark-mode');
    const modal = document.createElement('div');
    modal.className = 'confirmation-modal custom-confirmation';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    `;

    const bgColor = isDarkMode ? '#2a2a2a' : '#ffffff';
    const textColor = isDarkMode ? '#ffffff' : '#333';
    const secondaryTextColor = isDarkMode ? '#b0b0b0' : '#666';
    const cancelBgColor = isDarkMode ? '#404040' : '#f5f5f5';
    const cancelBorderColor = isDarkMode ? '#505050' : '#ddd';
    const cancelHoverBg = isDarkMode ? '#4a4a4a' : '#eeeeee';

    modal.innerHTML = `
      <div class="modal-content" style="
        background: ${bgColor};
        border-radius: 12px;
        padding: 2rem;
        max-width: 450px;
        width: 90%;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        text-align: center;
      ">
        <h3 style="
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
          color: ${textColor};
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        ">${title}</h3>
        <p style="
          margin: 0 0 2rem 0;
          font-size: 1rem;
          color: ${secondaryTextColor};
          line-height: 1.6;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        ">${message}</p>
        <div style="
          display: flex;
          gap: 1rem;
          justify-content: center;
        ">
          <button class="modal-cancel-btn" style="
            padding: 0.75rem 2rem;
            font-size: 1rem;
            border: 1px solid ${cancelBorderColor};
            background: ${cancelBgColor};
            color: ${textColor};
            border-radius: 6px;
            cursor: pointer;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            transition: all 0.2s ease;
          ">
            ${cancelText}
          </button>
          <button class="modal-confirm-btn" style="
            padding: 0.75rem 2rem;
            font-size: 1rem;
            border: none;
            background: #d32f2f;
            color: white;
            border-radius: 6px;
            cursor: pointer;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            transition: all 0.2s ease;
          ">
            ${confirmText}
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const confirmBtn = modal.querySelector('.modal-confirm-btn');
    const cancelBtn = modal.querySelector('.modal-cancel-btn');

    confirmBtn.addEventListener('click', () => {
      document.body.removeChild(modal);
      onConfirm();
    });

    cancelBtn.addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    // Close on background click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });

    // Add hover effects
    confirmBtn.addEventListener('mouseover', () => {
      confirmBtn.style.background = '#b71c1c';
    });
    confirmBtn.addEventListener('mouseout', () => {
      confirmBtn.style.background = '#d32f2f';
    });

    cancelBtn.addEventListener('mouseover', () => {
      cancelBtn.style.background = cancelHoverBg;
    });
    cancelBtn.addEventListener('mouseout', () => {
      cancelBtn.style.background = cancelBgColor;
    });
  }
  
  setupHomeButton() {
    const homeButton = document.querySelector('.home-btn');
    if (homeButton) {
      homeButton.replaceWith(homeButton.cloneNode(true));
      const newHomeButton = document.querySelector('.home-btn');
      
      newHomeButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.confirmHomeNavigation();
      });
    }

    // Setup control bar home buttons
    const controlBarHomeButtons = document.querySelectorAll('.bar-home-center');
    controlBarHomeButtons.forEach(btn => {
      btn.replaceWith(btn.cloneNode(true));
    });

    // Re-query after replacing
    const newControlBarButtons = document.querySelectorAll('.bar-home-center');
    newControlBarButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.confirmHomeNavigation();
      });
    });
  }
  
  confirmHomeNavigation() {
    if (this.testCompleted) {
      window.location.href = "../../index.html";
      return;
    }
    
    this.showCustomConfirmation(
      '🏠 Leave Test?',
      'Are you sure you want to go to the home page?<br><br>Your current progress will be lost and you\'ll need to start over.',
      'Go Home',
      'Continue Test',
      () => {
        this.testCompleted = true;
        window.location.href = "../../index.html";
      }
    );
  }
  
  updateTestTitle() {
    document.title = `${this.testData.title} | Skill Point Education Consultancy`;
    
    const testTitleElement = document.querySelector('.test-title');
    const testSubtitleElement = document.querySelector('.test-subtitle');
    
    if (testTitleElement) {
      testTitleElement.textContent = this.testData.title;
    }
    
    if (testSubtitleElement) {
      testSubtitleElement.textContent = 
        `${this.testData.questions.length} Questions • ${this.testData.duration} Minutes`;
    }
  }
  
  setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Navigation buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.previousQuestion());
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextQuestion());
      console.log('Next button listener added');
    }
    
    // submitBtn event listener
    if (submitBtn) {
      submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.submitTest();
      });
    }
    
    // skipAllBtn event listener
    const skipAllBtn = document.getElementById('skipAllBtn');
    if (skipAllBtn) {
      skipAllBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.submitTest();
      });
    }

    // Submission modal button listeners
    const cancelBtn = document.getElementById('submissionCancelBtn');
    const confirmBtn = document.getElementById('submissionConfirmBtn');
    const backdrop = document.querySelector('.submission-modal-backdrop');

    if (cancelBtn) {
      cancelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.closeSubmissionModal();
      });
    }

    if (confirmBtn) {
      confirmBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.confirmSubmission();
      });
    }

    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        this.closeSubmissionModal();
      });
    }
    
    // Go to Question feature
    const goToQuestionBtn = document.getElementById('goToQuestionBtn');
    const goToQuestionInput = document.getElementById('goToQuestionInput');
    
    if (goToQuestionBtn && goToQuestionInput) {
      goToQuestionBtn.addEventListener('click', () => this.goToQuestion());
      goToQuestionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.goToQuestion();
        }
      });
      console.log('Go to Question feature initialized');
    }
  }

  goToQuestion() {
    const goToQuestionInput = document.getElementById('goToQuestionInput');
    const questionNum = parseInt(goToQuestionInput.value, 10);
    const totalQuestions = this.testData.questions.length;
    
    // Validation with shake animation and red highlight
    if (!goToQuestionInput.value.trim() || isNaN(questionNum) || questionNum < 1 || questionNum > totalQuestions) {
      // Add error class for shake animation and red color
      goToQuestionInput.classList.add('error');
      
      // Remove error state and clear input after animation
      setTimeout(() => {
        goToQuestionInput.classList.remove('error');
        goToQuestionInput.value = '';
      }, 600);
      
      return;
    }
    
    // Valid entry - show green animation
    goToQuestionInput.classList.add('valid');
    
    // Jump to question after showing valid state
    setTimeout(() => {
      // Jump to question (convert to 0-indexed)
      this.currentQuestion = questionNum - 1;
      this.displayQuestion();
      this.updateProgress();
      
      // Clear input and scroll to top
      goToQuestionInput.value = '';
      goToQuestionInput.classList.remove('valid');
      window.scrollTo(0, 0);
    }, 400);
  }

  // DEPRECATED: Old submit warning - replaced by showSubmissionConfirmation
  // This function is no longer used
  showSubmitWarning() {
    console.warn('showSubmitWarning is deprecated - use showSubmissionConfirmation instead');
    // Redirect to the new unified popup
    this.showSubmissionConfirmation();
  }
  
  // DEPRECATED: Old confirm submit - replaced by showSubmissionConfirmation
  confirmSubmit() {
    console.warn('confirmSubmit is deprecated - use showSubmissionConfirmation instead');
    // Redirect to the new unified popup
    this.showSubmissionConfirmation();
  }
  
  startTimer() {
    // Prevent starting multiple timer instances
    if (this.timerRunning) {
      console.log('Timer already running, skipping duplicate start');
      return;
    }
    
    console.log('Starting timer...', this.timeLeft, 'seconds remaining');
    
    // Clear any existing timer to prevent multiple intervals
    if (this.timer) {
      console.log('Clearing existing timer before starting new one');
      clearInterval(this.timer);
      this.timer = null;
    }
    
    this.timerRunning = true;
    this.updateTimerDisplay();
    
    // Use a more robust timer with explicit 1000ms interval
    // Note: updateTimerDisplay() is called by the global updateBarTime() interval for synchronization
    this.timer = setInterval(() => {
      if (this.testCompleted) {
        clearInterval(this.timer);
        this.timer = null;
        this.timerRunning = false;
        return;
      }
      
      this.timeLeft--;
      
      if (this.timeLeft === 15 * 60 && !this.warningPlayed.fifteen) {
        this.playWarningSound('fifteen');
        this.showTimeWarning(15);
        this.warningPlayed.fifteen = true;
      } else if (this.timeLeft === 5 * 60 && !this.warningPlayed.five) {
        this.playWarningSound('five');
        this.showTimeWarning(5);
        this.warningPlayed.five = true;
      } else if (this.timeLeft <= 0) {
        this.timeUp();
      }
    }, 1000);
  }
  
  updateTimerDisplay() {
    const timerDisplay = document.getElementById('timerDisplay');
    if (!timerDisplay) {
      console.error('Timer display element not found!');
      return;
    }
    
    // Ensure timeLeft is never negative
    if (this.timeLeft < 0) {
      this.timeLeft = 0;
    }
    
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    timerDisplay.textContent = formattedTime;
    
    timerDisplay.classList.remove('timer-warning', 'timer-critical');
    
    if (this.timeLeft <= 5 * 60) {
      timerDisplay.classList.add('timer-critical');
    } else if (this.timeLeft <= 15 * 60) {
      timerDisplay.classList.add('timer-warning');
    }
  }
  
  playWarningSound(type) {
    console.log(`${type}-minute warning - Playing alarm sound`);
    
    try {
      // Use SoundManager if available, otherwise create new Audio
      if (window.SoundManager && window.SoundManager.isEnabled()) {
        // Play multiple beeps for emphasis
        const audioPath = '../../data/sound/ui/timer-beep.mp3';
        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            const audio = new Audio(audioPath);
            audio.volume = 0.8;
            audio.play().catch((error) => {
              console.warn(`Could not play beep ${i + 1}:`, error);
            });
          }, i * 400); // 400ms between beeps
        }
      } else {
        console.log('Sound disabled, skipping warning sound');
      }
    } catch (error) {
      console.error('Error playing warning sound:', error);
    }
  }
  
  showTimeWarning(minutes) {
    const warning = document.createElement('div');
    warning.className = 'time-warning';
    warning.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: ${minutes <= 5 ? '#d32f2f' : '#ff9800'};
      color: white;
      padding: 2rem 3rem;
      border-radius: 12px;
      font-weight: bold;
      z-index: 10000;
      box-shadow: 0 8px 24px rgba(0,0,0,0.4);
      font-size: 1.5rem;
      text-align: center;
      min-width: 300px;
      animation: slideIn 0.3s ease-out;
    `;
    
    const content = document.createElement('div');
    content.innerHTML = `
      <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">⏰</div>
      <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">${minutes} minutes remaining!</div>
      <div style="font-size: 0.9rem; opacity: 0.9;">Please save your progress</div>
    `;
    warning.appendChild(content);
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translate(-50%, -60%);
        }
        to {
          opacity: 1;
          transform: translate(-50%, -50%);
        }
      }
    `;
    if (!document.querySelector('style[data-warning-animation]')) {
      style.setAttribute('data-warning-animation', 'true');
      document.head.appendChild(style);
    }
    
    document.body.appendChild(warning);
    
    setTimeout(() => {
      if (document.body.contains(warning)) {
        warning.style.transition = 'opacity 0.3s ease-out';
        warning.style.opacity = '0';
        setTimeout(() => {
          if (document.body.contains(warning)) {
            document.body.removeChild(warning);
          }
        }, 300);
      }
    }, 3000);
  }
  
  timeUp() {
    this.testCompleted = true;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      this.timerRunning = false;
    }
    
    // Show time's up modal
    const modal = document.createElement('div');
    modal.className = 'time-up-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10001;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
      background: white;
      padding: 2rem;
      border-radius: 12px;
      text-align: center;
      max-width: 400px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    `;
    
    content.innerHTML = `
      <div style="font-size: 3rem; margin-bottom: 1rem;">⏰</div>
      <h2 style="color: #d32f2f; margin: 0 0 0.5rem 0; font-size: 1.5rem;">Time's Up!</h2>
      <p style="margin: 0 0 1.5rem 0; color: #666;">Your test has been automatically submitted.</p>
      <p style="margin: 0 0 1rem 0; color: #999; font-size: 0.9rem;">Calculating results...</p>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Submit after showing message (bypass confirmation since it's automatic)
    setTimeout(() => {
      this.finalizeSubmission();
    }, 2000);
  }
  
  displayQuestion() {
    if (!this.testData.questions || this.testData.questions.length === 0) {
      console.error('No questions found in test data!');
      return;
    }
    
    // Hide loading container and show test container on first question display
    const loadingContainer = document.getElementById('loadingContainer');
    const testContainer = document.getElementById('testContainer');
    if (loadingContainer && testContainer) {
      loadingContainer.style.display = 'none';
      testContainer.style.display = 'block';
    }
    
    const question = this.testData.questions[this.currentQuestion];
    console.log('Displaying question', this.currentQuestion + 1, question);
    
    const questionTextElement = document.getElementById('questionText');
    
    if (questionTextElement) {
      questionTextElement.textContent = question.text;
    }
    
    const questionImage = document.getElementById('questionImage');
    if (question.image) {
      questionImage.src = question.image;
      questionImage.style.display = 'block';
      questionImage.alt = `Question ${this.currentQuestion + 1} image`;
      
      // Add click handler for quick view
      questionImage.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.showQuickView(question.image);
      };
    } else {
      questionImage.style.display = 'none';
    }
    
    // Display audio player if question has audio
    this.displayAudioPlayer(question);
    
    this.displayOptions(question.options);
    this.restoreSelectedAnswer();
    this.updateNavigationButtons();
    
    this.updateReviewModeDisplay();
  }

  displayAudioPlayer(question) {
    const audioContainer = document.getElementById('audioContainer');
    if (!audioContainer) {
      return;
    }
    
    if (question.audio) {
      const audioKey = `audio_played_q${this.currentQuestion}`;
      const playCount = parseInt(sessionStorage.getItem(audioKey) || '0');
      const canPlay = playCount < 2;

      audioContainer.innerHTML = `
        <div class="audio-player">
          <button class="audio-btn" id="playAudioBtn" ${!canPlay ? 'disabled' : ''}>
            <span class="material-icons audio-icon">play_arrow</span>
            <span id="audioButtonText">${!canPlay ? 'Limit Reached' : 'Play Audio'}</span>
          </button>
          <span class="audio-counter">
            <span class="counter-value">${playCount}/2</span>
          </span>
          <span class="audio-play-limit">
            <span class="material-icons">info</span>
            <span class="audio-limit-text">Can be played <strong>twice only</strong>!</span>
          </span>
        </div>
      `;

      const playBtn = document.getElementById('playAudioBtn');
      const iconSpan = playBtn ? playBtn.querySelector('.audio-icon') : null;
      const counterValue = audioContainer.querySelector('.counter-value');

      // Clean up any previous audio instance
      if (audioContainer._audio) {
        try { audioContainer._audio.pause(); } catch (e) {}
        try { audioContainer._audio.src = ''; } catch (e) {}
      }

      // Create new audio instance with no autoplay
      const audio = new Audio(question.audio);
      audio.preload = 'none';  // Don't preload to avoid autoplay policy issues
      audio.muted = false;
      audio._hasBeenPlayed = false;  // Track if audio has started playing
      audio._playCountIncremented = false;  // Track if we've already counted this play session

      // Event listeners for UI updates only (no autoplay)
      audio.addEventListener('playing', () => {
        // Increment counter when audio STARTS playing (only once per play session)
        if (!audio._playCountIncremented) {
          const currentPlayCount = parseInt(sessionStorage.getItem(audioKey) || '0');
          if (currentPlayCount < 2) {
            const newPlayCount = currentPlayCount + 1;
            sessionStorage.setItem(audioKey, newPlayCount.toString());
            
            // Update counter display
            if (counterValue) counterValue.textContent = `${newPlayCount}/2`;
            
            // Disable button if we've reached the limit
            if (newPlayCount >= 2 && playBtn) {
              playBtn.disabled = true;
              const buttonText = document.getElementById('audioButtonText');
              if (buttonText) buttonText.textContent = 'Limit Reached';
            }
          }
          audio._playCountIncremented = true;
        }
        
        audio._hasBeenPlayed = true;  // Mark as having been played
        if (iconSpan) iconSpan.textContent = 'pause';
        const buttonText = document.getElementById('audioButtonText');
        if (buttonText) buttonText.textContent = 'Pause';
      });

      audio.addEventListener('pause', () => {
        if (iconSpan) iconSpan.textContent = 'play_arrow';
        const buttonText = document.getElementById('audioButtonText');
        // Show "Resume" if audio has been played before, otherwise "Play Audio"
        if (buttonText) buttonText.textContent = audio._hasBeenPlayed ? 'Resume Audio' : 'Play Audio';
      });

      audio.addEventListener('ended', () => {
        // Reset the flag when audio ends so next play session can be counted
        audio._playCountIncremented = false;
        
        if (iconSpan) iconSpan.textContent = 'play_arrow';
        const buttonText = document.getElementById('audioButtonText');
        if (buttonText) buttonText.textContent = 'Play Audio';
      });

      audioContainer._audio = audio;

      // Click handler - attach only once per audio instance to prevent double-counting
      if (playBtn && !audio._clickHandlerAttached) {
        audio._clickHandlerAttached = true;
        
        playBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          // Re-check play count
          const currentPlayCount = parseInt(sessionStorage.getItem(audioKey) || '0');
          if (currentPlayCount >= 2) {
            playBtn.disabled = true;
            const buttonText = document.getElementById('audioButtonText');
            if (buttonText) buttonText.textContent = 'Limit Reached';
            return;
          }

          // Check global sound mute
          try {
            if (window.SoundManager && typeof window.SoundManager.isEnabled === 'function' && !window.SoundManager.isEnabled()) {
              const buttonText = document.getElementById('audioButtonText');
              if (buttonText) buttonText.textContent = 'Sound Muted';
              return;
            }
          } catch (e) { console.warn('SoundManager check failed', e); }

          if (!audio) return;

          // Toggle play/pause - only track by button clicks for play attempt, count on 'ended' event
          if (audio.paused) {
            // Play audio

            const playPromise = audio.play();
            if (playPromise !== undefined) {
              playPromise.catch(err => {
                console.error('Audio play error:', err);
                const btnText = document.getElementById('audioButtonText');
                if (btnText) btnText.textContent = 'Playback blocked';
              });
            }
          } else {
            // Audio is playing - just pause (don't increment counter)
            try { audio.pause(); } catch (e) { console.warn('Pause failed', e); }
          }
        });
      }
    } else {
      // Remove any existing audio instance when no audio for question
      if (audioContainer._audio) {
        try { audioContainer._audio.pause(); } catch (e) {}
        try { audioContainer._audio.src = ''; } catch (e) {}
        audioContainer._audio = null;
      }
      audioContainer.innerHTML = '';
    }
  }
  
  displayOptions(options) {
    const optionsContainer = document.getElementById('optionsContainer');
    if (!optionsContainer) {
      console.error('Options container not found!');
      return;
    }
    
    optionsContainer.innerHTML = '';
    
    options.forEach((option, index) => {
      const optionElement = document.createElement('div');
      optionElement.className = 'option-item';
      optionElement.innerHTML = `
        <div class="option-marker">${String.fromCharCode(65 + index)}</div>
        <div class="option-text">${option}</div>
      `;
      
      if (!this.reviewMode) {
        optionElement.addEventListener('click', () => this.selectOption(index));
      }
      
      // Add click handler to any images within the option
      const optionImages = optionElement.querySelectorAll('img');
      optionImages.forEach(img => {
        img.classList.add('question-image');
        img.style.cursor = 'pointer';
        img.addEventListener('click', (e) => {
          e.stopPropagation();
          this.showQuickView(img.src);
        });
      });
      
      optionsContainer.appendChild(optionElement);
    });
  }
  
  selectOption(optionIndex) {
    if (this.reviewMode) return;
    
    document.querySelectorAll('.option-item').forEach(item => {
      item.classList.remove('selected');
    });
    
    document.querySelectorAll('.option-item')[optionIndex].classList.add('selected');
    this.userAnswers[this.currentQuestion] = optionIndex;
    // Play click sound for option selection (ensure consistent audio on selection)
    try { if (window.SoundManager && typeof window.SoundManager.playClick === 'function') window.SoundManager.playClick(); } catch (e) {}
    
    this.checkAllQuestionsAnswered();
  }
  
  restoreSelectedAnswer() {
    const selectedAnswer = this.userAnswers[this.currentQuestion];
    if (selectedAnswer !== null) {
      const optionItems = document.querySelectorAll('.option-item');
      if (optionItems[selectedAnswer]) {
        optionItems[selectedAnswer].classList.add('selected');
      }
    }
  }
  
  checkAllQuestionsAnswered() {
    const allAnswered = this.userAnswers.every(answer => answer !== null);
    const submitBtn = document.getElementById('submitBtn');
    if (allAnswered && submitBtn) {
      submitBtn.style.display = 'inline-flex';
    }
  }
  
  nextQuestion() {
    if (this.currentQuestion < this.testData.questions.length - 1) {
      this.currentQuestion++;
      this.displayQuestion();
      this.updateProgress();
      this.scrollToTestTitle();
    }
  }

  previousQuestion() {
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
      this.displayQuestion();
      this.updateProgress();
      this.scrollToTestTitle();
    }
  }
  
  updateProgress() {
    // Update the question counter at the top
    const questionCounter = document.getElementById('questionCounter');
    if (questionCounter) {
      questionCounter.textContent = 
        `Question ${this.currentQuestion + 1} of ${this.testData.questions.length}`;
    }
  }
  
  scrollToTestTitle() {
    // Scroll to the question container when navigating questions
    setTimeout(() => {
      const questionContainer = document.querySelector('.question-container');
      if (questionContainer) {
        const rect = questionContainer.getBoundingClientRect();
        const scrollTop = window.scrollY + rect.top - 50;
        window.scrollTo({ top: scrollTop, behavior: 'smooth' });
      }
    }, 100);
  }
  
  updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    const skipAllBtn = document.getElementById('skipAllBtn');
    
    if (prevBtn) prevBtn.disabled = this.currentQuestion === 0;
    if (nextBtn) nextBtn.disabled = this.currentQuestion === this.testData.questions.length - 1;
    
    if (this.currentQuestion === this.testData.questions.length - 1) {
      if (nextBtn) nextBtn.style.display = 'none';
      if (submitBtn) submitBtn.style.display = 'inline-flex';
      if (skipAllBtn) skipAllBtn.style.display = 'none';
    } else {
      if (nextBtn) nextBtn.style.display = 'inline-flex';
      if (submitBtn) submitBtn.style.display = 'none';
      if (skipAllBtn) skipAllBtn.style.display = 'inline-flex';
    }
  }
  
  // skipAllAndSubmit() - calls submitTest
  skipAllAndSubmit() {
    this.submitTest();
  }
  
  // submitTest() - Show confirmation modal before submission
  submitTest() {
    console.log('submitTest() called');
    this.showSubmissionModal();
  }

  // showSubmissionModal() - Display confirmation modal with stats
  showSubmissionModal() {
    console.log('showSubmissionModal() called');
    
    // Count answered and unanswered
    const answered = this.userAnswers.filter(ans => ans !== null).length;
    const unanswered = this.userAnswers.filter(ans => ans === null).length;
    const total = this.testData.questions.length;

    // Update modal stats
    document.getElementById('answeredCount').textContent = answered;
    document.getElementById('unansweredCount').textContent = unanswered;
    document.getElementById('totalCount').textContent = total;

    // Show modal
    const modal = document.getElementById('submissionModal');
    if (modal) {
      modal.classList.remove('hidden');
    }
  }

  // closeSubmissionModal() - Hide modal and return to quiz
  closeSubmissionModal() {
    console.log('closeSubmissionModal() called');
    const modal = document.getElementById('submissionModal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  // confirmSubmission() - Process submission and show results
  confirmSubmission() {
    console.log('confirmSubmission() called');
    
    // Hide modal
    const modal = document.getElementById('submissionModal');
    if (modal) {
      modal.classList.add('hidden');
    }

    // Stop the timer
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      this.timerRunning = false;
    }

    // Calculate results
    const score = this.calculateScore();
    const percentage = (score / this.testData.questions.length) * 100;
    const passed = percentage >= this.testData.passingScore;

    console.log('Score:', score, 'Percentage:', percentage.toFixed(1), 'Passed:', passed);

    // Show results
    this.displayResults(score, percentage, passed);
  }

  // calculateScore() - Calculate number of correct answers
  calculateScore() {
    let score = 0;
    this.testData.questions.forEach((question, index) => {
      if (this.userAnswers[index] === question.correctAnswer) {
        score++;
      }
    });
    return score;
  }

  // displayResults() - Show results page with score and breakdown
  displayResults(score, percentage, passed) {
    console.log('displayResults() called');
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Hide the timer display
    const timerContainer = document.querySelector('.timer-container');
    if (timerContainer) {
      timerContainer.style.display = 'none';
    }
    
    // Count incorrect and unanswered
    const incorrect = this.userAnswers.filter((answer, index) => 
      answer !== null && answer !== this.testData.questions[index].correctAnswer).length;
    const unanswered = this.userAnswers.filter(a => a === null).length;
    const total = this.testData.questions.length;
    
    const mainContent = document.querySelector('.main-content');
    
    mainContent.innerHTML = `
      <div class="results-container ${passed ? 'pass' : 'fail'}" style="padding: 2rem; max-width: 1200px; margin: 0 auto;">
        <!-- Header Section -->
        <div style="text-align: center; margin-bottom: 3rem;">
          <div style="display: inline-block; background: ${passed ? '#4CAF50' : '#f44336'}; color: white; border-radius: 50%; width: 120px; height: 120px; display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; box-shadow: 0 8px 24px rgba(0,0,0,0.15);">
            <span class="material-icons" style="font-size: 5rem;">${passed ? 'check_circle' : 'cancel'}</span>
          </div>
          <h1 style="margin: 0 0 0.5rem 0; font-size: 2.5rem; color: var(--on-surface);">${passed ? 'Test Passed! 🎉' : 'Test Failed'}</h1>
          <p style="margin: 0; color: var(--on-surface); opacity: 0.7; font-size: 1.1rem;">Your Score: <strong style="color: var(--primary); font-size: 1.3rem;">${percentage.toFixed(1)}%</strong></p>
        </div>

        <!-- Main Score Card -->
        <div style="background: var(--surface); border-radius: 16px; padding: 2rem; box-shadow: var(--shadow); margin-bottom: 2rem; border-top: 4px solid ${passed ? '#4CAF50' : '#f44336'};">
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem;">
            <!-- Correct Card -->
            <div style="text-align: center; padding: 1.5rem; background: #e8f5e9; border-radius: 12px; border-left: 4px solid #4CAF50;">
              <div style="font-size: 2.5rem; font-weight: bold; color: #2e7d32; margin-bottom: 0.5rem;">${score}</div>
              <div style="color: #558b2f; font-weight: 500;">Correct</div>
            </div>

            <!-- Incorrect Card -->
            <div style="text-align: center; padding: 1.5rem; background: #ffebee; border-radius: 12px; border-left: 4px solid #f44336;">
              <div style="font-size: 2.5rem; font-weight: bold; color: #c62828; margin-bottom: 0.5rem;">${incorrect}</div>
              <div style="color: #ad1457; font-weight: 500;">Incorrect</div>
            </div>

            <!-- Unanswered Card -->
            <div style="text-align: center; padding: 1.5rem; background: #fff3e0; border-radius: 12px; border-left: 4px solid #ff9800;">
              <div style="font-size: 2.5rem; font-weight: bold; color: #e65100; margin-bottom: 0.5rem;">${unanswered}</div>
              <div style="color: #bf360c; font-weight: 500;">Unanswered</div>
            </div>
          </div>

          <!-- Info Row -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; padding-top: 1.5rem; border-top: 1px solid var(--border);">
            <div>
              <div style="color: var(--on-surface); opacity: 0.7; font-size: 0.9rem; margin-bottom: 0.3rem;">Total Questions</div>
              <div style="font-size: 1.3rem; font-weight: bold; color: var(--primary);">${total}</div>
            </div>
            <div>
              <div style="color: var(--on-surface); opacity: 0.7; font-size: 0.9rem; margin-bottom: 0.3rem;">Passing Score</div>
              <div style="font-size: 1.3rem; font-weight: bold; color: var(--primary);">${this.testData.passingScore}%</div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;">
          <button id="reviewAnswersBtn" class="action-btn btn-primary" style="padding: 0.75rem 2rem; font-size: 1rem;">
            <span class="material-icons">visibility</span>
            Review Answers
          </button>
          <button id="retakeTestBtn" class="action-btn btn-secondary" style="padding: 0.75rem 2rem; font-size: 1rem;">
            <span class="material-icons">refresh</span>
            Retake Test
          </button>
          <a href="../../index.html" class="action-btn btn-secondary" style="padding: 0.75rem 2rem; font-size: 1rem; text-decoration: none;">
            <span class="material-icons">home</span>
            Home
          </a>
        </div>
      </div>
    `;

    // Add event listeners for action buttons
    setTimeout(() => {
      const reviewBtn = document.getElementById('reviewAnswersBtn');
      const retakeBtn = document.getElementById('retakeTestBtn');

      if (reviewBtn) {
        reviewBtn.addEventListener('click', () => this.showReviewMode());
      }

      if (retakeBtn) {
        retakeBtn.addEventListener('click', () => {
          location.reload();
        });
      }
    }, 100);
  }

  // showReviewMode() - Let students review all answers
  showReviewMode() {
    console.log('showReviewMode() called');
    
    const mainContent = document.querySelector('.main-content');
    let currentReviewQuestion = 0;

    const renderReviewQuestion = (index) => {
      const question = this.testData.questions[index];
      const userAnswer = this.userAnswers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      const isUnanswered = userAnswer === null;

      let answerStatus = '';
      if (isUnanswered) {
        answerStatus = '<span style="color: #ff9800; font-weight: bold;">⏭ Not Answered</span>';
      } else if (isCorrect) {
        answerStatus = '<span style="color: #4CAF50; font-weight: bold;">✓ Correct</span>';
      } else {
        answerStatus = '<span style="color: #f44336; font-weight: bold;">✗ Incorrect</span>';
      }

      mainContent.innerHTML = `
        <div class="review-container" style="max-width: 900px; margin: 0 auto; padding: 2rem;">
          <!-- Header -->
          <div style="margin-bottom: 2rem; text-align: center;">
            <h2 style="margin: 0 0 0.5rem 0; color: var(--on-surface);">Review Your Answers</h2>
            <p style="margin: 0; color: var(--on-surface); opacity: 0.7;">Question ${index + 1} of ${this.testData.questions.length}</p>
          </div>

          <!-- Question Card -->
          <div style="background: var(--surface); border-radius: 16px; padding: 2rem; box-shadow: var(--shadow); margin-bottom: 2rem; border-left: 4px solid ${isCorrect ? '#4CAF50' : isUnanswered ? '#ff9800' : '#f44336'};">
            
            <!-- Answer Status -->
            <div style="margin-bottom: 1.5rem; padding: 1rem; background: ${isCorrect ? '#e8f5e9' : isUnanswered ? '#fff3e0' : '#ffebee'}; border-radius: 8px; text-align: center;">
              ${answerStatus}
            </div>

            <!-- Question Text -->
            <div style="margin-bottom: 1.5rem;">
              <h3 style="margin: 0 0 1rem 0; color: var(--on-surface); font-size: 1.2rem;">${question.text}</h3>
              ${question.image ? `<img src="${question.image}" alt="Question image" style="max-width: 100%; border-radius: 8px; margin-bottom: 1rem;">` : ''}
            </div>

            <!-- Options -->
            <div style="margin-bottom: 1.5rem;">
              <div style="color: var(--on-surface); opacity: 0.7; font-weight: 500; margin-bottom: 0.75rem;">Options:</div>
              ${question.options.map((option, idx) => {
                let optionStyle = 'padding: 1rem; margin-bottom: 0.75rem; border-radius: 8px; border-left: 4px solid var(--border);';
                let isUserAnswer = userAnswer === idx;
                let isCorrectAnswer = idx === question.correctAnswer;

                if (isUserAnswer && isCorrectAnswer) {
                  optionStyle += 'background: #e8f5e9; border-left-color: #4CAF50;';
                } else if (isUserAnswer && !isCorrectAnswer) {
                  optionStyle += 'background: #ffebee; border-left-color: #f44336;';
                } else if (isCorrectAnswer && !isUnanswered) {
                  optionStyle += 'background: #f1f8e9; border-left-color: #8bc34a;';
                }

                return `
                  <div style="${optionStyle}">
                    <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
                      <span style="color: var(--on-surface); margin-top: 0.2rem;">
                        ${isUserAnswer && isCorrect ? '✓' : isUserAnswer && !isCorrect ? '✗' : isCorrectAnswer && !isUnanswered ? '→' : '•'}
                      </span>
                      <span style="flex: 1;">${option}</span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Explanation (Optional) -->
            ${!isUnanswered ? `
              <div style="padding: 1rem; background: var(--background); border-radius: 8px; border-left: 4px solid var(--primary);">
                <div style="color: var(--on-surface); opacity: 0.7; font-weight: 500; margin-bottom: 0.5rem;">Answer Summary:</div>
                <div style="color: var(--on-surface);">
                  Your answer: <strong>${question.options[userAnswer]}</strong><br>
                  Correct answer: <strong>${question.options[question.correctAnswer]}</strong>
                </div>
              </div>
            ` : `
              <div style="padding: 1rem; background: var(--background); border-radius: 8px; border-left: 4px solid #ff9800;">
                <div style="color: #ff9800; font-weight: 500;">You did not answer this question</div>
                <div style="color: var(--on-surface); margin-top: 0.5rem;">Correct answer: <strong>${question.options[question.correctAnswer]}</strong></div>
              </div>
            `}
          </div>

          <!-- Navigation -->
          <div style="display: flex; gap: 1rem; justify-content: space-between; flex-wrap: wrap;">
            <button id="reviewPrevBtn" class="nav-btn" ${index === 0 ? 'disabled' : ''} style="flex: 1; min-width: 120px;">
              <span class="material-icons">arrow_back</span>
              Previous
            </button>
            <div style="flex: 1; display: flex; align-items: center; justify-content: center; color: var(--on-surface); font-weight: 500;">
              Question ${index + 1} / ${this.testData.questions.length}
            </div>
            <button id="reviewNextBtn" class="nav-btn" ${index === this.testData.questions.length - 1 ? 'disabled' : ''} style="flex: 1; min-width: 120px;">
              Next
              <span class="material-icons">arrow_forward</span>
            </button>
          </div>

          <!-- Back to Results -->
          <div style="text-align: center; margin-top: 2rem;">
            <button id="backToResultsBtn" class="btn-secondary" style="padding: 0.75rem 2rem;">
              <span class="material-icons">arrow_back</span>
              Back to Results
            </button>
          </div>
        </div>
      `;

      // Add navigation listeners
      setTimeout(() => {
        const prevBtn = document.getElementById('reviewPrevBtn');
        const nextBtn = document.getElementById('reviewNextBtn');
        const backBtn = document.getElementById('backToResultsBtn');

        if (prevBtn && index > 0) {
          prevBtn.addEventListener('click', () => renderReviewQuestion(index - 1));
        }

        if (nextBtn && index < this.testData.questions.length - 1) {
          nextBtn.addEventListener('click', () => renderReviewQuestion(index + 1));
        }

        if (backBtn) {
          backBtn.addEventListener('click', () => {
            const score = this.calculateScore();
            const percentage = (score / this.testData.questions.length) * 100;
            const passed = percentage >= this.testData.passingScore;
            this.displayResults(score, percentage, passed);
          });
        }
      }, 50);
    };

    renderReviewQuestion(currentReviewQuestion);
  }
  
  
  returnToQuiz() {
    console.log('returnToQuiz() called');
    
    // Restore timer display
    const timerContainer = document.querySelector('.timer-container');
    if (timerContainer) {
      timerContainer.style.display = 'block';
    }
    
    // Redraw the question
    const mainContent = document.querySelector('.main-content');
    mainContent.innerHTML = '';
    this.displayQuestion();
  }
  
  finalizeSubmission() {
    // Guard: prevent multiple finalizations
    if (this.testCompleted) {
      console.log('Test already completed, ignoring duplicate finalization');
      return;
    }
    
    console.log('Finalizing submission...');
    this.testCompleted = true;
    this.submissionInProgress = false;
    
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      this.timerRunning = false;
    }
    
    const score = this.calculateScore();
    const percentage = (score / this.testData.questions.length) * 100;
    const passed = percentage >= this.testData.passingScore;
    
    console.log('Score:', score, 'Percentage:', percentage, 'Passed:', passed);
    
    // Show results to the user
    this.displayResults(score, percentage, passed);
  }
  
  calculateScore() {
    let score = 0;
    
    this.testData.questions.forEach((question, index) => {
      if (this.userAnswers[index] === question.correctAnswer) {
        score++;
      }
    });
    
    return score;
  }
  
  displayResults(score, percentage, passed) {
    // Scroll to top to show results
    window.scrollTo(0, 0);
    
    // Hide the timer display when showing results
    const timerContainer = document.querySelector('.timer-container');
    if (timerContainer) {
      timerContainer.style.display = 'none';
    }
    
    const mainContent = document.querySelector('.main-content');
    const incorrect = this.userAnswers.filter((answer, index) => 
      answer !== null && answer !== this.testData.questions[index].correctAnswer).length;
    const unanswered = this.userAnswers.filter(a => a === null).length;
    
    mainContent.innerHTML = `
      <div class="results-container ${passed ? 'pass' : 'fail'}" style="padding: 2rem;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start; margin-bottom: 2rem;">
          <!-- Left: Main Score Card -->
          <div style="background: linear-gradient(135deg, ${passed ? '#4CAF50' : '#f44336'} 0%, ${passed ? '#45a049' : '#da190b'} 100%); 
                      border-radius: 16px; padding: 2rem; color: white; text-align: center; box-shadow: 0 8px 24px rgba(0,0,0,0.15);">
            <div style="margin-bottom: 1rem;">
              <span class="material-icons" style="font-size: 4rem; display: block;">${passed ? 'check_circle' : 'cancel'}</span>
            </div>
            <h2 style="margin: 0 0 0.5rem 0; font-size: 1.5rem;">${passed ? 'Passed! 🎉' : 'Failed'}</h2>
            <div style="font-size: 3rem; font-weight: bold; margin: 1rem 0;">${percentage.toFixed(1)}%</div>
            <div style="font-size: 1.2rem; opacity: 0.9;">${score}/${this.testData.questions.length} Correct</div>
            <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.3); font-size: 0.9rem;">
              Passing Score: ${this.testData.passingScore}%
            </div>
          </div>
          
          <!-- Right: Stats Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div style="background: #e8f5e9; border-radius: 12px; padding: 1.5rem; text-align: center;">
              <div style="font-size: 2rem; font-weight: bold; color: #2e7d32; margin-bottom: 0.5rem;">${score}</div>
              <div style="color: #558b2f; font-weight: 500;">Correct</div>
            </div>
            <div style="background: #ffebee; border-radius: 12px; padding: 1.5rem; text-align: center;">
              <div style="font-size: 2rem; font-weight: bold; color: #c62828; margin-bottom: 0.5rem;">${incorrect}</div>
              <div style="color: #ad1457; font-weight: 500;">Incorrect</div>
            </div>
            <div style="background: #fff3e0; border-radius: 12px; padding: 1.5rem; text-align: center;">
              <div style="font-size: 2rem; font-weight: bold; color: #e65100; margin-bottom: 0.5rem;">${unanswered}</div>
              <div style="color: #bf360c; font-weight: 500;">Unanswered</div>
            </div>
            <div style="background: #f3e5f5; border-radius: 12px; padding: 1.5rem; text-align: center;">
              <div style="font-size: 2rem; font-weight: bold; color: #6a1b9a; margin-bottom: 0.5rem;">${this.testData.questions.length}</div>
              <div style="color: #7b1fa2; font-weight: 500;">Total</div>
            </div>
            <div style="background: #e0f2f1; border-radius: 12px; padding: 1.5rem; text-align: center; grid-column: 1 / -1;">
              <div style="color: #00695c; font-weight: 500; margin-bottom: 0.3rem;">Time Taken</div>
              <div style="font-size: 1.5rem; font-weight: bold; color: #004d40;">${this.formatTimeTaken()}</div>
            </div>
          </div>
        </div>
      `;

      // Append the action buttons outside the results container
      const actionsHtml = `
        <div class="results-actions-outside" style="max-width:1100px;margin:1rem auto;">
          <button class="action-btn btn-primary" id="reviewBtn">
            <span class="material-icons">visibility</span>
            Review Answers
          </button>
          <button class="action-btn btn-secondary" id="retakeBtn">
            <span class="material-icons">refresh</span>
            Retake Test
          </button>
          <a href="../../index.html" class="action-btn btn-secondary" aria-label="Home">
            <span class="material-icons" aria-hidden="true">home</span>
            Home
          </a>
        </div>
      `;

      mainContent.insertAdjacentHTML('beforeend', actionsHtml);

    // Add small delay to ensure elements are in the DOM
    setTimeout(() => {
      const reviewBtn = document.getElementById('reviewBtn');
      const retakeBtn = document.getElementById('retakeBtn');
      
      if (reviewBtn) {
        reviewBtn.addEventListener('click', () => this.startReviewMode());
      } else {
        console.error('Review button not found');
      }
      
      if (retakeBtn) {
        retakeBtn.addEventListener('click', () => this.retakeTest());
      } else {
        console.error('Retake button not found');
      }
    }, 100);
  }
  
  startReviewMode() {
    this.reviewMode = true;
    this.currentQuestion = 0;
    
    const mainContent = document.querySelector('.main-content');
    mainContent.innerHTML = `
      <div class="test-container">
        <div class="test-header">
          <div class="test-title-container">
            <h1 class="test-title">${this.testData.title} - Review</h1>
            <p class="test-subtitle" style="color: var(--primary);">Review Mode - See your answers and correct solutions</p>
          </div>
          <div class="review-stats">
            <div class="review-score">Score: ${this.calculateScore()}/${this.testData.questions.length}</div>
          </div>
        </div>

        <div class="question-container">
          <!-- Question Counter for Review Mode -->
          <div class="question-counter-container">
            <div class="question-counter" id="reviewQuestionCounter">Question 1 of ${this.testData.questions.length}</div>
          </div>
          
          <div class="question-text" id="questionText"></div>
          
          <img id="questionImage" class="question-image" style="display: none;" alt="Question image">
          
          <div class="options-container" id="optionsContainer"></div>
          
          <div class="answer-feedback" id="answerFeedback"></div>
          
          <div class="navigation-controls">
            <button class="nav-btn" id="prevBtn">
              <span class="material-icons">arrow_back</span>
              Previous
            </button>
            
            <button class="nav-btn" id="nextBtn">
              Next
              <span class="material-icons">arrow_forward</span>
            </button>
            
            <button class="nav-btn" id="exitReviewBtn" style="background: #6c757d;">
              <span class="material-icons">exit_to_app</span>
              Exit Review
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.getElementById('prevBtn').addEventListener('click', () => this.previousQuestion());
    document.getElementById('nextBtn').addEventListener('click', () => this.nextQuestion());
    document.getElementById('exitReviewBtn').addEventListener('click', () => this.exitReviewMode());
    
    this.displayQuestion();
  }
  
  updateReviewModeDisplay() {
    if (!this.reviewMode) return;
    
    const question = this.testData.questions[this.currentQuestion];
    const userAnswer = this.userAnswers[this.currentQuestion];
    const correctAnswer = question.correctAnswer;
    
    // Update review mode question counter
    const reviewQuestionCounter = document.getElementById('reviewQuestionCounter');
    if (reviewQuestionCounter) {
      reviewQuestionCounter.textContent = 
        `Question ${this.currentQuestion + 1} of ${this.testData.questions.length}`;
    }
    
    document.querySelectorAll('.option-item').forEach((item, index) => {
      item.classList.remove('correct', 'incorrect', 'selected-correct', 'selected-incorrect');
      
      if (index === correctAnswer) {
        item.classList.add('correct');
      }
      
      if (userAnswer === index) {
        if (index === correctAnswer) {
          item.classList.add('selected-correct');
        } else {
          item.classList.add('selected-incorrect');
        }
      }
    });
    
    const feedbackElement = document.getElementById('answerFeedback');
    if (userAnswer === null) {
      feedbackElement.innerHTML = `
        <div class="feedback unanswered">
          <span class="material-icons">help_outline</span>
          <span>You did not answer this question</span>
        </div>
        <div class="feedback correct-answer">
          <span class="material-icons">check_circle</span>
          <span>Correct answer: <strong>${String.fromCharCode(65 + correctAnswer)}</strong></span>
        </div>
      `;
    } else if (userAnswer === correctAnswer) {
      feedbackElement.innerHTML = `
        <div class="feedback correct">
          <span class="material-icons">check_circle</span>
          <span>Your answer is <strong>correct!</strong> Well done! 🎉</span>
        </div>
      `;
    } else {
      feedbackElement.innerHTML = `
        <div class="feedback incorrect">
          <span class="material-icons">cancel</span>
          <span>Your answer: <strong>${String.fromCharCode(65 + userAnswer)}</strong> is incorrect</span>
        </div>
        <div class="feedback correct-answer">
          <span class="material-icons">check_circle</span>
          <span>Correct answer: <strong>${String.fromCharCode(65 + correctAnswer)}</strong></span>
        </div>
      `;
    }
  }
  
  exitReviewMode() {
    this.reviewMode = false;
    this.displayResults(this.calculateScore(), (this.calculateScore() / this.testData.questions.length) * 100, 
                      (this.calculateScore() / this.testData.questions.length) * 100 >= this.testData.passingScore);
  }
  
  formatTimeTaken() {
    const endTime = new Date();
    const timeDiff = endTime - this.startTime;
    const minutes = Math.floor(timeDiff / 60000);
    const seconds = Math.floor((timeDiff % 60000) / 1000);
    
    return `${minutes}m ${seconds}s`;
  }
  
  retakeTest() {
    this.showCustomConfirmation(
      '🔄 Retake Test?',
      'Are you sure you want to retake this test?<br><br>Your previous answers will be cleared and you\'ll start from Question 1.',
      'Retake Test',
      'Cancel',
      () => {
        // Clear all audio played states from sessionStorage
        const keys = Object.keys(sessionStorage);
        keys.forEach(key => {
          if (key.startsWith('audio_played_')) {
            sessionStorage.removeItem(key);
          }
        });
        window.location.reload();
      }
    );
  }

  showQuickView(imageSrc) {
    const overlay = document.getElementById('imageQuickView');
    const img = document.getElementById('quickviewImage');
    const closeBtn = document.getElementById('quickviewCloseBtn');
    const zoomInBtn = document.getElementById('quickviewZoomInBtn');
    const zoomOutBtn = document.getElementById('quickviewZoomOutBtn');
    const zoomResetBtn = document.getElementById('quickviewZoomResetBtn');
    const zoomLevelDisplay = document.getElementById('quickviewZoomLevel');

    if (!overlay || !img || !closeBtn) {
      console.error('Quick view elements not found');
      return;
    }

    // Initialize zoom level
    let zoomLevel = 100;
    const MIN_ZOOM = 50;
    const MAX_ZOOM = 300;
    const ZOOM_STEP = 25;

    // Reset image transform before setting new image
    img.style.transform = 'scale(1)';
    if (zoomLevelDisplay) {
      zoomLevelDisplay.textContent = '100%';
    }

    // Set image source
    img.src = imageSrc;

    // Show overlay with active class
    overlay.classList.add('active');

    // Update zoom display
    const updateZoomDisplay = () => {
      if (zoomLevelDisplay) {
        zoomLevelDisplay.textContent = zoomLevel + '%';
      }
      img.style.transform = `scale(${zoomLevel / 100})`;
    };

    // Zoom in
    const zoomIn = () => {
      if (zoomLevel < MAX_ZOOM) {
        zoomLevel = Math.min(zoomLevel + ZOOM_STEP, MAX_ZOOM);
        updateZoomDisplay();
      }
    };

    // Zoom out
    const zoomOut = () => {
      if (zoomLevel > MIN_ZOOM) {
        zoomLevel = Math.max(zoomLevel - ZOOM_STEP, MIN_ZOOM);
        updateZoomDisplay();
      }
    };

    // Reset zoom
    const zoomReset = () => {
      zoomLevel = 100;
      updateZoomDisplay();
    };

    // Pan/Drag handlers for mouse and touch
    const imageWrapper = document.querySelector('.quickview-image-wrapper');
    let isPanning = false;
    let panStartX = 0;
    let panStartY = 0;
    let scrollLeftStart = 0;
    let scrollTopStart = 0;

    const startPan = (clientX, clientY) => {
      if (zoomLevel > 100 && imageWrapper) {
        isPanning = true;
        panStartX = clientX;
        panStartY = clientY;
        // Get scroll position of the wrapper
        scrollLeftStart = imageWrapper.scrollLeft;
        scrollTopStart = imageWrapper.scrollTop;
      }
    };

    const movePan = (clientX, clientY) => {
      if (!isPanning || !imageWrapper) return;
      
      const deltaX = panStartX - clientX;
      const deltaY = panStartY - clientY;
      
      // Update scroll position
      imageWrapper.scrollLeft = scrollLeftStart + deltaX;
      imageWrapper.scrollTop = scrollTopStart + deltaY;
    };

    const endPan = () => {
      isPanning = false;
    };

    // Mouse drag handlers
    const mouseDownHandler = (e) => {
      startPan(e.clientX, e.clientY);
    };

    const mouseMoveHandler = (e) => {
      movePan(e.clientX, e.clientY);
    };

    const mouseUpHandler = () => {
      endPan();
    };

    // Touch drag handlers
    const touchStartHandler = (e) => {
      if (e.touches.length > 0) {
        startPan(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const touchMoveHandler = (e) => {
      if (e.touches.length > 0) {
        e.preventDefault();
        movePan(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const touchEndHandler = () => {
      endPan();
    };

    // Close handler
    const closeHandler = () => {
      overlay.classList.remove('active');
      closeBtn.removeEventListener('click', closeHandler);
      document.removeEventListener('keydown', escapeHandler);
      overlay.removeEventListener('click', overlayClickHandler);
      if (zoomInBtn) zoomInBtn.removeEventListener('click', zoomIn);
      if (zoomOutBtn) zoomOutBtn.removeEventListener('click', zoomOut);
      if (zoomResetBtn) zoomResetBtn.removeEventListener('click', zoomReset);
      if (imageWrapper) {
        imageWrapper.removeEventListener('mousedown', mouseDownHandler);
        imageWrapper.removeEventListener('touchstart', touchStartHandler);
      }
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
      document.removeEventListener('touchmove', touchMoveHandler);
      document.removeEventListener('touchend', touchEndHandler);
      overlay.removeEventListener('wheel', wheelHandler);
    };

    // Close on Escape key
    const escapeHandler = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();  // Prevent bubbling to other handlers
        closeHandler();
      }
    };

    // Close on overlay click (outside image)
    const overlayClickHandler = (e) => {
      if (e.target === overlay) {
        closeHandler();
      }
    };

    closeBtn.addEventListener('click', closeHandler);
    document.addEventListener('keydown', escapeHandler);
    overlay.addEventListener('click', overlayClickHandler);

    // Add zoom button listeners if they exist
    if (zoomInBtn) zoomInBtn.addEventListener('click', zoomIn);
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', zoomOut);
    if (zoomResetBtn) zoomResetBtn.addEventListener('click', zoomReset);

    // Also allow mouse wheel zoom
    const wheelHandler = (e) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        zoomIn();
      } else {
        zoomOut();
      }
    };

    overlay.addEventListener('wheel', wheelHandler, { passive: false });

    // Add pan/drag event listeners
    if (imageWrapper) {
      imageWrapper.addEventListener('mousedown', mouseDownHandler);
      imageWrapper.addEventListener('touchstart', touchStartHandler, { passive: false });
    }
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
    document.addEventListener('touchmove', touchMoveHandler, { passive: false });
    document.addEventListener('touchend', touchEndHandler);

    const originalCloseHandler = closeHandler;
    closeHandler = () => {
      overlay.removeEventListener('wheel', wheelHandler);
      originalCloseHandler();
    };
  }
}

// Make MockTest available globally
window.MockTest = MockTest;

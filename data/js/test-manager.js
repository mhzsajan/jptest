// Enhanced MockTest class in data/js/test-manager.js
class MockTest {
  constructor(testData) {
    this.testData = testData;
    this.currentQuestion = 0;
    this.userAnswers = new Array(testData.questions.length).fill(null);
    this.timer = null;
    this.timeLeft = testData.duration * 60;
    this.warningPlayed = {
      fifteen: false,
      five: false
    };
    this.startTime = new Date();
    this.testCompleted = false;
    this.reviewMode = false;
    
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
  }
  
  confirmHomeNavigation() {
    if (this.testCompleted) {
      window.location.href = "../../index.html";
      return;
    }
    
    const confirmed = confirm("⚠️ Are you sure you want to leave this test?\n\nYour current progress will be lost and you'll need to start over.\n\nClick OK to go home, Cancel to continue testing.");
    if (confirmed) {
      window.location.href = "../../index.html";
    }
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
    
    if (submitBtn) {
      submitBtn.addEventListener('click', () => this.showSubmitWarning());
      console.log('Submit button listener added');
    }
    
    // Skip All & Submit button
    const skipAllBtn = document.getElementById('skipAllBtn');
    if (skipAllBtn) {
      skipAllBtn.addEventListener('click', () => this.skipAllAndSubmit());
      console.log('Skip All & Submit button listener added');
    }
  }

  showSubmitWarning() {
    const unanswered = this.userAnswers.filter(answer => answer === null).length;
    const answered = this.userAnswers.length - unanswered;
    
    if (unanswered === 0) {
      this.confirmSubmit();
      return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'warning-modal';
    modal.innerHTML = `
      <div class="modal-content submit-warning">
        <div class="modal-icon">
          <span class="material-icons">warning</span>
        </div>
        <h3 class="modal-title">Wait! You Have Unanswered Questions</h3>
        <div class="modal-stats">
          <div class="modal-stat-item">
            <span class="modal-stat-value" style="color: #4caf50;">${answered}</span>
            <span class="modal-stat-label">Answered</span>
          </div>
          <div class="modal-stat-item">
            <span class="modal-stat-value" style="color: #ff9800;">${unanswered}</span>
            <span class="modal-stat-label">Unanswered</span>
          </div>
          <div class="modal-stat-item">
            <span class="modal-stat-value">${this.userAnswers.length}</span>
            <span class="modal-stat-label">Total</span>
          </div>
        </div>
        <p class="modal-message">
          You still have <strong>${unanswered} unanswered question(s)</strong>. 
          Unanswered questions will be marked as incorrect.
        </p>
        <div class="modal-actions">
          <button class="modal-btn secondary" id="continueTestBtn">
            <span class="material-icons">arrow_back</span>
            Continue Test
          </button>
          <button class="modal-btn primary" id="confirmSubmitBtn">
            <span class="material-icons">check_circle</span>
            Submit Anyway
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('continueTestBtn').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    document.getElementById('confirmSubmitBtn').addEventListener('click', () => {
      document.body.removeChild(modal);
      this.submitTest();
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  }
  
  startTimer() {
    console.log('Starting timer...', this.timeLeft, 'seconds remaining');
    this.updateTimerDisplay();
    
    this.timer = setInterval(() => {
      this.timeLeft--;
      this.updateTimerDisplay();
      
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
    
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    timerDisplay.classList.remove('timer-warning', 'timer-critical');
    
    if (this.timeLeft <= 5 * 60) {
      timerDisplay.classList.add('timer-critical');
    } else if (this.timeLeft <= 15 * 60) {
      timerDisplay.classList.add('timer-warning');
    }
  }
  
  playWarningSound(type) {
    console.log(`${type}-minute warning`);
    
    try {
      const audio = new Audio('../../data/sound/ui/timer-beep.mp3');
      audio.volume = 0.7;
      audio.play().catch((error) => {
        console.warn('Could not play warning sound:', error);
      });
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
      background: #ff9800;
      color: white;
      padding: 1rem 2rem;
      border-radius: 8px;
      font-weight: bold;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      font-size: 1.2rem;
    `;
    warning.textContent = `⏰ ${minutes} minutes remaining!`;
    
    document.body.appendChild(warning);
    
    setTimeout(() => {
      if (document.body.contains(warning)) {
        document.body.removeChild(warning);
      }
    }, 3000);
  }
  
  timeUp() {
    clearInterval(this.timer);
    this.submitTest();
    alert("⏰ Time's up! Your test has been automatically submitted.");
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
      // Audio container not present on this test page, skip audio functionality
      return;
    }

    if (question.audio) {
      // Mark this question as having audio
      const audioKey = `audio_played_q${this.currentQuestion}`;
      const playCount = parseInt(sessionStorage.getItem(audioKey) || '0');
      const canPlay = playCount < 2;

      audioContainer.innerHTML = `
        <div class="audio-player">
          <button class="audio-btn" id="playAudioBtn" ${!canPlay ? 'disabled' : ''}>
            <span class="material-icons">play_arrow</span>
            <span id="audioButtonText">${!canPlay ? 'Audio Played (Twice)' : 'Play Audio'}</span>
          </button>
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

      const playBtn = document.getElementById('playAudioBtn');
      if (playBtn) {
        if (canPlay) {
          // Audio can still be played - make it playable
          playBtn.addEventListener('click', () => {
            const audio = document.getElementById('questionAudio');
            if (audio) {
              audio.play().catch(error => {
                console.warn('Audio playback failed:', error);
              });
              const newPlayCount = parseInt(sessionStorage.getItem(audioKey) || '0') + 1;
              sessionStorage.setItem(audioKey, newPlayCount.toString());
              
              if (newPlayCount >= 2) {
                playBtn.disabled = true;
                const buttonText = document.getElementById('audioButtonText');
                if (buttonText) buttonText.textContent = 'Audio Played (Twice)';
              }
            }
          });
        }
        // If already played twice, button stays disabled - no event listener added
      }
    } else {
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
  
  skipAllAndSubmit() {
    const answered = this.userAnswers.filter(answer => answer !== null).length;
    const unanswered = this.userAnswers.length - answered;
    
    if (unanswered > 0) {
      const confirmed = confirm(
        `🚀 Skip All & Submit?\n\nYou have answered ${answered} out of ${this.userAnswers.length} questions.\n\n${unanswered} questions will be marked as unanswered.\n\nClick OK to submit immediately.`
      );
      
      if (!confirmed) return;
    }
    
    this.submitTest();
  }
  
  confirmSubmit() {
    const unanswered = this.userAnswers.filter(answer => answer === null).length;
    
    if (unanswered > 0) {
      const confirmed = confirm(
        `You have ${unanswered} unanswered question(s). Are you sure you want to submit?`
      );
      
      if (!confirmed) return;
    }
    
    this.submitTest();
  }
  
  submitTest() {
    clearInterval(this.timer);
    this.testCompleted = true;
    
    const score = this.calculateScore();
    const percentage = (score / this.testData.questions.length) * 100;
    const passed = percentage >= this.testData.passingScore;
    
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

    document.getElementById('reviewBtn').addEventListener('click', () => this.startReviewMode());
    document.getElementById('retakeBtn').addEventListener('click', () => this.retakeTest());
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
    if (confirm('Are you sure you want to retake this test?')) {
      // Clear all audio played states from sessionStorage
      const keys = Object.keys(sessionStorage);
      keys.forEach(key => {
        if (key.startsWith('audio_played_')) {
          sessionStorage.removeItem(key);
        }
      });
      window.location.reload();
    }
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
// Toggle dark mode
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDarkMode);
  
  // Update button icon
  const icon = document.getElementById('darkModeIcon');
  if (icon) {
    icon.textContent = isDarkMode ? 'light_mode' : 'dark_mode';
  }
}

// Toggle dropdown - fixed to only affect the clicked dropdown
function toggleDropdown(headerElement) {
  const dropdownContent = headerElement.nextElementSibling;
  const icon = headerElement.querySelector('.dropdown-icon');
  
  if (dropdownContent && icon) {
    // Toggle the clicked dropdown
    const isExpanded = dropdownContent.classList.toggle('show');
    icon.classList.toggle('rotated');
    
    // Update ARIA attribute
    headerElement.setAttribute('aria-expanded', isExpanded);
  }
}

// Close dropdowns when clicking outside
function closeDropdowns(event) {
  if (!event.target.closest('.dropdown-container')) {
    document.querySelectorAll('.dropdown-content').forEach(content => {
      content.classList.remove('show');
    });
    document.querySelectorAll('.dropdown-icon').forEach(icon => {
      icon.classList.remove('rotated');
    });
    document.querySelectorAll('.dropdown-header').forEach(header => {
      header.setAttribute('aria-expanded', 'false');
    });
  }
}

// Sound management functions
const SoundManager = {
  enabled: true,
  // Small pool to handle rapid UI clicks without cutting playback
  _clickPool: [],
  _clickPoolIndex: 0,
  _clickPoolSize: 6,
  
  // Toggle sound on/off
  toggle: function() {
    this.enabled = !this.enabled;
    localStorage.setItem('soundEnabled', this.enabled);
    return this.enabled;
  },
  
  // Initialize sound settings
  init: function() {
    const soundEnabled = localStorage.getItem('soundEnabled');
    if (soundEnabled !== null) {
      this.enabled = soundEnabled === 'true';
    // Custom warning popup for Refresh and Back button
    }
    // Preload a small pool of click Audio elements to allow overlapping clicks
    try {
      const clickPath = '../../data/sound/ui/click.wav';
      for (let i = 0; i < this._clickPoolSize; i++) {
        const a = new Audio(clickPath);
        a.preload = 'auto';
        // Some browsers require load() to start fetching
        try { a.load(); } catch (e) {}
        this._clickPool.push(a);
      }
    } catch (e) {
      this._clickPool = [];
    }
  },
  
  // Play sound with error handling
  playSound: function(soundPath) {
    if (!this.enabled) return null;
    
    try {
      const audio = new Audio(soundPath);
      audio.volume = 0.7;
      audio.play().catch(error => {
        if (soundPath.endsWith('.wav')) {
          const alt = soundPath.replace(/\.wav$/i, '.mp3');
          const altAudio = new Audio(alt);
          altAudio.volume = 0.7;
          altAudio.play().catch(err2 => {});
          return altAudio;
        }
      });
      return audio;
    } catch (error) {
      return null;
    }
  },
  
  // Play UI sounds - FIXED PATHS
  playClick: function() {
    if (!this.enabled) return null;

    // If pool available, play next audio element to allow overlapping
    if (this._clickPool && this._clickPool.length) {
      try {
        const a = this._clickPool[this._clickPoolIndex];
        // reset and play; if already playing, clone and play as fallback
        if (a) {
          try {
            a.currentTime = 0;
            a.play().catch(err => {
              // fallback: try cloning
              try {
                const clone = a.cloneNode();
                clone.play().catch(() => {});
              } catch (e) {}
            });
          } catch (e) {
            // some browsers may throw when resetting currentTime while not ready
            try { const clone = a.cloneNode(); clone.play().catch(() => {}); } catch (ee) {}
          }
        }
        this._clickPoolIndex = (this._clickPoolIndex + 1) % this._clickPool.length;
        return a;
      } catch (err) {
        console.warn('Click pool play failed, falling back:', err);
        return this.playSound('../../data/sound/ui/click.wav');
      }
    }

    // fallback to one-off play
    return this.playSound('../../data/sound/ui/click.wav');
  },
  
  playSuccess: function() {
    return this.playSound('../../data/sound/ui/success.wav');
  },
  
  playError: function() {
    return this.playSound('../../data/sound/ui/error.wav');
  },
  
  playTimerBeep: function() {
    return this.playSound('../../data/sound/ui/timer-beep.mp3');
  },
  
  // Play question audio (for listening tests)
  playQuestionAudio: function(testType, audioFile) {
    return this.playSound(`../../data/sound/questions/${testType}/${audioFile}`);
  },
  
  // Get current sound status
  isEnabled: function() {
    return this.enabled;
  }
};

// Utility function to get current test type from URL
function getCurrentTestType() {
  const path = window.location.pathname;
  if (path.includes('/food-service/')) return 'food-service';
  if (path.includes('/agriculture/')) return 'agriculture';
  if (path.includes('/nursing-care-nepali-1/')) return 'nursing-care';
  if (path.includes('/nursing-care-nepali-2/')) return 'nursing-care';
  if (path.includes('/nursing-care-japanese-1/')) return 'nursing-care';
  if (path.includes('/nursing-care-japanese-2/')) return 'nursing-care';
  if (path.includes('/jft-basic-1/')) return 'jft-basic';
  if (path.includes('/jft-basic-2/')) return 'jft-basic';
  if (path.includes('/jft-basic-3/')) return 'jft-basic';
  if (path.includes('/jft-basic-4/')) return 'jft-basic';
  return 'unknown';
}



  // Add click sound to navigation buttons and option items.
  // Use `closest()` so clicks on inner elements (like `.option-text`) still trigger the sound.
  function addClickSounds() {
    document.addEventListener('click', function(e) {
      if (!SoundManager.isEnabled()) return;

      // Consider typical interactive targets and option elements
      const el = e.target.closest('button, .nav-btn, .action-btn, .option-item, .option-marker, .option-text');
      if (!el) return;

      // Do not play click for control buttons (like sound toggle) to avoid double sounds
      if (el.classList && el.classList.contains('control-btn')) return;

      SoundManager.playClick();
    });
  }

// Initialize when page loads
document.addEventListener('DOMContentLoaded', async function() {
  // Initialize sound manager
  SoundManager.init();
  
  // Add click sounds to buttons
  addClickSounds();
  
  // Add keyboard support for dropdowns
  document.querySelectorAll('.dropdown-header').forEach(header => {
    header.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleDropdown(this);
      }
    });
  });
  
  // Add click outside listener for dropdowns
  document.addEventListener('click', closeDropdowns);
  
  // Add skip link functionality
  const skipLink = document.querySelector('.skip-link');
  const mainContent = document.getElementById('main-content');

  if (skipLink && mainContent) {
    skipLink.addEventListener('click', function(e) {
      e.preventDefault();
      mainContent.setAttribute('tabindex', '-1');
      mainContent.focus();
    });
  }

  // Initialize control bar
  initializeControlBar();
});

// Initialize control bar with time update and button handlers
function initializeControlBar() {
  // Initialize bottom bar only
  initializeBar('Bottom');
}

// Helper function to initialize bar buttons
function initializeBar(suffix) {
  // Dark mode button
  const barDarkMode = document.getElementById('barDarkMode' + suffix);
  if (barDarkMode) {
    // Restore saved dark mode preference
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
      document.body.classList.add('dark-mode');
      updateDarkModeIcon();
    }

    barDarkMode.addEventListener('click', function(e) {
      e.preventDefault();
      toggleDarkMode();
      updateDarkModeIcon();
      SoundManager.playSound('click');
    });
  }

  // Sound toggle button
  const barSound = document.getElementById('barSound' + suffix);
  if (barSound) {
    updateSoundButtonIcon();
    barSound.addEventListener('click', function(e) {
      e.preventDefault();
      SoundManager.toggle();
      updateSoundButtonIcon();
      SoundManager.playSound('click');
    });
  }

  // Home button
  const barHome = document.getElementById('barHome' + suffix);
  if (barHome) {
    barHome.addEventListener('click', function(e) {
      e.preventDefault();
      confirmHomeNavigation();
    });
  }

  // Time display update - handled by global timer to avoid flickering
  const barTime = document.getElementById('barTime' + suffix);
  if (barTime) {
    updateBarTime();
    // Start the global update interval if not already running
    if (!window.globalTimerIntervalId) {
      window.globalTimerIntervalId = setInterval(updateBarTime, 1000);
    }
  }
}

// Update dark mode icon
function updateDarkModeIcon() {
  const iconBottom = document.getElementById('barDarkIconBottom');
  const isDarkMode = document.body.classList.contains('dark-mode');
  const newIcon = isDarkMode ? 'light_mode' : 'dark_mode';
  
  if (iconBottom) iconBottom.textContent = newIcon;
}

// Update sound button icon
function updateSoundButtonIcon() {
  const soundIconBottom = document.getElementById('barSoundIconBottom');
  const newIcon = SoundManager.enabled ? 'volume_up' : 'volume_off';
  
  if (soundIconBottom) soundIconBottom.textContent = newIcon;
}

// Update time display
function updateBarTime() {
  const barTimeBottom = document.getElementById('barTimeBottom');
  
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
  
  if (barTimeBottom) barTimeBottom.textContent = `${dayName} ${timeString}`;
  
  // Also update the countdown timer display if it exists (synchronized with system clock)
  if (window.mockTestInstance) {
    window.mockTestInstance.updateTimerDisplay();
  }
}

// Redirect to home page
function redirectHome() {
  window.location.href = '../../index.html';
}

// Confirm navigation to home
function confirmHomeNavigation() {
  redirectHome();
}

// Make SoundManager globally available
window.SoundManager = SoundManager;

// Make utility function available
window.getCurrentTestType = getCurrentTestType;

// Download Android App
document.addEventListener('DOMContentLoaded', function() {
  const downloadBtn = document.getElementById('downloadAndroidApp');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', function(e) {
      e.preventDefault();
      // Replace the URL below with your actual APK download link or Google Play Store link
      const apkUrl = 'https://your-apk-download-link.com/app.apk'; // Update this URL
      const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.skillpoint.mockweb'; // Update with your Play Store ID
      
      // Try to open Google Play Store first, fall back to APK download
      const userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.indexOf('android') > -1) {
        // User is on Android, try Play Store first
        window.open(playStoreUrl, '_blank');
      } else {
        // Not on Android, provide APK download
        window.location.href = apkUrl;
      }
    });
  }

  // Go to top button (home page only)
  const goToTopBtn = document.getElementById('goToTopBtn');
  if (goToTopBtn) {
    goToTopBtn.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SoundManager, getCurrentTestType };
}

// ============================================================
// PASSWORD PROTECTION MODULE
// ============================================================
const PasswordProtection = {
  // Change this password as needed
  CORRECT_PASSWORD: 'test123',
  
  init() {
    const modal = document.getElementById('passwordModal');
    const input = document.getElementById('passwordInput');
    const submitBtn = document.getElementById('passwordSubmitBtn');
    const errorDiv = document.getElementById('passwordError');
    const closeBtn = document.getElementById('passwordModalCloseBtn');
    
    if (!modal || !input || !submitBtn) {
      console.warn('Password modal elements not found. Initializing test directly.');
      this.unlockContent();
      return;
    }
    
    // Show the modal for password entry
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
    
    // Handle submit button click
    submitBtn.addEventListener('click', () => {
      this.checkPassword(input.value, errorDiv);
    });
    
    // Handle Enter key press
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.checkPassword(input.value, errorDiv);
      }
    });
    
    // Handle close button click
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.closeModal(modal);
      });
    }
    
    // Focus on input
    input.focus();
  },
  
  checkPassword(password, errorDiv) {
    if (password === this.CORRECT_PASSWORD) {
      // Password correct - unlock immediately
      errorDiv.style.display = 'none';
      this.unlockContent();
    } else {
      // Show error message with animation
      errorDiv.style.display = 'block';
      
      // Clear the input
      document.getElementById('passwordInput').value = '';
      document.getElementById('passwordInput').focus();
    }
  },
  
  unlockContent() {
    const modal = document.getElementById('passwordModal');
    
    if (modal) {
      // Fade out the modal
      modal.style.transition = 'opacity 0.3s ease-out';
      modal.style.opacity = '0';
      
      // Hide modal after animation and initialize test
      setTimeout(() => {
        modal.classList.add('hidden');
        modal.style.display = 'none';
        
        // Initialize the test if testData is available
        if (window.testData && window.MockTest) {
          console.log('Initializing test with data:', window.testData.title);
          window.mockTestInstance = new window.MockTest(window.testData);
        } else {
          console.error('Test data or MockTest class not available');
        }
      }, 300);
    } else {
      // Modal not found, initialize test directly
      if (window.testData && window.MockTest) {
        console.log('Initializing test with data:', window.testData.title);
        window.mockTestInstance = new window.MockTest(window.testData);
      }
    }
  },

  closeModal(modal) {
    // Fade out the modal
    modal.style.transition = 'opacity 0.3s ease-out';
    modal.style.opacity = '0';
    
    // Redirect to home after animation
    setTimeout(() => {
      window.location.href = '../../index.html';
    }, 300);
  }
};

// Initialize password protection when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    PasswordProtection.init();
  });
} else {
  // If DOM is already loaded, initialize immediately
  PasswordProtection.init();
}
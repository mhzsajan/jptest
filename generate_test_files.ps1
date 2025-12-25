# Script to generate test data files with proper template structure

$testConfigs = @(
    @{
        path = "g:\VS Code Japan Test\tests\nursing-care-japanese-1\nursing-japanese-1-data.js"
        title = "Nursing Care Test 1 (Japanese)"
        varName = "nursingJapaneseTest1Data"
        duration = 15
        questions = 15
        errorMsg = "Nursing Care Test 1 (Japanese)"
    },
    @{
        path = "g:\VS Code Japan Test\tests\nursing-care-japanese-2\nursing-japanese-2-data.js"
        title = "Nursing Care Test 2 (Japanese)"
        varName = "nursingJapaneseTest2Data"
        duration = 15
        questions = 15
        errorMsg = "Nursing Care Test 2 (Japanese)"
    },
    @{
        path = "g:\VS Code Japan Test\tests\nursing-care-nepali-2\nursing-nepali-2-data.js"
        title = "Nursing Care Test 2 (Nepali)"
        varName = "nursingNepaliTest2Data"
        duration = 50
        questions = 45
        errorMsg = "Nursing Care Test 2 (Nepali)"
    },
    @{
        path = "g:\VS Code Japan Test\tests\jft-basic-1\jft-basic-1-data.js"
        title = "JFT Basic Test 1"
        varName = "jftBasicTest1Data"
        duration = 70
        questions = 60
        errorMsg = "JFT Basic Test 1"
    },
    @{
        path = "g:\VS Code Japan Test\tests\jft-basic-2\jft-basic-2-data.js"
        title = "JFT Basic Test 2"
        varName = "jftBasicTest2Data"
        duration = 50
        questions = 45
        errorMsg = "JFT Basic Test 2"
    },
    @{
        path = "g:\VS Code Japan Test\tests\jft-basic-3\jft-basic-3-data.js"
        title = "JFT Basic Test 3"
        varName = "jftBasicTest3Data"
        duration = 50
        questions = 45
        errorMsg = "JFT Basic Test 3"
    },
    @{
        path = "g:\VS Code Japan Test\tests\jft-basic-4\jft-basic-4-data.js"
        title = "JFT Basic Test 4"
        varName = "jftBasicTest4Data"
        duration = 50
        questions = 45
        errorMsg = "JFT Basic Test 4"
    }
)

# Function to generate dummy questions
function Get-DummyQuestions {
    param([int]$count)
    
    $questions = @()
    for ($i = 1; $i -le $count; $i++) {
        $questions += @"
    {
      text: "Question $i - What is the correct answer?",
      options: [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      correctAnswer: $(Get-Random -Minimum 0 -Maximum 4),
      image: null
    }
"@
        if ($i -lt $count) { $questions[-1] += "," }
    }
    return $questions -join "`n"
}

# Generate each file
foreach ($config in $testConfigs) {
    $dummyQuestions = Get-DummyQuestions -count $config.questions
    
    $errorMsg = $config.errorMsg -replace '"', '\"'
    $content = @"
/*
$($config.title)
*/

const $($config.varName) = {
  title: "$($config.title)",
  duration: $($config.duration),
  passingScore: 70,
  
  questions: [
$dummyQuestions
  ]
};

// Make it available globally
window.testData = $($config.varName);

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
        
        // Show error message to user
        if (loadingContainer) {
          loadingContainer.innerHTML = `
            <div class="error-container">
              <div class="error-icon">
                <span class="material-icons">error</span>
              </div>
              <h2>Failed to Load Test</h2>
              <p>There was an error loading the $errorMsg. Please check the console for details.</p>
              <div class="error-actions">
                <a href="../../index.html" class="action-btn btn-primary">
                  <span class="material-icons">home</span>
                  Back to Home
                </a>
                <button class="action-btn btn-secondary" onclick="window.location.reload()">
                  <span class="material-icons">refresh</span>
                  Try Again
                </button>
              </div>
            </div>
          `;
        }
      }
    }
  }, 1000);
});
"@
    
    Set-Content -Path $config.path -Value $content -Encoding UTF8
    Write-Host "Updated: $(Split-Path -Leaf $config.path) - $($config.questions) questions, $($config.duration) min" -ForegroundColor Green
}

Write-Host "`nAll test files have been updated successfully!" -ForegroundColor Cyan

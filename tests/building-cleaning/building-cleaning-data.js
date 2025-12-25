/*
Building Cleaning Test - Sample Questions
*/

const buildingCleaningData = {
  title: "Building Cleaning Test",
  duration: 12,
  passingScore: 60,
  questions: [
    {
      text: "What is the correct order for cleaning a room?",
      options: ["Clean floor first", "Dust from top to bottom, then floors", "Clean windows first", "Vacuum then dust"],
      correctAnswer: 1,
      image: null
    },
    {
      text: "Which chemical is safe for disinfecting food preparation surfaces?",
      options: ["Bleach solution", "Ammonia", "Food-grade disinfectant", "Vinegar only"],
      correctAnswer: 2,
      image: null
    },
    {
      text: "How often should high-touch surfaces be cleaned in public areas?",
      options: ["Once a week", "Daily", "Every 2 hours during operation", "Only at closing"],
      correctAnswer: 2,
      image: null
    },
    {
      text: "What PPE is required for cleaning with strong chemicals?",
      options: ["Gloves and eye protection", "Mask only", "Apron only", "No PPE needed"],
      correctAnswer: 0,
      image: null
    },
    {
      text: "How should wet floors be managed?",
      options: ["Leave wet for drying", "Use wet floor signs and restrict access", "Dry with cloth immediately", "Block area for 1 hour"],
      correctAnswer: 1,
      image: null
    },
    {
      text: "What is the proper way to store cleaning chemicals?",
      options: ["In original labeled containers in designated area", "Mixed together for efficiency", "In water bottles", "Any container"],
      correctAnswer: 0,
      image: null
    },
    {
      text: "How should biological spills be handled?",
      options: ["Clean immediately with regular soap", "Use approved disinfectant and follow protocol", "Leave for professional", "Wash with water only"],
      correctAnswer: 1,
      image: null
    }
  ]
};

window.testData = buildingCleaningData;

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    const loadingContainer = document.getElementById('loadingContainer');
    const testContainer = document.getElementById('testContainer');
    if (loadingContainer && testContainer) {
      loadingContainer.style.display = 'none';
      testContainer.style.display = 'block';
      if (window.testData && window.MockTest) {
        new MockTest(window.testData);
      }
    }
  }, 600);
});

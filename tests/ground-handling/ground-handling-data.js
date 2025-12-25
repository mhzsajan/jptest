/*
Ground Handling Test - Sample Questions
*/

const groundHandlingData = {
  title: "Ground Handling Test",
  duration: 15,
  passingScore: 60,
  questions: [
    {
      text: "What is the primary safety equipment required for ground handling staff?",
      options: ["Hard hat and steel-toed boots", "Uniform only", "ID badge", "Headphones"],
      correctAnswer: 0,
      image: null
    },
    {
      text: "When approaching an aircraft on the tarmac, which direction should be avoided?",
      options: ["From the front", "From the rear where propellers are active", "From the side", "From underneath"],
      correctAnswer: 1,
      image: null
    },
    {
      text: "What vehicle is used to tow aircraft?",
      options: ["Baggage cart", "Tug (tow tractor)", "Fuel truck", "Catering truck"],
      correctAnswer: 1,
      image: null
    },
    {
      text: "How often should ground handling equipment be inspected?",
      options: ["Monthly", "Daily before use", "Quarterly", "Annually"],
      correctAnswer: 1,
      image: null
    },
    {
      text: "What is the maximum weight limit for manually handling cargo?",
      options: ["50 kg", "25 kg", "100 kg", "Depends on individual capacity"],
      correctAnswer: 1,
      image: null
    },
    {
      text: "Which communication device is mandatory for ground handling personnel?",
      options: ["Mobile phone", "Two-way radio", "Landline", "Email system"],
      correctAnswer: 1,
      image: null
    },
    {
      text: "What should you do if you notice a fluid spill on the ground?",
      options: ["Leave it for later cleanup", "Report to supervisor immediately", "Try to clean it yourself", "Ignore if it's small"],
      correctAnswer: 1,
      image: null
    },
    {
      text: "What is the safe distance to maintain from a moving aircraft?",
      options: ["10 meters", "50 meters", "100 meters", "150 meters"],
      correctAnswer: 2,
      image: null
    }
  ]
};

window.testData = groundHandlingData;

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

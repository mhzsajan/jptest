/*
Agriculture Test
*/

const agricultureData = {  // Fixed variable name to follow camelCase
  title: "Agriculture Test",
  duration: 50,
  passingScore: 60,

  questions: [
    {
      text: "पट बाट बेर्ना निकाल्ने सही तरिका कुन हो?",
      options: [
        '<img class="option-img" src="../../images/questions/agriculture/Q1A.jpg" alt="Q1A">',
        '<img class="option-img" src="../../images/questions/agriculture/Q1B.jpg" alt="Q1B">',
        '<img class="option-img" src="../../images/questions/agriculture/Q1C.jpg" alt="Q1C">'
      ],
      correctAnswer: 0,
      image: null
    },
    {
      text: "तलका मध्ये कुन सिँचाइमा थोरै पानि लाग्छ?",
      options: [
        '<img class="option-img" src="../../images/questions/agriculture/Q2A.jpg" alt="Q2A">',
        '<img class="option-img" src="../../images/questions/agriculture/Q2B.jpg" alt="Q2B">',
        '<img class="option-img" src="../../images/questions/agriculture/Q2C.jpg" alt="Q2C">',
        '<img class="option-img" src="../../images/questions/agriculture/Q2D.jpg" alt="Q2D">'
      ],
      correctAnswer: 1,
      image: null
    },
    {
      text: "तलका मध्ये बहुउदेशिय मशिन कुन हो?",
      options: [
        '<img class="option-img" src="../../images/questions/agriculture/Q3A.jpg" alt="Q3A">',
        '<img class="option-img" src="../../images/questions/agriculture/Q3B.jpg" alt="Q3B">',
        '<img class="option-img" src="../../images/questions/agriculture/Q3C.jpg" alt="Q3C">',
        '<img class="option-img" src="../../images/questions/agriculture/Q3D.jpg" alt="Q3D">'
      ],
      correctAnswer: 1,
      image: null
    },
    {
      text: "लगातार खतीको कारण उत्पन्नहुने एक समस्या कुन हो?",
      options: [
        "किटानुशोघन हुन्छ।",
        "निश्चित पोषक तत्वको कमि हुन्छ।",
        "निश्चित पोषक तत्वको बढी हुन्छ।",
        "विरुको विकासमा सहयोग हुन्छ।"
      ],
      correctAnswer: 1,
      image: null
    },
    {
      text: "तलका मध्ये नाइट्रोजनको अनुपयुक्त काम छान्नुहोस?",
      options: [
        "मुख्यातय डांठको बिकास गराउछ।",
        "पातलाई लामो बनाउछ।",
        "पातको रङ्ग गाढा बनाउछ।",
        "फुल र फल लगाउछ।"
      ],
      correctAnswer: 3,
      image: null
    },
    {
      text: "आधार मल सँग असम्बन्धित वाक्या छन्नुहोस?",
      options: [
        "आधारमल विरुवा रोप्नु भन्दाअगि प्रयोग गर्ने मल हो।",
        "विरुवाको विकास सगै आवश्यकता अनुसार हाल्ने मल हो।",
        "विरुवालाइ छिटै फाइदा गर्छ।"
      ],
      correctAnswer: 1,
      image: null
    },
    {
      text: "तलका तस्बिर हेरी मल हल्न प्रयोग नहुने सामाग्रि चयन गर्नुहोस?",
      options: [
        '<img class="option-img" src="../../images/questions/agriculture/Q7A.jpg" alt="Q7A">',
        '<img class="option-img" src="../../images/questions/agriculture/Q7B.jpg" alt="Q7B">',
        '<img class="option-img" src="../../images/questions/agriculture/Q7C.jpg" alt="Q7C">',
        '<img class="option-img" src="../../images/questions/agriculture/Q7D.jpg" alt="Q7D">'
      ],
      correctAnswer: 3,
      image: null
    },
    {
      text: '“८-६-६” लेखिएको २० केजी मलको प्याकेटमा पोटासियमको मात्रा कति हुन्छ?',
      options: [
        "१.२ के जी।",
        "१.५ के जी।",
        "२.५ केजी।",
        "२.२ केजी।"
      ],
      correctAnswer: 0,
      image: null
    },
    {
      text: "बिरुवालाई प्रकश शंश्लेशणका लागी तलका मध्ये कुन आवश्यक छैन?",
      options: [
        "CO2",
        "H2O",
        "O2",
        "प्रकाश।"
      ],
      correctAnswer: 2,
      image: null
    },
    {
      text: "जापानको चिम्ट्याइलो दोमट माटोमा पानिको निकास कस्तो हुन्छ?",
      options: [
        "राम्रो।",
        "अलिक राम्रो।",
        "नराम्रो।"
      ],
      correctAnswer: 1,
      image: null
    },
    {
      text: "मल्चिङ्ग गर्दा हुने फाइदा मध्ये तलका असम्बन्धिक वक्या कुन हो?",
      options: [
        "नरम माटोलाई कायम राख्छ।",
        "रोग र किरा बाट जोगाउछ।",
        "घास झार बाट जोगाउछ।",
        "परागसेचन बिना फल लगाउन सहयोग गर्छ।"
      ],
      correctAnswer: 3,
      image: null
    },
    {
      text: "तलका मघ्ये पारदर्शिक प्लष्टिकको काम के हो?",
      options: [
        "घाँस उम्रना बाट रोक्छ।",
        "जमिनको तापक्रम बढनबाट रोक्छ।",
        "जमिनको तापक्रम बढाउने काम गर्छ।",
        "जमिनको तापक्रम घटाउछ।"
      ],
      correctAnswer: 2,
      image: null
    },
    {
      text: "थाक्रो दिदा टेको र डाँठ निश्चित गर्नको लागी डोरिको आकार कस्तो हुनु पर्छ?",
      options: [
        "एस आकार।",
        "आठ आकार।",
        "जेरो आकार।",
        "यु आकार।"
      ],
      correctAnswer: 1,
      image: null
    },
    {
      text: "तलका मध्ये फेरोमोनको उपयुक्त काम छन्नुहोह",
      options: [
        "किराहरुलाई नियण्त्रण गर्ने।",
        "तपक्रम नियण्त्रण गर्ने।",
        "झारपात नियण्त्रण गर्ने।",
        "रसायन नियण्त्रण गर्ने।"
      ],
      correctAnswer: 0,
      image: null
    },
    {
      text: "तलका मध्ये मध्यम बेर्नको अवधिकुन हो?",
      options: [
        "२०-२५",
        "२५-३०",
        "३०-३५",
        "३५-४०"
      ],
      correctAnswer: 2,
      image: null
    },
    {
      text: "झारपात मार्नकोलागि प्रयोग गरीने औषधिको नाम के हो?",
      options: [
        "ग्र्यनुल्स।",
        "स्पाईललेट।",
        "राईस ब्लास्ट।",
        "हेडफिडिङ्ग कम्बाईन।"
      ],
      correctAnswer: 0,
      image: null
    },
    {
      text: "तलका खेत रोप्ने मध्ये कुन विधी डाईरेक्ट सिडीङ्ग सँग सम्बिधित छ?",
      options: [
        "पातलो खेती।",
        "सुख्खा खेतमा विउ रोप्ने।",
        "१५-२८ सि एम को फरकमा रोप्ने रोपाई।",
        "WCS विधिको रोपाई।"
      ],
      correctAnswer: 1,
      image: null
    },
    {
      text: "एक उपयुक्त भनाई चयन गर्नुहोस 18 तलका खेत रोप्ने मध्ये कुन विधी डाईरेक्ट सिडीङ्ग सँग सम्बिधित छ?",
      options: [
        "नयाँ जरा र पात आउन थालेपछि खेतको पानि कम गर्नुपर्दैन।",
        "नयाँ जरा र पात आउन थालेपछि खेतको पानि कम गर्नु बढाउनु पर्छ।",
        "नयाँ जरा र पात आउन थालेपछि खेतको पानि कम गरि नयाँ डाठको संख्या बढाउनु पर्छ।"
      ],
      correctAnswer: 1,
      image: null
    },
    {
      text: "तलका मध्ये कुन तरकारी चिनोपोडियसी समुहमा पर्छ?",
      options: [
        "प्याज।",
        "आलु।",
        "पालुङ्गो।",
        "गाजर।"
      ],
      correctAnswer: 2,
      image: null
    },
    {
      text: "प्रयोग अंग अनुसार तरकारी लाई कति समुहमा बिभाजन गरियको छ?",
      options: [
        "१",
        "२",
        "३",
        "४"
      ],
      correctAnswer: 2,
      image: null
    },
    {
      text: "औधोगिक बालि भनेको?",
      options: [
        "जमिन मुनिको फल निकाल्ने हो।",
        "प्रयोग गर्नको लागी प्रशोधन आवश्यक बालि हो।",
        "प्रयोग गर्नको लागि प्रशोधन आवश्यक नभएको बालि हो।",
        "साईलेज खध्यापदार्थ हो।"
      ],
      correctAnswer: 1,
      image: null
    },
    {
      text: "साईलेज भन्नाले के बुझ्नुहुन्छ?",
      options: [
        "भिजाई राखेको पराल।",
        "धान मकैको डाठलाई हावा पस्ने गरी फर्मेन्ट गरिएको पशुको खाध्या पदार्थ हो।",
        "धान मकैको डाठलाई हावा नपस्ने गरी फर्मेन्ट गरिएको पशुको खाध्या पदार्थ हो।",
        "घाँस घान मकै बाट बनाएको खाध्या पदार्थ हो।"
      ],
      correctAnswer: 1,
      image: null
    },
    {
      text: "माटोमा भएको पानिको मात्रा नाप्ने यन्त्रलाई के भनिन्छ?",
      options: [
        "एसिडिमिटर।",
        "सोईल मोस्चर मिटर।",
        "टेन्सन मिटर।",
        "ख, ग"
      ],
      correctAnswer: 3,
      image: null
    },
    {
      text: "उचित माटोमा पानिको मात्रा कति हुन्छ?",
      options: [
        "२५-४५%",
        "३५-५५%",
        "५०-६५%",
        "६५-७५%"
      ],
      correctAnswer: 1,
      image: null
    },
    {
      text: "लामो सीधा लाईनमा विउ रोप्ने विधिलाई कुन बिधि भनिन्छ?",
      options: [
        "तेनमाकि।",
        "सुजिमाकि।",
        "बारामाकि।",
        "कोटिङ विउ।"
      ],
      correctAnswer: 1,
      image: null
    },
    {
      text: "बिउमा पानि धेरै भएमा बिउ अंकुरण किन राम्रो हुदैन?",
      options: [
        "माटोहिलो भएर।",
        "विउ कुहिएर।",
        "अक्सिजन कम भएर।",
        "अक्सिजन बढि भएर।"
      ],
      correctAnswer: 3,
      image: null
    },
    {
      text: "PO फिल्मको एक उपयुक्त विषेशता छान्नुहोस?",
      options: [
        "सजिलै प्रकाश छिर्छ।",
        "चिपचिप पान हुन्छ।",
        "सजिलै च्यातिने प्रकृतिका हुन्छ।",
        "छिटो फोहोर नहुने प्रकृतिको हुन्छ।"
      ],
      correctAnswer: 3,
      image: null
    },
    {
      text: "संरक्षित संरचना भित्र पटी प्रयोग गरिने सामाग्रि कुन होइन?",
      options: [
        "रेशमि कपडा।",
        "नरम फिल्म।",
        "नबुनेको कपडा।",
        "कटनको कपडा।"
      ],
      correctAnswer: 3,
      image: null
    },
    {
      text: "हावाको आवातजावात गरउने क्रममा पहिले के हटाउनु पर्छ?",
      options: [
        "दायाँ बायाको भग।",
        "झ्याल खोल्नु पर्छ।",
        "भित्र छोपेको सामग्रि हटाउनु पर्छ।",
        "छतको झ्याल खोल्नु पर्छ।"
      ],
      correctAnswer: 2,
      image: null
    },
    {
      text: "ग्रिन हाउस भित्र कार्बन्डाईड अक्सिजन जेनेरेटर कुन उद्येशेले गरिन्छ?",
      options: [
        "वास्पिकरणको लागी।",
        "प्रकास शंस्लेशनको लागी।",
        "किरा मर्नको लागी।",
        "स्वसप्रस्वाश गर्नको लागी।"
      ],
      correctAnswer: 1,
      image: null
    },
    {
      text: "जटिल वातावरण व्याबस्थपन भन्नाले के बुझ्नु हुन्छ?",
      options: [
        "हावा, आद्रताजस्ता वातावरणिय तत्वको व्यावस्थापन",
        "तापक्रम, आद्रता, प्रकाश, कारबन्डाईड अक्साईड आदि वातावरणिय तत्वको व्यावस्थापन।",
        "कम्प्युटर प्रयोग गरी व्यावस्थापन ।",
        "ग्रिन हाउस, औजार, बिउको व्याबस्थापन।"
      ],
      correctAnswer: 1,
      image: null
    },
    {
      text: "तलका मध्ये आईरनको कमिले हुने असर कुन हो?",
      options: [
        "फेद कुहिने।",
        "पात पहेलो हुने।",
        "डाँठ सानो हुने।",
        "पात ठुलो हुने।"
      ],
      correctAnswer: 1,
      image: null
    },
    {
      text: "हाइड्रोफोनिक कल्चर भनेको?",
      options: [
        "माटोमा खेती गर्ने विधि हो।",
        "पानिमा मात्र खेति गर्ने विधि हो।",
        "नरिवलको बोक्र प्रयोग गरी गरिने खेति विधि हो।",
        "माथिका सबै बोधि हो।"
      ],
      correctAnswer: 2,
      image: null
    },
    {
      text: "तलका मध्ये बेर्ना उमार्ने पोलिपट कुन कुन हो?",
      options: [
        '<img class="option-img" src="../../images/questions/agriculture/Q34A.jpg" alt="Q34A">',
        '<img class="option-img" src="../../images/questions/agriculture/Q34B.jpg" alt="Q34B">',
        '<img class="option-img" src="../../images/questions/agriculture/Q34C.jpg" alt="Q34C">',
        '<img class="option-img" src="../../images/questions/agriculture/Q34D.jpg" alt="Q34D">'
      ],
      correctAnswer: 2,
      image: null
    },
    {
      text: "बेर्ना उमार्ने विधिहरु कति प्रकारका छन?",
      options: [
        "३",
        "४",
        "५",
        "६"
      ],
      correctAnswer: 2,
      image: null
    },
    {
      text: "तलका मध्ये कुन सामग्रि नरम फिल्ममा पर्दैन?",
      options: [
        "नोउवी।",
        "नोउपोलि।",
        "PO",
        "लिड।"
      ],
      correctAnswer: 3,
      image: null
    },
    {
      text: "स्वस्थ्या बेर्ना छुट्याउनुहोस?",
      options: [
        "मसिनो तर अग्लो डाँठ।",
        "आँख्लाहरु बिच दुरी फरक भएको।",
        "बिज पत्र सानो आकार भएको।",
        "पातहरु दृढता पुर्ण माथि फर्केको।"
      ],
      correctAnswer: 3,
      image: null
    },
    {
      text: "कलमिको उद्देश्या के हो?",
      options: [
        "एकै वंशको विरुवा बढाउन।",
        "फल चाडो लाग्छ।",
        "रुटस्टकको रोग तथा हानिकारक किरा वाट क्षति कम हुन्छ।",
        "माथिका सबै।"
      ],
      correctAnswer: 3,
      image: null
    },
    {
      text: "रुटस्टक काटदा जमिनबाट काति दुरिमा काट्नु पर्छ",
      options: [
        "४-५ सिएम।",
        "४.५ -६ सिएम।",
        "५.५ -७ सिएम।",
        "६- ७ सिएम।"
      ],
      correctAnswer: 1,
      image: null
    },
    {
      text: "सिवनको पछाडिको भाग कति डिग्रि हुने गरि काट्नु पर्छ",
      options: [
        "३५",
        "४५",
        "५५",
        "६५"
      ],
      correctAnswer: 1,
      image: null
    },
    {
      text: "रुटस्टक र सियोन मिलाउदा कुन लेयर अनिवार्या मिलाउनु पर्छ",
      options: [
        "जाईलम।",
        "फ्लोएम।",
        "क्याम्वियम।",
        "बोक्रा।"
      ],
      correctAnswer: 2,
      image: null
    },
    {
      text: "फलमाल भन्नाले कुन मल हो?",
      options: [
        "शरद मल।",
        "वसन्त मल।",
        "गृष्म मल।",
        "धन्यावाद मल।"
      ],
      correctAnswer: 2,
      image: null
    },
    {
      text: "अंगुरको बिया हटाउन के गर्नु पर्छ?",
      options: [
        "जिबेरेलिनको घोलमा डुबाउनु पर्छ।",
        "फललाई झोला भित्र राक्णू फृच।",
        "विया नहुने जातको फल लागाउनु पर्छ।",
        "मल्चिङ्ग गर्नु पर्छ।"
      ],
      correctAnswer: 0,
      image: null
    },
    {
      text: "प्रतिबिम्ब सिट किन प्रयोग गर्नु पर्छ?",
      options: [
        "माटो बग्न बाट रोक्न।",
        "झारपात झर्न बाट रोक्न।",
        "फलमा रङ्ग बस्न।",
        "पानि वस्पिकरण बाट रोक्न।"
      ],
      correctAnswer: 2,
      image: null
    },
    {
      text: "फुलको मुन पलाउन सहयोग गर्न तलका मध्ये के गर्नु पर्छ?",
      options: [
        "छाटकाट गर्नु रोक्नु पर्छ।",
        "नाइट्रोजनको प्रभव घटाउनु पर्छ।",
        "नाइट्रोजनको प्रभव बढाउनु पर्छ।",
        "घेरै फल फलाउनु पर्छ।"
      ],
      correctAnswer: 1,
      image: null
    }
  ]
};

// Make it available globally
window.testData = agricultureData;  // Fixed variable name

// Initialize test when everything is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, testData:', window.testData);
  console.log('MockTest available:', window.MockTest);

  // Update loading placeholders immediately so the UI reflects the real
  // question count/duration while the test initializes.
  try {
    const loadingContainer = document.getElementById('loadingContainer');
    if (loadingContainer && window.testData && Array.isArray(window.testData.questions)) {
      const p = loadingContainer.querySelector('p');
      if (p) p.textContent = `Preparing your ${window.testData.questions.length} questions`;
    }

    const testSubtitleElement = document.getElementById('dynamicTestSubtitle') || document.querySelector('.test-subtitle');
    if (testSubtitleElement && window.testData) {
      testSubtitleElement.textContent = `${window.testData.questions.length} Questions • ${window.testData.duration} Minutes`;
    }

    const questionCounter = document.getElementById('questionCounter');
    if (questionCounter && window.testData) {
      questionCounter.textContent = `Question 1 of ${window.testData.questions.length}`;
    }

    const timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay && window.testData) {
      timerDisplay.textContent = `${String(window.testData.duration).padStart(2,'0')}:00`;
    }
  } catch (e) {
    console.warn('Could not update loading placeholders for agriculture test:', e);
  }

  // Continue with the existing init flow
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
              <p>There was an error loading the agriculture test. Please check the console for details.</p>
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
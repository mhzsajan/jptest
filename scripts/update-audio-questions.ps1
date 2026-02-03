# Script to add Audio Q prefix and line breaks to questions
$filePath = "g:\VS Code Japan Test\tests\jft-basic-4\jft-basic-4-data.js"
$content = Get-Content $filePath -Raw

# Audio Q38-45
$replacements = @{
    'text: "Listen to the dialogs\. What can we do that place\? Choose from below\.\\nसम्वाद सुन्नुहोस्। हामी त्यो स्थान के गर्न सक्छौ\? तलबाट छनौट गर्नुहोस्।\\n' = 'text: "Audio Q38\n\nListen to the dialogs. What can we do that place? Choose from below.\n\nसम्वाद सुन्नुहोस्। हामी त्यो स्थान के गर्न सक्छौ? तलबाट छनौट गर्नुहोस्.\n\n'
    'text: "Daina san and Sophia san are friends\. They are discussing where to go for their trip and by what they go choose the correct answer from question 1 and 2\.\\nडाइना सान र सोफिया सान साथी हुन्। उनीहरूले यात्राको लागि कहाँ जाने र के बाट जाने भनेर छलफल गरिरहेका छन्। प्रश्न १ र २ बाट सही उत्तर छनौट गर्नुहोस्।\\n' = 'text: "Audio Q39\n\nDaina san and Sophia san are friends. They are discussing where to go for their trip and by what they go choose the correct answer from question 1 and 2.\n\nडाइना सान र सोफिया सान साथी हुन्। उनीहरूले यात्राको लागि कहाँ जाने र के बाट जाने भनेर छलफल गरिरहेका छन्। प्रश्न १ र २ बाट सही उत्तर छनौट गर्नुहोस्.\n\n'
    'text: "Two people are talking about karaoke contest place\. Which is correct chose one\.\\nदुई व्यक्ति हरु खाराओके ठाउको प्रतियोगिताको बारेमा कुरा गर्दैछन्। कुन सहि छ छनौट गरिएको छ।\\n' = 'text: "Audio Q41\n\nTwo people are talking about karaoke contest place. Which is correct chose one.\n\nदुई व्यक्ति हरु खाराओके ठाउको प्रतियोगिताको बारेमा कुरा गर्दैछन्। कुन सहि छ छनौट गरिएको छ।\n\n'
    'text: "Two people are talking about music player\. Which model is buy fast\?\\nदुई व्यक्ति संगीत प्लेयरको बारेमा कुरा गर्दैछन्। कुन मोडेल छिटो किन्न सकिन्छ\? सहि मोडेल छनौट गर्नुहोस्।\\n' = 'text: "Audio Q42\n\nTwo people are talking about music player. Which model is buy fast?\n\nदुई व्यक्ति संगीत प्लेयरको बारेमा कुरा गर्दैछन्। कुन मोडेल छिटो किन्न सकिन्छ? सहि मोडेल छनौट गर्नुहोस्.\n\n'
    'text: "You can listen announcement\. What is the reason of train delayed and for how long\? Choose the correct answer from question 1 and 2\.\\nतपाइले एनाउन्स सुन्नुहुने छ। रेल ढिला हुनुको कारण के हो\? ट्रेन कति समय ढिला हुन्छ\? प्रश्न १ र २ बाट सहि उत्तर छान्नुहोस्।\\n' = 'text: "Audio Q44\n\nYou can listen announcement. What is the reason of train delayed and for how long? Choose the correct answer from question 1 and 2.\n\nतपाइले एनाउन्स सुन्नुहुने छ। रेल ढिला हुनुको कारण के हो? ट्रेन कति समय ढिला हुन्छ? प्रश्न १ र २ बाट सहि उत्तर छान्नुहोस्.\n\n'
    'text: "You can listen announcement what is the reason of train delayed and for how long\? Choose the correct answer from question 1 and 2\.\\nतपाइले एनाउन्स सुन्नुहुने छ। रेल ढिला हुनुको कारण के हो\? ट्रेन कति समय ढिला हुन्छ\? प्रश्न १ र २ बाट सहि उत्तर छान्नुहोस्।\\n' = 'text: "Audio Q45\n\nYou can listen announcement what is the reason of train delayed and for how long? Choose the correct answer from question 1 and 2.\n\nतपाइले एनाउन्स सुन्नुहुने छ। रेल ढिला हुनुको कारण के हो? ट्रेन कति समय ढिला हुन्छ? प्रश्न १ र २ बाट सहि उत्तर छान्नुहोस्.\n\n'
}

foreach ($old in $replacements.Keys) {
    $new = $replacements[$old]
    $content = $content -replace [regex]::Escape($old), $new
}

# Add line breaks to questions 22-30 and 46-60
$content = $content -replace '(text: "[^A][^u][^d][^i][^o][^"]+)\\n(त|य|द|Here|You are|This is|Two person)([^"]+")(\s+options:)', '$1\n\n$2$3$4'

$content | Set-Content $filePath

Write-Host "Updated successfully!"

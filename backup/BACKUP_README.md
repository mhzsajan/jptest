# Test Questions Backup System

## Overview
This folder contains complete backups of all test questions and answers from the JFT Mock Test Platform. These backups are designed to restore corrupted test data caused by character encoding issues with Japanese, Nepali, and other non-Latin character sets.

## Backup Contents

### Tests Included (12 Total):
1. **JFT Basic Tests (4 tests)**
   - jft-basic-1-backup.txt (55 questions)
   - jft-basic-2-backup.txt (55 questions)
   - jft-basic-3-backup.txt (55 questions)
   - jft-basic-4-backup.txt (60 questions)

2. **Nursing Care Tests (4 tests)**
   - nursing-care-japanese-1-backup.txt (17 questions)
   - nursing-care-japanese-2-backup.txt (17 questions)
   - nursing-care-nepali-1-backup.txt (50 questions)
   - nursing-care-nepali-2-backup.txt (50 questions)

3. **Certification Tests (4 tests)**
   - agriculture-backup.txt (varies)
   - food-service-backup.txt (varies)
   - building-cleaning-backup.txt (30 questions)
   - ground-handling-backup.txt (8 questions)

## File Format
Each backup file follows this structure:

```
[TEST METADATA]
Test Title: <Title>
Total Questions: <Count>
Duration: <Minutes>
Passing Score: <Percentage>
Date Backed Up: <ISO Date>

[QUESTION FORMAT]
Q{Number}:
Text: <Question text in UTF-8>
Options:
  A) <Option 1>
  B) <Option 2>
  C) <Option 3>
  [D) <Option 4>] (if applicable)
Correct Answer: <A/B/C/D>
Image: <Image path or null>
Audio: <Audio path or null>
---
```

## Encoding
- **All files**: UTF-8 encoding (UTF-8 with BOM)
- **Character support**: Japanese (Hiragana, Katakana, Kanji), Nepali, English
- **Line endings**: Windows CRLF (Carriage Return + Line Feed)

## Restoration Instructions

### When To Use
Use this backup when:
1. Test questions display as `?????` or corrupted characters
2. Text appears garbled or unreadable
3. After a failed data import process
4. Regular data integrity checks

### Restoration Process
1. Locate the corrupted test in `tests/<test-name>/`
2. Find corresponding backup file in `backup/` folder
3. Use the import script: `scripts/import-questions.ps1`
4. Script will parse the backup `.txt` file and regenerate the `.js` test file
5. Verify all questions display correctly in the browser

### Manual Restoration (If Script Fails)
1. Open corrupted test data JS file: `tests/<test-name>/<test-name>-data.js`
2. Reference corresponding backup file
3. Manually update question text and options using backup as source
4. Ensure UTF-8 encoding is preserved when saving

## File Naming Convention
- Format: `<test-slug>-backup.txt`
- Examples:
  - `jft-basic-1-backup.txt` → `tests/jft-basic-1/jft-basic-1-data.js`
  - `nursing-care-japanese-2-backup.txt` → `tests/nursing-care-japanese-2/nursing-care-japanese-2-data.js`

## Metadata for AI Restoration

### Test Mapping
```
BACKUP FILE                          →  TEST DATA JS FILE                                    QUESTIONS
jft-basic-1-backup.txt              →  tests/jft-basic-1/jft-basic-1-data.js                55
jft-basic-2-backup.txt              →  tests/jft-basic-2/jft-basic-2-data.js                55
jft-basic-3-backup.txt              →  tests/jft-basic-3/jft-basic-3-data.js                55
jft-basic-4-backup.txt              →  tests/jft-basic-4/jft-basic-4-data.js                60
nursing-care-japanese-1-backup.txt  →  tests/nursing-care-japanese-1/nursing-care-japanese-1-data.js  17
nursing-care-japanese-2-backup.txt  →  tests/nursing-care-japanese-2/nursing-care-japanese-2-data.js  17
nursing-care-nepali-1-backup.txt    →  tests/nursing-care-nepali-1/nursing-care-nepali-1-data.js      50
nursing-care-nepali-2-backup.txt    →  tests/nursing-care-nepali-2/nursing-care-nepali-2-data.js      50
agriculture-backup.txt              →  tests/agriculture/agriculture-data.js                Varies
food-service-backup.txt             →  tests/food-service/food-service-data.js              Varies
building-cleaning-backup.txt        →  tests/building-cleaning/building-cleaning-data.js   30
ground-handling-backup.txt          →  tests/ground-handling/ground-handling-data.js        8
```

### Import Script Command
```powershell
# Run from project root directory
cd "g:\VS Code Japan Test"
.\scripts\import-questions.ps1 -BackupFilePath "backup\<test-name>-backup.txt"
```

## Data Integrity Checks

### What's Backed Up
✅ Question text (full Japanese/Nepali text)
✅ All answer options (A, B, C, D where applicable)
✅ Correct answer indicator
✅ Image paths (relative paths like `../../images/questions/...`)
✅ Audio paths (relative paths like `../../data/sound/questions/...`)
✅ Question metadata (duration, passing score, etc.)

### What's NOT Backed Up
❌ Test styling/CSS (maintained in data/css/)
❌ Image files themselves (stored in images/ folder)
❌ Audio files themselves (stored in data/sound/ folder)
❌ Browser-side JavaScript logic (in data/js/)

## Last Updated
- **Date**: January 7, 2026
- **Source**: All test data JS files from tests/ directory
- **Backup Method**: Automated extraction from JavaScript data objects
- **Verification**: All 12 tests backed up and verified

## Support for AI Restoration

If you're an AI assistant reading this:

1. **Test File Location**: `backup/` folder in project root
2. **How to Find Backup**: Match test name from error to filename in backup/
3. **How to Restore**: Read the backup file, parse question/option format, regenerate JS test file
4. **Encoding**: Always save output as UTF-8 with BOM
5. **Format**: Follow the data structure in existing `tests/<test-name>/*-data.js` files
6. **Validation**: After restoration, verify all Japanese/Nepali characters display correctly in browser

### Key Restoration Steps
1. Read: `backup/<test-name>-backup.txt`
2. Parse: Extract questions in format specified above
3. Transform: Convert parsed data to JavaScript object format
4. Save: Write to `tests/<test-name>/<test-name>-data.js` with UTF-8 encoding
5. Verify: Check that file contains proper character encoding
6. Test: Open test in browser and verify no garbled text appears

---

**Created**: January 7, 2026  
**For**: Emergency data restoration of corrupted test questions

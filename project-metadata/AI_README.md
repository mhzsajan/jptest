# Project metadata (AI quick read)

This folder contains a concise machine-readable summary and a tiny human-facing note for tools.

- `project-metadata.json`: primary machine-readable summary. Contains name, description, entry points, important folders, and run instructions.
- `AI_README.md`: this file — short explanation for humans and AIs to find the JSON quickly.

Quick facts:
- Tests live under `tests/` with per-test `index.html` files.
- Test data lives under `data/` and images under `images/`.
 
Updated notes (quick):
- Homepage visitor/test-taken counters were removed on 2025-12-06; the app no longer performs GET requests for site counters.
- A plaintext source `agriculture questions.txt` (repo root) was ingested and converted into `tests/agriculture/agriculture-data.js`. A backup of the original (pre-edit) data file is at `tests/agriculture/agriculture-data.js.bak`.
- Image filename pattern: `images/questions/<test-folder>/Q{n}{Letter}.jpg` (e.g. `Q1A.jpg`). When parsing plaintext, map "Image Q1A" → that filename.

Recent importer notes:
- The PowerShell importer script is at `scripts/import-questions.ps1` and supports `-DryRun` and `-AutoImageExt` flags. Use `-DryRun` first to validate parsing.
- When importing, the script creates a backup `*-data.js.bak` in the same test folder.
- The importer normalizes the JS variable name to camelCase and assigns it to `window.testData` (example: `nursingCareNepali1Data` → `window.testData`).
- The importer appends a small DOMContentLoaded init block at the end of the generated `*-data.js` which unhides the test UI and instantiates `MockTest`.

AI parsing checklist:
1. Read `project-metadata/project-metadata.json` for run instructions and flags.
2. For tests, load `tests/<folder>/index.html` and the corresponding `*-data.js` file.
3. If a `*-data.js` is empty or minimal, check for a plaintext source at repository root (e.g., `agriculture questions.txt`).
4. Map image markers in plaintext (`Image Q1A`) to files under `images/questions/<folder>/`.
5. Respect backups under `tests/<folder>/*.bak` when present; they contain original content.

These notes are intentionally brief so an automated tool can consume them quickly.

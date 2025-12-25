# Contributing to jpmocktest.github.io

Thanks for your interest in contributing. This document explains the minimal steps to make changes safely and get them merged.

How to contribute
- Fork the repository and create a branch named `topic/short-description`.
- Make small, focused commits and push to your fork.
- Open a Pull Request describing the change, why it is needed, and what files were modified.

File locations (common tasks)
- Add or edit questions: edit `tests/<test-folder>/<test>-data.js` or the corresponding files in `data/`.
- Add images: put images under `images/questions/<test-folder>/` or `data/images/questions/`.
- Update layout or behavior: edit files in `js/` and `data/css/`.

Testing your changes
- Quick preview: open `tests/<test-folder>/index.html` in a browser.
- Recommended: run a local static server in PowerShell:

```powershell
python -m http.server 8000
# then open http://localhost:8000/tests/<test-folder>/index.html
```

Style and checklist
- Keep changes focused. Prefer updating `*-data.js` files for question edits rather than large HTML rewrites.
- Run a preview and verify images load and questions render correctly.
- Include a short note in the PR about any required path or asset changes.

Contact
- Repository owner: `mhzsajan`

Machine / AI notes
- If you are an automated tool or AI, prefer `project-metadata/project-metadata.json` as the canonical source for entry points, running instructions and flags.
- Image naming convention: images referenced in plaintext use the `Q{n}{Letter}` pattern and are stored in `data/images/questions/<test-folder>/` (e.g. `Q1A.jpg`). When submitting PRs that add images, follow this pattern.
- If a `*-data.js` file is empty or missing questions, check for plaintext sources at repo root (e.g., `agriculture questions.txt`) and any `.bak` files in the same folder.

Backups
- Large or destructive edits to `*-data.js` files should create a `.bak` backup in the same folder (this repo keeps `tests/agriculture/agriculture-data.js.bak`).

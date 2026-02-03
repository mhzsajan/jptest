<#
.import-questions.ps1

Safe importer to convert a plaintext question file (like "agriculture questions.txt")
into a `*-data.js` file under a `tests/<test-folder>/` directory.

Usage example (PowerShell):
.
cd "g:\VS Code Japan Test"
.
# Run:
.
.
./scripts/import-questions.ps1 -SourceFile "agriculture questions.txt" -TestFolder "tests/agriculture"

Notes:
- Creates a backup of the target `*-data.js` if it exists (adds `.bak`).
- Looks for question blocks starting with `Question <n>`.
- Option lines must start with `A. `, `B. `, `C. `, `D. ` (case-insensitive).
- Correct Answer line must be `Correct Answer: <A|B|C|D>`.
- Image markers like `Image Q1A` are converted to `../../data/images/questions/<folder>/Q1A.jpg`.
- Outputs UTF8 file.
#>

param(
  [Parameter(Mandatory=$true)] [string]$SourceFile,
  [Parameter(Mandatory=$true)] [string]$TestFolder,
  [string]$OutputFile,
  [switch]$DryRun,
  [switch]$AutoImageExt
)

# Resolve paths
$RepoRoot = Get-Location
$SourcePath = Resolve-Path -Path $SourceFile -ErrorAction Stop
$TestFolderPath = Resolve-Path -Path $TestFolder -ErrorAction Stop

# Determine test name and default output file
$TestName = Split-Path -Path $TestFolderPath -Leaf
if (-not $OutputFile) {
  $OutputFile = Join-Path -Path $TestFolderPath -ChildPath ("$TestName-data.js")
}

Write-Host "Importing questions from:`n  $SourcePath`ninto:`n  $OutputFile" -ForegroundColor Cyan

# Backup existing target (skip if DryRun)
if (Test-Path $OutputFile) {
  $bak = "$OutputFile.bak"
  if (-not $DryRun) {
    Copy-Item -Path $OutputFile -Destination $bak -Force
    Write-Host "Existing file backed up to: $bak" -ForegroundColor Yellow
  } else {
    Write-Host "(DryRun) Would back up existing file to: $bak" -ForegroundColor DarkYellow
  }
}

# Read source lines (preserve encoding)
$lines = @(Get-Content -Path $SourcePath -Encoding UTF8 -ErrorAction Stop)

$questions = @()
$current = $null

foreach ($raw in $lines) {
  $line = $raw.Trim()
  if ($line -match '^Question\s*(\d+)\.?') {
    # New question (handles "Question 1" or "Question 1.")
    # Save previous question if valid
    if ($null -ne $current) {
      if ($current.question -and $current.options.Count -ge 2 -and $null -ne $current.correct) {
        $questions += $current
      }
    }
    # Start new question
    $current = @{
      number = 0
      question = ""
      options = @()
      correct = $null
      image = $null
      audio = $null
    }
    continue
  }

  if ($null -eq $current) { continue }

  # Correct Answer line
  if ($line -match '^Correct Answer:\s*([A-D])' ) {
    $letter = $matches[1].ToUpper()
    $idx = switch ($letter) { 'A' {0}; 'B' {1}; 'C' {2}; 'D' {3}; Default { -1 } }
    if ($idx -ge 0) { $current.correct = $idx }
    continue
  }

  # Option lines (must start with A., B., C., or D.)
  if ($line -match '^[A-D]\.\s*(.*)$') {
    $optText = $matches[1].Trim()
    # Convert image marker Image Q{n}{Letter} to an <img> tag
    if ($optText -match 'Image\s*Q(\d+)([A-D])') {
      $imgNum = $matches[1]
      $imgLetter = $matches[2].ToUpper()
      $folder = Split-Path -Path $TestFolderPath -Leaf

      # Try extensions if AutoImageExt enabled, otherwise default to .jpg
      $extCandidates = @('jpg','jpeg','png','webp')
      $foundFile = $null
      if ($AutoImageExt) {
        foreach ($ext in $extCandidates) {
          $candidate = Join-Path -Path (Join-Path -Path $RepoRoot -ChildPath "data/images/questions/$folder") -ChildPath ("Image Q${imgNum}${imgLetter}.$ext")
          if (Test-Path $candidate) { $foundFile = "Image Q${imgNum}${imgLetter}.$ext"; break }
        }
      }
      if (-not $foundFile) {
        # fallback to .jpg (even if AutoImageExt attempted)
        $foundFile = "Image Q${imgNum}${imgLetter}.jpg"
        $candidatePath = Join-Path -Path $RepoRoot -ChildPath "data/images/questions/$folder/$foundFile"
        if (-not (Test-Path $candidatePath)) {
          Write-Host "Warning: image not found for marker Q${imgNum}${imgLetter} in folder data/images/questions/$folder (tried extensions). Using expected filename $foundFile" -ForegroundColor DarkYellow
        }
      }
      $imgPath = "../../data/images/questions/$folder/$foundFile"
      $optHtml = "<img class='option-img' src='$imgPath' alt='Q${imgNum}${imgLetter}'>"
      $current.options += $optHtml
    } else {
      # Escape single quotes for JS string
      $escaped = $optText -replace "'","\\'"
      $current.options += $escaped
    }
    continue
  }

  # Audio marker line (e.g., "Audio Q50")
  if ($line -match '^Audio\s*Q(\d+)') {
    $audioNum = $matches[1]
    $current.audio = "Q$audioNum"
    continue
  }

  # Image marker line (e.g., "Image Q1")
  if ($line -match '^Image\s*Q(\d+)') {
    $imgNum = $matches[1]
    $folder = Split-Path -Path $TestFolderPath -Leaf
    
    # Try extensions if AutoImageExt enabled
    $extCandidates = @('jpg','jpeg','png','webp')
    $foundFile = $null
    if ($AutoImageExt) {
      foreach ($ext in $extCandidates) {
        $candidate = Join-Path -Path (Join-Path -Path $RepoRoot -ChildPath "data/images/questions/$folder") -ChildPath ("Image Q${imgNum}.$ext")
        if (Test-Path $candidate) { $foundFile = "Image Q${imgNum}.$ext"; break }
      }
    }
    if (-not $foundFile) {
      $foundFile = "Image Q${imgNum}.png"  # try .png first for main images
      $candidatePath = Join-Path -Path $RepoRoot -ChildPath "data/images/questions/$folder/$foundFile"
      if (-not (Test-Path $candidatePath)) {
        $foundFile = "Image Q${imgNum}.jpg"
        Write-Host "Warning: image not found for marker Q${imgNum} in folder data/images/questions/$folder. Using expected filename Image Q${imgNum}.jpg" -ForegroundColor DarkYellow
      }
    }
    $current.image = "../../data/images/questions/$folder/$foundFile"
    continue
  }

  # If line is non-empty and not option/correct/question header, treat as question text (append if multi-line)
  if ($line -ne '') {
    if ($current.question -eq '') { $current.question = $line } else { $current.question = "$($current.question) $line" }
  }
}
# finish last question
if ($null -ne $current) {
  if ($current.question -and $current.options.Count -ge 2 -and $null -ne $current.correct) {
    $questions += $current
  }
}

if ($questions.Count -eq 0) {
  Write-Host "No valid questions parsed. Aborting." -ForegroundColor Red
  exit 1
}

# Build JS content
# Convert test name to valid JS identifier (camelCase)
# Handle special case for test names like "jft-basic-1"
$jsVarName = $TestName -replace '-', ' '  # Convert hyphens to spaces
$jsVarName = (Get-Culture).TextInfo.ToTitleCase($jsVarName)  # Title case
$jsVarName = $jsVarName -replace ' ', ''  # Remove spaces
$jsVarName = $jsVarName.Substring(0,1).ToLower() + $jsVarName.Substring(1)  # Make first letter lowercase

$js = @()
$js += "/* Generated by scripts/import-questions.ps1 - DO NOT EDIT MANUALLY (except via source) */"
$js += "/* Source: $SourcePath */"
$js += "`nconst ${jsVarName}Data = {"
$js += "  title: `"$($TestName -replace '-',' ' | % { (Get-Culture).TextInfo.ToTitleCase($_) })`","
$js += "  duration: 50,"
$js += "  passingScore: 70,"
$js += "  questions: ["

foreach ($q in $questions) {
  $qText = $q.question -replace "'","\\'"
  $js += "    {"
  $js += "      text: '$qText',"
  # Options array
  $js += "      options: ["
  for ($i=0; $i -lt $q.options.Count; $i++) {
    $opt = $q.options[$i]
    # If opt contains an img tag, use template literals (backticks) to avoid quote escaping
    if ($opt -match '^<img') {
      # Use backticks for template literals - they allow any quotes inside
      $js += "        ``$opt``,"
    } else {
      $optEsc = $opt -replace "'","\\'"
      $js += "        '$optEsc',"
    }
  }
  $js[$js.Count-1] = $js[$js.Count-1].TrimEnd(',') # remove trailing comma of last option
  $js += "      ],"
  $js += "      correctAnswer: $($q.correct),"
  
  # Add image field if present
  if ($q.image) {
    $js += "      image: '$($q.image)',"
  } else {
    $js += "      image: null,"
  }
  
  # Add audio field if present
  if ($q.audio) {
    $audioPath = "../../data/sound/questions/$(Split-Path -Path $TestFolderPath -Leaf)/$($q.audio).mp3"
    $js += "      audio: '$audioPath'"
  } else {
    $js += "      audio: null"
  }
  
  $js += "    },"
}
# remove trailing comma from last question
$last = $js[$js.Count-1]
$js[$js.Count-1] = $last.TrimEnd(',')
$js += "  ]"
$js += "};"
$js += "`n// Make it available globally"
$js += "window.testData = ${jsVarName}Data;"

if ($DryRun) {
  Write-Host "(DryRun) Parsed $($questions.Count) questions. No file written. Sample:" -ForegroundColor Cyan
  # Show a short sample for verification
  for ($i = 0; $i -lt [Math]::Min(2, $questions.Count); $i++) {
    $q = $questions[$i]
    $preview = if ($q.question.Length -gt 60) { $q.question.Substring(0, 60) + "..." } else { $q.question }
    Write-Host "Q$($i+1): $preview"
    for ($j = 0; $j -lt $q.options.Count; $j++) {
      $opt = $q.options[$j]
      if ($opt.Length -gt 60) { $opt = $opt.Substring(0, 60) + "..." }
      Write-Host "  $([char](65+$j)). $opt"
    }
    Write-Host "  Correct: $([char](65+$q.correct))`n"
  }
} else {
  # Write JS to output
  $js | Out-File -FilePath $OutputFile -Encoding UTF8 -Force
  Write-Host "Wrote $($questions.Count) questions to $OutputFile" -ForegroundColor Green
  Write-Host "Backup (if any) retained as: $($OutputFile).bak" -ForegroundColor Yellow
}

# Debug script to test parsing of Nepali questions file

$SourcePath = "g:\VS Code Japan Test\Nursing Care Nepali Test 1.txt"
$lines = Get-Content -Path $SourcePath -Raw -Encoding UTF8 -ErrorAction Stop
$lines = $lines -replace "`r`n","`n" -split "`n"

$questions = @()
$current = $null
$qnum = 0

Write-Host "Processing $($lines.Count) lines..."

foreach ($i in 0..($lines.Count-1)) {
  $raw = $lines[$i]
  $line = $raw.Trim()
  
  if ($line -match '^Question\s*(\d+)\.?') {
    Write-Host "Found question header at line $i`: $line"
    if ($current) {
      Write-Host "  Previous question: text='$($current.question)' options=$($current.options.Count) correct=$($current.correct)"
      if ($current.question -and $current.options.Count -ge 2 -and $null -ne $current.correct) {
        $questions += $current
        Write-Host "  -> ADDED"
      } else {
        Write-Host "  -> SKIPPED (incomplete)"
      }
    }
    $qnum++
    $current = [PSCustomObject]@{
      number = $qnum
      question = ""
      options = [System.Collections.ArrayList]@()
      correct = $null
    }
    continue
  }

  if (-not $current) { continue }

  if ($line -match '^Correct Answer:\s*([A-D])') {
    $letter = $matches[1].ToUpper()
    $idx = switch ($letter) { 'A' {0}; 'B' {1}; 'C' {2}; 'D' {3}; Default { -1 } }
    if ($idx -ge 0) { 
      $current.correct = $idx
      Write-Host "  Set correct answer to $letter (index $idx)"
    }
    continue
  }

  if ($line -match '^[A-D]\.\s*') {
    Write-Host "  Found option: $line"
    $match = [regex]::Match($line, '^[A-D]\.\s*(.*)$')
    if ($match.Success) {
      $optText = $match.Groups[1].Value.Trim()
      [void]$current.options.Add($optText)
    }
    continue
  }

  if ($line -ne '') {
    if ($current.question -eq '') { 
      $current.question = $line
      Write-Host "  Question text: $line"
    } else { 
      $current.question = "$($current.question) $line"
    }
  }
}

# Finish last
if ($current) {
  Write-Host "Final question: text='$($current.question)' options=$($current.options.Count) correct=$($current.correct)"
  if ($current.question -and $current.options.Count -ge 2 -and $null -ne $current.correct) {
    $questions += $current
    Write-Host "  -> ADDED"
  } else {
    Write-Host "  -> SKIPPED (incomplete)"
  }
}

Write-Host "`nTotal questions parsed: $($questions.Count)"

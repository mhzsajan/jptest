# build.ps1 - Automated build pipeline for JFT Mock Test Native Android App
$ErrorActionPreference = 'Stop'
$ROOT = $PSScriptRoot
$SRC = Join-Path $ROOT 'app\src\main'
$OUT = Join-Path $ROOT 'build'

$SDK = $env:ANDROID_HOME
if (-not $SDK) { $SDK = 'G:\dev\android-sdk' }
if (-not (Test-Path $SDK)) { throw "Android SDK not found at $SDK" }

$JAVA = $env:JAVA_HOME
if (-not $JAVA) { $JAVA = 'C:\Program Files\Eclipse Adoptium\jdk-21.0.12.101-hotspot' }
if (-not (Test-Path $JAVA)) { throw "JDK not found at $JAVA" }

# Discover build-tools & platform
$btDirs = @(Get-ChildItem (Join-Path $SDK 'build-tools') -Directory | Sort-Object Name -Descending)
if ($btDirs.Count -eq 0) { throw "No build-tools found in $SDK" }
$BT = $btDirs[0].FullName
$AAPT2 = Join-Path $BT 'aapt2.exe'
$APKSIGNER = Join-Path $BT 'apksigner.bat'
$ZIPALIGN = Join-Path $BT 'zipalign.exe'
$D8_JAR = Join-Path $BT 'lib\d8.jar'

$plats = @(Get-ChildItem (Join-Path $SDK 'platforms') -Directory |
    Where-Object { Test-Path (Join-Path $_.FullName 'android.jar') } |
    Sort-Object Name -Descending)
if ($plats.Count -eq 0) { throw "No platform android.jar found in $SDK" }
$AJ = (Resolve-Path (Join-Path $plats[0].FullName 'android.jar')).Path

Write-Host "==> SDK: $SDK (Build-Tools: $($btDirs[0].Name), Platform: $($plats[0].Name))"

# Prepare build dirs
New-Item -ItemType Directory -Force -Path $OUT | Out-Null
$GEN = Join-Path $OUT 'gen'
$CLASSES = Join-Path $OUT 'classes'
$DEX = Join-Path $OUT 'dex'
foreach ($d in @($GEN, $CLASSES, $DEX)) {
    if (Test-Path $d) { Remove-Item $d -Recurse -Force }
    New-Item -ItemType Directory -Force -Path $d | Out-Null
}

$RES = Join-Path $SRC 'res'
$ASSETS = Join-Path $SRC 'assets'
$MANIFEST = Join-Path $SRC 'AndroidManifest.xml'

# 1. AAPT2 Compile & Link (without -A to avoid Windows backslash bug in zip headers)
Write-Host "==> aapt2 compile"
& $AAPT2 compile --dir $RES -o (Join-Path $OUT 'res.zip')
if ($LASTEXITCODE -ne 0) { throw "aapt2 compile failed" }

Write-Host "==> aapt2 link"
& $AAPT2 link -o (Join-Path $OUT 'base.apk') -I $AJ `
    --manifest $MANIFEST `
    --java $GEN `
    --min-sdk-version 24 --target-sdk-version 35 `
    --auto-add-overlay (Join-Path $OUT 'res.zip')
if ($LASTEXITCODE -ne 0) { throw "aapt2 link failed" }

# 2. Compile Java
Write-Host "==> javac"
$sources = @(Get-ChildItem (Join-Path $SRC 'java\com\example\jptest\*.java')).FullName
$sources += (Get-ChildItem (Join-Path $GEN '*.java') -Recurse).FullName
$jc = @('-classpath', $AJ, '-source', '8', '-target', '8', '-nowarn', '-d', $CLASSES) + $sources
& (Join-Path $JAVA 'bin\javac.exe') @jc
if ($LASTEXITCODE -ne 0) { throw "javac failed" }

# 3. D8 Dexing
Write-Host "==> d8"
$classes = @(Get-ChildItem (Join-Path $CLASSES 'com\example\jptest\*.class')).FullName
$d8a = @('--lib', $AJ, '--min-api', '24', '--output', $DEX) + $classes
if (Test-Path $D8_JAR) {
    & (Join-Path $JAVA 'bin\java.exe') -cp $D8_JAR com.android.tools.r8.D8 @d8a
} else {
    & (Join-Path $BT 'd8.bat') @d8a
}
if ($LASTEXITCODE -ne 0) { throw "d8 failed" }

# 4. Packaging: Base + Classes.dex + Assets (guaranteed POSIX forward slashes)
Write-Host "==> package"
$unsigned = Join-Path $OUT 'unsigned.apk'
Copy-Item (Join-Path $OUT 'base.apk') $unsigned -Force
& (Join-Path $JAVA 'bin\jar.exe') uf $unsigned -C $DEX 'classes.dex'
if ($LASTEXITCODE -ne 0) { throw "jar failed" }

Write-Host "==> packaging assets with POSIX forward slashes"
python -c @"
import zipfile, os
apk_path = r'$unsigned'
assets_dir = r'$ASSETS'
with zipfile.ZipFile(apk_path, 'a', compression=zipfile.ZIP_DEFLATED) as z:
    for root, dirs, files in os.walk(assets_dir):
        for f in files:
            full = os.path.join(root, f)
            rel = os.path.relpath(full, assets_dir).replace('\\', '/')
            z.write(full, 'assets/' + rel)
print('Assets packaged successfully!')
"@
if ($LASTEXITCODE -ne 0) { throw "asset packaging failed" }

# 5. Keystore
$KS = Join-Path $OUT 'debug.keystore'
if (-not (Test-Path $KS)) {
    Write-Host "==> generating debug keystore"
    & (Join-Path $JAVA 'bin\keytool.exe') -genkey -v -keystore $KS -alias jptest `
        -keyalg RSA -keysize 2048 -validity 10000 -storepass jptestapp -keypass jptestapp `
        -dname "CN=JPTest, OU=App, O=SkillPoint, L=Kathmandu, C=NP"
}

# 6. Zipalign & Sign
Write-Host "==> zipalign"
$aligned = Join-Path $OUT 'aligned.apk'
if (Test-Path $aligned) { Remove-Item $aligned -Force }
& $ZIPALIGN -f 4 $unsigned $aligned
if ($LASTEXITCODE -ne 0) { throw "zipalign failed" }

Write-Host "==> apksigner"
$finalApk = Join-Path $OUT 'jptest.apk'
& $APKSIGNER sign --ks $KS --ks-key-alias jptest `
    --ks-pass "pass:jptestapp" --key-pass "pass:jptestapp" `
    --v4-signing-enabled true `
    --out $finalApk $aligned
if ($LASTEXITCODE -ne 0) { throw "apksigner failed" }

& $APKSIGNER verify $finalApk

# Also copy to root apk/ directory for user distribution
$destDir = Join-Path (Split-Path $ROOT) 'apk'
if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir -Force }
Copy-Item $finalApk (Join-Path $destDir 'jptest-native.apk') -Force
Copy-Item $finalApk (Join-Path (Split-Path $ROOT) 'jptest.apk') -Force

$size = (Get-Item $finalApk).Length
Write-Host ("==> BUILD SUCCESSFUL! {0} ({1:N0} bytes)" -f $finalApk, $size)

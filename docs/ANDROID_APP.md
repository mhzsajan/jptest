# Android App — build, signing, and release

The Android app is a **thin WebView wrapper**. It bundles no copy of the test
platform; it points at the GitHub Pages URL and renders it in a native WebView.
That is deliberate: the questions, images and audio already live in this repo,
so shipping an app update to fix a typo would be absurd.

| | |
|---|---|
| Source | `android/` in this repo |
| Built artifact | `apk/jptest-2.0.0.apk` |
| Release page | <https://github.com/mhzsajan/jptest/releases/tag/v2.0.0> |
| SHA-256 | `670385AD5C25576A4939243DF274A3C933513382907D1A8EECD6831D7E2DA10C` |
| Application ID | `com.example.jptest` |
| Loads | `https://mhzsajan.github.io/jptest/` |
| Minimum Android | 5.0 (API 21) |
| Target API | 35 |

### Where downloads come from

The APK is published in **two** places, and the site footer links to both:

1. **In this repository**, at `apk/jptest-<version>.apk`, served by GitHub Pages
   from the same CDN as the site itself. This is the "APK v2.0.0" link.
2. **As a GitHub Release asset** on the `jptest` repository. This is the
   "Release notes" link.

The in-repo copy is the faster download and needs no cross-origin redirect, which
is why it is the primary link. The release is the canonical, versioned artifact
and is where release notes live.

Both previously pointed somewhere useless: the old footer on **eleven** test pages
offered a Google Drive link and a link to the `jptestapk` repository, and both
served the broken Flutter app.

## Why this exists

There was a previous app, distributed from the separate `jptestapk` repository. It
was a **Flutter** application, 7.04 MB, that had been configured to load
`https://mhzsajan.github.io/jpmb` — a URL that has never existed. It also had **no
source code in its repository at all**; the repo contained a single 9-byte
placeholder file and nothing else. When the URL it pointed at died, there was
nothing to rebuild.

This version is 669 KB, has no dependencies beyond the Android platform itself,
and its source is committed here so the next person can actually change it.

## Upgrading from the old app: uninstall first

**Existing users must uninstall the old app before installing this one.**

The old APK was signed with an Android *debug* key that no longer exists on the
author's machine. Android refuses to install an update signed with a different
key, even when the package name matches. The package name here is deliberately
identical to the old app's (`com.example.jptest`), so once this version is
installed, **future versions will upgrade cleanly.**

To uninstall: Settings → Apps → JFT Mock Test → Uninstall.

## Building

Requires JDK 17+, the Android SDK, and Gradle. `ANDROID_HOME` must point at the
SDK. Then:

```powershell
cd android
gradle :app:assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

To publish, copy the artifact up to `apk/` and update the footer link in
`index.html`. See "Cutting a release" below.

### Dependencies

There are none. `android/app/build.gradle.kts` has an empty `dependencies` block
and the activity uses only platform APIs (`android.app.Activity` + `WebView`).
This is why the APK is under 1 MB — there is no AndroidX, no Kotlin runtime and
no browser engine bundled.

## Signing

The release keystore is **not** in this repository (see `android/.gitignore`).
Signing credentials are read from `android/keystore.properties`, which is also
gitignored.

| | |
|---|---|
| Keystore | `~/.android/jptest-release.jks` |
| Alias | `jptest` |
| Certificate SHA-256 | `E7:77:1E:E5:6D:23:FB:A1:96:05:4D:F0:AD:9F:3B:69:12:D2:AE:AB:FA:FC:BD:CF:DB:0C:54:73:26:22:44:B7` |
| Valid until | 2054-02-21 |

> **Back up `jptest-release.jks` and its password somewhere durable now.** If that
> file is lost, no future APK can be installed over the copies already on users'
> phones, and everyone has to uninstall and reinstall again. The keystore is the
> app's identity; it is not reproducible from the source.

`app/build.gradle.kts` falls back to the debug signing key when
`keystore.properties` is absent, so a fresh clone will still produce an
installable (but not upgradeable) APK rather than failing the build.

To create a new keystore:

```powershell
keytool -genkeypair -v -keystore $env:USERPROFILE\.android\jptest-release.jks `
  -alias jptest -keyalg RSA -keysize 4096 -validity 10000
```

## Cutting a release

1. Build the release APK (above).
2. Copy it to `apk/` under the new version number.
3. In `android/app/build.gradle.kts`, bump `versionCode` **and** `versionName`.
   Android only accepts an upgrade if `versionCode` increases.
4. Update the download link in **every** page footer, not just `index.html` —
   the twelve `tests/*/index.html` files carry their own copy of the footer and
   are the easiest thing to forget. Search the repository for `apk/jptest-` and
   for `releases/tag/` and make sure every hit points at the new version.
5. Commit and push. Pages rebuilds on its own — no deploy step exists.
6. Create the release and attach the artifact:

   ```powershell
   gh release create v2.1.0 "apk\jptest-2.1.0.apk#jptest-2.1.0.apk" `
     --repo mhzsajan/jptest --target main `
     --title "JFT Mock Test — Android app v2.1.0" `
     --notes-file release-notes.md
   ```

7. Verify the published asset is byte-identical to what you built. Do not assume:

   ```powershell
   Invoke-WebRequest -Uri `
     "https://github.com/mhzsajan/jptest/releases/download/v2.1.0/jptest-2.1.0.apk" `
     -OutFile check.apk
   (Get-FileHash check.apk -Algorithm SHA256).Hash
   ```

## Behaviour worth knowing about

These are deliberate choices in `MainActivity.java`, not accidents:

- **DOM storage is enabled.** The platform keeps the unlocked state, the dark-mode
  preference and the audio play counters in `localStorage`. Without it the
  password gate and theme toggle silently do nothing.
- **The activity handles `configChanges`.** Without this, rotating the phone would
  destroy and recreate the activity, reloading the page and **resetting a
  running exam's countdown**.
- **`beforeunload` is not honoured by Android WebView.** The platform's own
  warning modals are therefore the only protection against losing a test, which is
  why the hardware back button goes through `goBack()` and asks for confirmation
  before closing the app.
- **SSL errors are not overridden.** Letting a WebView continue past an invalid
  certificate would quietly defeat the password gate this app exists to support.
- **Links leaving `mhzsajan.github.io` open in the system browser**, so the app
  cannot be navigated somewhere unexpected.

## Not offline

The old app's marketing described offline study. This app genuinely requires a
network connection: it is a browser window, and it fetches questions, images and
audio on demand. It will not work on a plane.

A real offline build would mean bundling the site inside the APK and registering a
service worker. That is possible, but it doubles the artifact size and introduces
a cache-invalidation problem, so it has not been done.
# No obfuscation is enabled for this app (isMinifyEnabled = false), so this file
# is intentionally empty. It is kept so the build script's proguardFiles
# reference always resolves.

# Keep the WebView bridge if any @JavascriptInterface is added later.
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
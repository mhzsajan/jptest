package com.example.jptest;

import android.annotation.SuppressLint;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.webkit.ConsoleMessage;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

/**
 * Thin WebView wrapper around the JFT mock-test platform, which is a static site
 * served from GitHub Pages. There is no bundled copy of the site: the APK is a
 * launcher, and the content always comes from the network.
 *
 * Design notes that matter for this particular site:
 *  - DOM storage MUST be on. The platform keeps the unlocked state, the dark-mode
 *    preference and the "play audio twice" counters in localStorage; without it
 *    the password gate and the theme toggle silently fail.
 *  - configChanges in the manifest keeps this activity alive across rotation, so
 *    an in-progress timed test is not reloaded and its countdown is not reset.
 *  - beforeunload is not honoured by Android WebView, so the site's own custom
 *    warning modals are the only thing standing between a mis-tap and a lost test.
 *    The hardware back button therefore routes through WebView.goBack() first.
 *  - Links that leave the platform host are handed to the system browser rather
 *    than loaded in-app, so the app can never be navigated somewhere unexpected.
 *  - SSL errors are NOT overridden. Letting a WebView proceed on an invalid
 *    certificate would silently defeat the password gate and the test integrity
 *    this app exists to support.
 */
public class MainActivity extends android.app.Activity {

    /** The single origin this app is allowed to display. */
    private static final String HOME_URL = "https://mhzsajan.github.io/jptest/";
    private static final String HOME_HOST = "mhzsajan.github.io";

    private WebView webView;
    private long lastBackPressedAt = 0L;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        webView = new WebView(this);
        setContentView(webView);

        WebSettings s = webView.getSettings();
        // The platform is a JS application; without this it renders as a blank page.
        s.setJavaScriptEnabled(true);
        // Required: password state and dark-mode preference live in localStorage.
        s.setDomStorageEnabled(true);
        // Respect the site's own <meta name="viewport"> rather than WebView's
        // legacy 980px default, which would render the mobile layout at desktop
        // width and then scale it down.
        s.setUseWideViewPort(true);
        s.setLoadWithOverviewMode(true);
        s.setSupportZoom(true);
        s.setBuiltInZoomControls(true);
        s.setDisplayZoomControls(false);
        // Nothing in the platform is loaded from the filesystem.
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        // Audio must start from a user gesture. The site gates every clip behind
        // a play button, so this costs nothing and blocks autoplay abuse.
        s.setMediaPlaybackRequiresUserGesture(true);
        s.setCacheMode(WebSettings.LOAD_DEFAULT);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return handleUrl(request.getUrl());
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                // Only surface a failure for the main frame; a missing image or a
                // blocked font must not replace a perfectly good page with an error.
                if (request != null && request.isForMainFrame()) {
                    Toast.makeText(MainActivity.this,
                            "Could not load the test platform.\nCheck your internet connection and try again.",
                            Toast.LENGTH_LONG).show();
                }
            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                view.setVisibility(View.VISIBLE);
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onConsoleMessage(ConsoleMessage m) {
                return true;
            }
        });

        if (savedInstanceState != null) {
            webView.restoreState(savedInstanceState);
        } else {
            webView.loadUrl(HOME_URL);
        }
    }

    /**
     * @return true if the URL was consumed (i.e. do not load it in the WebView).
     */
    private boolean handleUrl(Uri uri) {
        if (uri == null) {
            return false;
        }
        String scheme = uri.getScheme();
        String host = uri.getHost();

        boolean isWebScheme = "http".equalsIgnoreCase(scheme) || "https".equalsIgnoreCase(scheme);
        boolean isHome = HOME_HOST.equalsIgnoreCase(host);

        if (isWebScheme && isHome) {
            return false; // stay in-app
        }

        // Anything else (the WhatsApp contact link, the Google Drive download,
        // github.com) goes to the system handler.
        try {
            startActivity(new Intent(Intent.ACTION_VIEW, uri));
        } catch (ActivityNotFoundException e) {
            Toast.makeText(this, "No app can open this link.", Toast.LENGTH_SHORT).show();
        }
        return true;
    }

    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
            return;
        }
        // Confirm before dropping the user out of an exam.
        long now = System.currentTimeMillis();
        if (now - lastBackPressedAt < 2000L) {
            finish();
        } else {
            lastBackPressedAt = now;
            Toast.makeText(this, "Press back again to close the app.", Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        if (webView != null) {
            webView.saveState(outState);
        }
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.loadUrl("about:blank");
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }
}
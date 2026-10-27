package com.example.jptest;

import android.app.AlertDialog;
import android.content.Context;
import android.graphics.Color;
import android.graphics.Typeface;
import android.net.Uri;
import android.os.Handler;
import android.os.Looper;
import android.os.Vibrator;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.webkit.ConsoleMessage;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.LinearLayout;
import android.widget.TextView;
import java.io.InputStream;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

public class ExamRunnerView extends LinearLayout {

    public interface ExamRunnerListener {
        void onExamFinished();
        void onRequestExit();
    }

    private final ScoreStore scoreStore;
    private final ExamRunnerListener runnerListener;
    private final Handler mainHandler = new Handler(Looper.getMainLooper());

    private WebView webView;
    private TextView examTitleTv;
    private TextView examBadgeTv;
    private ExamItem currentExam;
    private boolean examCompleted = false;

    public ExamRunnerView(Context context, ScoreStore scoreStore, ExamRunnerListener runnerListener) {
        super(context);
        this.scoreStore = scoreStore;
        this.runnerListener = runnerListener;
        init();
    }

    private void init() {
        setOrientation(VERTICAL);
        setBackgroundColor(UiTheme.BG_CANVAS);

        // Native Top Control Bar for the Active Exam
        LinearLayout topBar = new LinearLayout(getContext());
        topBar.setOrientation(HORIZONTAL);
        topBar.setGravity(Gravity.CENTER_VERTICAL);
        topBar.setBackgroundColor(UiTheme.BRAND_NAVY);
        topBar.setPadding(UiTheme.dp(getContext(), 14), UiTheme.dp(getContext(), 10),
                          UiTheme.dp(getContext(), 14), UiTheme.dp(getContext(), 10));

        // Back / Exit Button
        TextView backBtn = new TextView(getContext());
        backBtn.setText("✕");
        backBtn.setTextSize(TypedValue.COMPLEX_UNIT_SP, 18);
        backBtn.setTypeface(Typeface.DEFAULT_BOLD);
        backBtn.setTextColor(Color.WHITE);
        backBtn.setPadding(UiTheme.dp(getContext(), 6), UiTheme.dp(getContext(), 4),
                           UiTheme.dp(getContext(), 12), UiTheme.dp(getContext(), 4));
        backBtn.setOnClickListener(v -> confirmExit());
        topBar.addView(backBtn);

        // Title layout
        LinearLayout titleBox = new LinearLayout(getContext());
        titleBox.setOrientation(VERTICAL);
        LayoutParams tbParams = new LayoutParams(0, LayoutParams.WRAP_CONTENT, 1);
        titleBox.setLayoutParams(tbParams);

        examTitleTv = new TextView(getContext());
        examTitleTv.setText("Select an exam to begin");
        examTitleTv.setTextSize(TypedValue.COMPLEX_UNIT_SP, 15);
        examTitleTv.setTypeface(Typeface.DEFAULT_BOLD);
        examTitleTv.setTextColor(Color.WHITE);
        titleBox.addView(examTitleTv);

        examBadgeTv = new TextView(getContext());
        examBadgeTv.setText("100% Offline Simulation");
        examBadgeTv.setTextSize(TypedValue.COMPLEX_UNIT_SP, 11);
        examBadgeTv.setTextColor(UiTheme.BRAND_PRIMARY_LIGHT);
        titleBox.addView(examBadgeTv);

        topBar.addView(titleBox);

        // Native Top Finish / Submit Button
        TextView finishBtn = new TextView(getContext());
        finishBtn.setText("SUBMIT");
        finishBtn.setTextSize(TypedValue.COMPLEX_UNIT_SP, 12);
        finishBtn.setTypeface(Typeface.DEFAULT_BOLD);
        finishBtn.setTextColor(Color.WHITE);
        finishBtn.setPadding(UiTheme.dp(getContext(), 12), UiTheme.dp(getContext(), 6),
                             UiTheme.dp(getContext(), 12), UiTheme.dp(getContext(), 6));
        finishBtn.setBackground(UiTheme.round(UiTheme.BRAND_PRIMARY, UiTheme.dp(getContext(), 8)));
        finishBtn.setOnClickListener(v -> confirmSubmitExam());
        topBar.addView(finishBtn);

        addView(topBar);

        // Dedicated Exam WebView
        webView = new WebView(getContext());
        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(true);
        s.setAllowContentAccess(true);
        s.setUseWideViewPort(true);
        s.setLoadWithOverviewMode(true);
        s.setSupportZoom(true);
        s.setBuiltInZoomControls(true);
        s.setDisplayZoomControls(false);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setCacheMode(WebSettings.LOAD_DEFAULT);

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onConsoleMessage(ConsoleMessage msg) {
                android.util.Log.d("JSConsole", (msg != null ? msg.message() : "") +
                    " at " + (msg != null ? msg.sourceId() : "") + ":" + (msg != null ? msg.lineNumber() : 0));
                return true;
            }
        });

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (uri != null) {
                    String path = uri.getPath();
                    // Only exit to hub if the user explicitly navigates out of the tests directory
                    if (path != null && !path.contains("/tests/") && (path.equals("/") || path.endsWith("index.html"))) {
                        if (runnerListener != null) {
                            runnerListener.onRequestExit();
                            return true;
                        }
                    }
                }
                return false;
            }

            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (uri != null) {
                    android.util.Log.i("JPTest", "shouldInterceptRequest: " + uri.toString());
                    String host = uri.getHost();
                    if ("appassets.local".equalsIgnoreCase(host) || "localhost".equalsIgnoreCase(host)) {
                        String rawPath = uri.getPath();
                        if (rawPath != null) {
                            if (rawPath.startsWith("/")) rawPath = rawPath.substring(1);
                            WebResourceResponse resp = serveAsset(rawPath);
                            if (resp != null) return resp;

                            try {
                                String decoded = URLDecoder.decode(rawPath, "UTF-8");
                                resp = serveAsset(decoded);
                                if (resp != null) return resp;
                            } catch (Exception ignored) {}
                        }
                    }
                }
                return super.shouldInterceptRequest(view, request);
            }
        });

        webView.addJavascriptInterface(new ExamBridge(), "AndroidBridge");

        LayoutParams wvParams = new LayoutParams(LayoutParams.MATCH_PARENT, 0, 1);
        addView(webView, wvParams);
    }

    private WebResourceResponse serveAsset(String assetPath) {
        try {
            InputStream is = getContext().getAssets().open(assetPath);
            String mime = getMimeType(assetPath);
            Map<String, String> headers = new HashMap<>();
            headers.put("Access-Control-Allow-Origin", "*");
            WebResourceResponse response = new WebResourceResponse(mime, "UTF-8", is);
            response.setResponseHeaders(headers);
            android.util.Log.i("JPTest", "Served asset successfully: " + assetPath);
            return response;
        } catch (Exception e) {
            android.util.Log.e("JPTest", "Failed to open asset: [" + assetPath + "]: " + e.getMessage());
            return null;
        }
    }

    private String getMimeType(String path) {
        String lower = path.toLowerCase();
        if (lower.endsWith(".html") || lower.endsWith(".htm")) return "text/html";
        if (lower.endsWith(".css")) return "text/css";
        if (lower.endsWith(".js")) return "application/javascript";
        if (lower.endsWith(".png")) return "image/png";
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
        if (lower.endsWith(".gif")) return "image/gif";
        if (lower.endsWith(".svg")) return "image/svg+xml";
        if (lower.endsWith(".mp3")) return "audio/mpeg";
        if (lower.endsWith(".wav")) return "audio/wav";
        if (lower.endsWith(".ttf")) return "font/ttf";
        if (lower.endsWith(".json")) return "application/json";
        return "application/octet-stream";
    }

    public void loadExam(ExamItem exam) {
        this.currentExam = exam;
        this.examCompleted = false;

        examTitleTv.setText(exam.title);
        examBadgeTv.setText(String.format(Locale.getDefault(), "%s • %d Qs • %dm",
            exam.category, exam.questionsCount, exam.durationMinutes));

        webView.loadUrl(exam.assetPath);
    }

    public boolean isExamRunning() {
        return currentExam != null && !examCompleted;
    }

    public void confirmSubmitExam() {
        if (!isExamRunning()) return;

        new AlertDialog.Builder(getContext())
            .setTitle("Submit Exam?")
            .setMessage("Are you sure you want to finish and submit your exam now?")
            .setPositiveButton("Submit Now", (dialog, which) -> {
                if (webView != null) {
                    webView.evaluateJavascript(
                        "(function() { if (window.mockTestInstance) { window.mockTestInstance.confirmSubmission(); } else { console.error('mockTestInstance is undefined on window'); } })()",
                        null
                    );
                }
            })
            .setNegativeButton("Continue", null)
            .show();
    }

    public void confirmExit() {
        if (!isExamRunning()) {
            if (runnerListener != null) runnerListener.onRequestExit();
            return;
        }

        new AlertDialog.Builder(getContext())
            .setTitle("Leave Current Exam?")
            .setMessage("Your current test answers will be discarded if you leave now.")
            .setPositiveButton("Leave Exam", (dialog, which) -> {
                currentExam = null;
                webView.loadUrl("about:blank");
                if (runnerListener != null) {
                    runnerListener.onRequestExit();
                }
            })
            .setNegativeButton("Continue Exam", null)
            .show();
    }

    public void onDestroy() {
        if (webView != null) {
            webView.loadUrl("about:blank");
            webView.destroy();
            webView = null;
        }
    }

    private class ExamBridge {
        @JavascriptInterface
        public void onExamCompleted(String title, int score, int total, double percentage, boolean passed, int timeSpentSeconds) {
            examCompleted = true;
            final ScoreRecord record = new ScoreRecord(
                System.currentTimeMillis(),
                (currentExam != null) ? currentExam.title : title,
                (currentExam != null) ? currentExam.category : "JFT-Basic",
                score,
                (total > 0) ? total : (currentExam != null ? currentExam.questionsCount : 50),
                percentage,
                passed,
                timeSpentSeconds,
                System.currentTimeMillis()
            );

            scoreStore.saveAttempt(record);

            try {
                Vibrator vib = (Vibrator) getContext().getSystemService(Context.VIBRATOR_SERVICE);
                if (vib != null && vib.hasVibrator()) {
                    vib.vibrate(200);
                }
            } catch (Exception ignored) {}

            mainHandler.post(() -> {
                showResultModal(record);
                if (runnerListener != null) {
                    runnerListener.onExamFinished();
                }
            });
        }

        @JavascriptInterface
        public void onExitExam() {
            mainHandler.post(() -> {
                if (runnerListener != null) {
                    runnerListener.onRequestExit();
                }
            });
        }
    }

    private void showResultModal(ScoreRecord record) {
        String msg = String.format(Locale.getDefault(),
            "Score: %d / %d (%.1f%%)\nStatus: %s\nTime Spent: %s\n\nYour result has been saved to Score History.",
            record.score, record.total, record.percentage,
            record.passed ? "PASSED 🎉" : "NEEDS PRACTICE 📚",
            record.getFormattedTimeSpent()
        );

        new AlertDialog.Builder(getContext())
            .setTitle(record.passed ? "🎉 Congratulations!" : "Test Completed")
            .setMessage(msg)
            .setPositiveButton("Review Answers", null)
            .setNegativeButton("Go to Hub", (dialog, which) -> {
                if (runnerListener != null) runnerListener.onRequestExit();
            })
            .show();
    }
}

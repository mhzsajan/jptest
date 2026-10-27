package com.example.jptest;

import android.app.AlertDialog;
import android.content.Context;
import android.graphics.Color;
import android.graphics.Typeface;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import java.util.List;
import java.util.Locale;

public class ScoreHistoryView extends LinearLayout {

    public interface OnStartExamRequestedListener {
        void onStartExamRequested();
    }

    private final ScoreStore scoreStore;
    private final OnStartExamRequestedListener listener;

    private LinearLayout historyListLayout;
    private LinearLayout statsHeaderLayout;

    public ScoreHistoryView(Context context, ScoreStore scoreStore, OnStartExamRequestedListener listener) {
        super(context);
        this.scoreStore = scoreStore;
        this.listener = listener;
        init();
    }

    private void init() {
        setOrientation(VERTICAL);
        setBackgroundColor(UiTheme.BG_CANVAS);

        ScrollView scrollView = new ScrollView(getContext());
        scrollView.setFillViewport(true);
        scrollView.setVerticalScrollBarEnabled(false);

        LinearLayout content = new LinearLayout(getContext());
        content.setOrientation(VERTICAL);
        content.setPadding(UiTheme.dp(getContext(), 16), UiTheme.dp(getContext(), 16),
                            UiTheme.dp(getContext(), 16), UiTheme.dp(getContext(), 24));

        // Top Header
        LinearLayout topBar = new LinearLayout(getContext());
        topBar.setOrientation(HORIZONTAL);
        topBar.setGravity(Gravity.CENTER_VERTICAL);
        topBar.setPadding(0, 0, 0, UiTheme.dp(getContext(), 14));

        LinearLayout titleCol = new LinearLayout(getContext());
        titleCol.setOrientation(VERTICAL);
        LayoutParams tcParams = new LayoutParams(0, LayoutParams.WRAP_CONTENT, 1);
        titleCol.setLayoutParams(tcParams);

        TextView title = new TextView(getContext());
        title.setText("Exam History & Analytics");
        title.setTextSize(TypedValue.COMPLEX_UNIT_SP, 20);
        title.setTypeface(Typeface.DEFAULT_BOLD);
        title.setTextColor(UiTheme.TEXT_PRIMARY);
        titleCol.addView(title);

        TextView sub = new TextView(getContext());
        sub.setText("तपाईंको विगतका परीक्षा नतिजाहरू");
        sub.setTextSize(TypedValue.COMPLEX_UNIT_SP, 12);
        sub.setTextColor(UiTheme.TEXT_SECONDARY);
        titleCol.addView(sub);

        topBar.addView(titleCol);

        // Clear button
        TextView clearBtn = new TextView(getContext());
        clearBtn.setText("Clear");
        clearBtn.setTextSize(TypedValue.COMPLEX_UNIT_SP, 13);
        clearBtn.setTypeface(Typeface.DEFAULT_BOLD);
        clearBtn.setTextColor(UiTheme.DANGER);
        clearBtn.setPadding(UiTheme.dp(getContext(), 10), UiTheme.dp(getContext(), 6),
                            UiTheme.dp(getContext(), 10), UiTheme.dp(getContext(), 6));
        clearBtn.setBackground(UiTheme.round(UiTheme.DANGER_BG, UiTheme.dp(getContext(), 8)));
        clearBtn.setOnClickListener(v -> confirmClear());
        topBar.addView(clearBtn);

        content.addView(topBar);

        // Stats Header
        statsHeaderLayout = new LinearLayout(getContext());
        statsHeaderLayout.setOrientation(VERTICAL);
        content.addView(statsHeaderLayout);

        // History items
        historyListLayout = new LinearLayout(getContext());
        historyListLayout.setOrientation(VERTICAL);
        content.addView(historyListLayout);

        scrollView.addView(content);
        addView(scrollView, new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT));

        refresh();
    }

    public void refresh() {
        statsHeaderLayout.removeAllViews();
        historyListLayout.removeAllViews();

        List<ScoreRecord> records = scoreStore.getAll();
        int total = records.size();
        int passed = scoreStore.getPassedCount();
        int failed = total - passed;
        double passRate = (total > 0) ? (passed * 100.0 / total) : 0.0;
        double avg = scoreStore.getAverageScore();

        // 1. Overall Scorecard
        LinearLayout card = new LinearLayout(getContext());
        card.setOrientation(VERTICAL);
        card.setBackground(UiTheme.borderRound(UiTheme.BG_CARD, UiTheme.BORDER_LIGHT, 1, UiTheme.dp(getContext(), 14)));
        card.setPadding(UiTheme.dp(getContext(), 16), UiTheme.dp(getContext(), 14),
                         UiTheme.dp(getContext(), 16), UiTheme.dp(getContext(), 14));

        LinearLayout statsRow = new LinearLayout(getContext());
        statsRow.setOrientation(HORIZONTAL);
        statsRow.setWeightSum(4);

        LayoutParams p = new LayoutParams(0, LayoutParams.WRAP_CONTENT, 1);
        statsRow.addView(createMetric("Attempts", String.valueOf(total), UiTheme.TEXT_PRIMARY), p);
        statsRow.addView(createMetric("Passed", String.valueOf(passed), UiTheme.SUCCESS), p);
        statsRow.addView(createMetric("Failed", String.valueOf(failed), UiTheme.DANGER), p);
        statsRow.addView(createMetric("Pass Rate", String.format(Locale.getDefault(), "%.0f%%", passRate), UiTheme.BRAND_PRIMARY), p);

        card.addView(statsRow);

        LayoutParams cardParams = new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT);
        cardParams.bottomMargin = UiTheme.dp(getContext(), 16);
        statsHeaderLayout.addView(card, cardParams);

        // 2. Records List
        if (records.isEmpty()) {
            LinearLayout emptyBox = new LinearLayout(getContext());
            emptyBox.setOrientation(VERTICAL);
            emptyBox.setGravity(Gravity.CENTER);
            emptyBox.setPadding(0, UiTheme.dp(getContext(), 40), 0, UiTheme.dp(getContext(), 40));

            TextView icon = new TextView(getContext());
            icon.setText("📊");
            icon.setTextSize(TypedValue.COMPLEX_UNIT_SP, 48);
            emptyBox.addView(icon);

            TextView emptyTitle = new TextView(getContext());
            emptyTitle.setText("No Exam History Yet");
            emptyTitle.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
            emptyTitle.setTypeface(Typeface.DEFAULT_BOLD);
            emptyTitle.setTextColor(UiTheme.TEXT_PRIMARY);
            emptyTitle.setPadding(0, UiTheme.dp(getContext(), 8), 0, 0);
            emptyBox.addView(emptyTitle);

            TextView emptySub = new TextView(getContext());
            emptySub.setText("Complete your first practice exam to track your scores and progress.");
            emptySub.setTextSize(TypedValue.COMPLEX_UNIT_SP, 13);
            emptySub.setTextColor(UiTheme.TEXT_SECONDARY);
            emptySub.setGravity(Gravity.CENTER);
            emptySub.setPadding(UiTheme.dp(getContext(), 24), UiTheme.dp(getContext(), 4),
                                UiTheme.dp(getContext(), 24), UiTheme.dp(getContext(), 16));
            emptyBox.addView(emptySub);

            Button startBtn = new Button(getContext());
            startBtn.setText("BROWSE EXAMS");
            startBtn.setTextSize(TypedValue.COMPLEX_UNIT_SP, 13);
            startBtn.setTypeface(Typeface.DEFAULT_BOLD);
            startBtn.setTextColor(Color.WHITE);
            UiTheme.ripple(startBtn, UiTheme.BRAND_PRIMARY, Color.WHITE, UiTheme.dp(getContext(), 8));
            startBtn.setOnClickListener(v -> {
                if (listener != null) listener.onStartExamRequested();
            });
            emptyBox.addView(startBtn);

            historyListLayout.addView(emptyBox);
            return;
        }

        for (ScoreRecord r : records) {
            historyListLayout.addView(createRecordItem(r));
        }
    }

    private View createMetric(String label, String value, int color) {
        LinearLayout col = new LinearLayout(getContext());
        col.setOrientation(VERTICAL);
        col.setGravity(Gravity.CENTER);

        TextView val = new TextView(getContext());
        val.setText(value);
        val.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
        val.setTypeface(Typeface.DEFAULT_BOLD);
        val.setTextColor(color);

        TextView lbl = new TextView(getContext());
        lbl.setText(label);
        lbl.setTextSize(TypedValue.COMPLEX_UNIT_SP, 10);
        lbl.setTextColor(UiTheme.TEXT_SECONDARY);
        lbl.setPadding(0, UiTheme.dp(getContext(), 2), 0, 0);

        col.addView(val);
        col.addView(lbl);
        return col;
    }

    private View createRecordItem(ScoreRecord r) {
        LinearLayout row = new LinearLayout(getContext());
        row.setOrientation(VERTICAL);
        row.setBackground(UiTheme.borderRound(UiTheme.BG_CARD, UiTheme.BORDER_LIGHT, 1, UiTheme.dp(getContext(), 12)));
        row.setPadding(UiTheme.dp(getContext(), 14), UiTheme.dp(getContext(), 12),
                        UiTheme.dp(getContext(), 14), UiTheme.dp(getContext(), 12));

        LinearLayout topRow = new LinearLayout(getContext());
        topRow.setOrientation(HORIZONTAL);
        topRow.setGravity(Gravity.CENTER_VERTICAL);

        LinearLayout titleCol = new LinearLayout(getContext());
        titleCol.setOrientation(VERTICAL);
        LayoutParams tcParams = new LayoutParams(0, LayoutParams.WRAP_CONTENT, 1);
        titleCol.setLayoutParams(tcParams);

        TextView title = new TextView(getContext());
        title.setText(r.testTitle);
        title.setTextSize(TypedValue.COMPLEX_UNIT_SP, 15);
        title.setTypeface(Typeface.DEFAULT_BOLD);
        title.setTextColor(UiTheme.TEXT_PRIMARY);
        titleCol.addView(title);

        TextView date = new TextView(getContext());
        date.setText(r.getFormattedDate() + " • Duration: " + r.getFormattedTimeSpent());
        date.setTextSize(TypedValue.COMPLEX_UNIT_SP, 11);
        date.setTextColor(UiTheme.TEXT_SECONDARY);
        titleCol.addView(date);

        topRow.addView(titleCol);

        // Status badge
        TextView badge = new TextView(getContext());
        badge.setText(String.format(Locale.getDefault(), "%.0f%% %s",
            r.percentage, r.passed ? "PASS" : "FAIL"));
        badge.setTextSize(TypedValue.COMPLEX_UNIT_SP, 12);
        badge.setTypeface(Typeface.DEFAULT_BOLD);
        badge.setTextColor(r.passed ? UiTheme.SUCCESS : UiTheme.DANGER);
        badge.setPadding(UiTheme.dp(getContext(), 10), UiTheme.dp(getContext(), 4),
                         UiTheme.dp(getContext(), 10), UiTheme.dp(getContext(), 4));
        badge.setBackground(UiTheme.round(r.passed ? UiTheme.SUCCESS_BG : UiTheme.DANGER_BG, UiTheme.dp(getContext(), 8)));
        topRow.addView(badge);

        row.addView(topRow);

        // Score bar
        TextView scoreFrac = new TextView(getContext());
        scoreFrac.setText("Questions Correct: " + r.score + " / " + r.total);
        scoreFrac.setTextSize(TypedValue.COMPLEX_UNIT_SP, 12);
        scoreFrac.setTextColor(UiTheme.TEXT_MUTED);
        scoreFrac.setPadding(0, UiTheme.dp(getContext(), 6), 0, 0);
        row.addView(scoreFrac);

        LayoutParams p = new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT);
        p.bottomMargin = UiTheme.dp(getContext(), 10);
        row.setLayoutParams(p);
        return row;
    }

    private void confirmClear() {
        if (scoreStore.getTotalExams() == 0) return;
        new AlertDialog.Builder(getContext())
            .setTitle("Clear History?")
            .setMessage("All your previous exam results and practice scores will be deleted.")
            .setPositiveButton("Clear All", (dialog, which) -> {
                scoreStore.clearAll();
                refresh();
            })
            .setNegativeButton("Cancel", null)
            .show();
    }
}

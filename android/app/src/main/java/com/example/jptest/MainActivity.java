package com.example.jptest;

import android.app.Activity;
import android.graphics.Color;
import android.graphics.Typeface;
import android.os.Bundle;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

public class MainActivity extends Activity {

    private static final int TAB_EXAMS = 0;
    private static final int TAB_RUNNER = 1;
    private static final int TAB_HISTORY = 2;
    private static final int TAB_GUIDE = 3;

    private ScoreStore scoreStore;

    private FrameLayout contentFrame;
    private LinearLayout bottomNav;

    private ExamHubView examHubView;
    private ExamRunnerView examRunnerView;
    private ScoreHistoryView scoreHistoryView;
    private GuideView guideView;

    private int activeTab = TAB_EXAMS;
    private long lastBackPressedTime = 0L;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        UiTheme.setStatusAndNavBar(this);

        scoreStore = new ScoreStore(this);

        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackgroundColor(UiTheme.BG_CANVAS);

        // Main content container
        contentFrame = new FrameLayout(this);
        LinearLayout.LayoutParams contentParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, 0, 1
        );
        root.addView(contentFrame, contentParams);

        // Instantiate Views
        examHubView = new ExamHubView(this, scoreStore, this::launchExam);

        examRunnerView = new ExamRunnerView(this, scoreStore, new ExamRunnerView.ExamRunnerListener() {
            @Override
            public void onExamFinished() {
                examHubView.refreshStats();
                examHubView.renderExams();
                scoreHistoryView.refresh();
            }

            @Override
            public void onRequestExit() {
                switchTab(TAB_EXAMS);
                examHubView.refreshStats();
                examHubView.renderExams();
                scoreHistoryView.refresh();
            }
        });

        scoreHistoryView = new ScoreHistoryView(this, scoreStore, () -> switchTab(TAB_EXAMS));
        guideView = new GuideView(this);

        // Bottom Navigation Bar
        bottomNav = createBottomNav();
        root.addView(bottomNav, new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, UiTheme.dp(this, 58)
        ));

        setContentView(root);

        // Start on Exams Hub
        switchTab(TAB_EXAMS);
    }

    public void launchExam(ExamItem exam) {
        switchTab(TAB_RUNNER);
        examRunnerView.loadExam(exam);
    }

    private LinearLayout createBottomNav() {
        LinearLayout nav = new LinearLayout(this);
        nav.setOrientation(LinearLayout.HORIZONTAL);
        nav.setBackgroundColor(UiTheme.BRAND_NAVY);
        nav.setWeightSum(4);
        nav.setElevation(UiTheme.dp(this, 8));

        LinearLayout.LayoutParams p = new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.MATCH_PARENT, 1);

        nav.addView(createNavItem("📚", "Exams", TAB_EXAMS), p);
        nav.addView(createNavItem("⏱️", "Test Run", TAB_RUNNER), p);
        nav.addView(createNavItem("📊", "History", TAB_HISTORY), p);
        nav.addView(createNavItem("ℹ️", "Guide", TAB_GUIDE), p);

        return nav;
    }

    private View createNavItem(String icon, String label, final int tabIndex) {
        LinearLayout item = new LinearLayout(this);
        item.setOrientation(LinearLayout.VERTICAL);
        item.setGravity(Gravity.CENTER);
        item.setClickable(true);

        TextView iconTv = new TextView(this);
        iconTv.setText(icon);
        iconTv.setTextSize(TypedValue.COMPLEX_UNIT_SP, 18);
        iconTv.setGravity(Gravity.CENTER);
        iconTv.setTag("icon_" + tabIndex);
        item.addView(iconTv);

        TextView labelTv = new TextView(this);
        labelTv.setText(label);
        labelTv.setTextSize(TypedValue.COMPLEX_UNIT_SP, 11);
        labelTv.setGravity(Gravity.CENTER);
        labelTv.setTypeface(Typeface.DEFAULT_BOLD);
        labelTv.setTag("label_" + tabIndex);
        item.addView(labelTv);

        item.setOnClickListener(v -> switchTab(tabIndex));
        item.setTag("item_" + tabIndex);
        return item;
    }

    private void switchTab(int tabIndex) {
        activeTab = tabIndex;
        contentFrame.removeAllViews();

        View targetView;
        switch (tabIndex) {
            case TAB_RUNNER:
                targetView = examRunnerView;
                break;
            case TAB_HISTORY:
                scoreHistoryView.refresh();
                targetView = scoreHistoryView;
                break;
            case TAB_GUIDE:
                targetView = guideView;
                break;
            case TAB_EXAMS:
            default:
                examHubView.refreshStats();
                targetView = examHubView;
                break;
        }

        contentFrame.addView(targetView, new FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT
        ));

        // Update nav appearance
        for (int i = 0; i < 4; i++) {
            TextView labelTv = bottomNav.findViewWithTag("label_" + i);
            if (labelTv != null) {
                boolean active = (i == tabIndex);
                labelTv.setTextColor(active ? UiTheme.BRAND_PRIMARY_LIGHT : UiTheme.TEXT_MUTED);
                labelTv.setTypeface(active ? Typeface.DEFAULT_BOLD : Typeface.DEFAULT);
            }
        }
    }

    @Override
    public void onBackPressed() {
        if (activeTab == TAB_RUNNER && examRunnerView.isExamRunning()) {
            examRunnerView.confirmExit();
            return;
        }

        if (activeTab != TAB_EXAMS) {
            switchTab(TAB_EXAMS);
            return;
        }

        long now = System.currentTimeMillis();
        if (now - lastBackPressedTime < 2000L) {
            finish();
        } else {
            lastBackPressedTime = now;
            Toast.makeText(this, "Press back again to exit JFT Mock Test.", Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    protected void onDestroy() {
        if (examRunnerView != null) {
            examRunnerView.onDestroy();
        }
        super.onDestroy();
    }
}

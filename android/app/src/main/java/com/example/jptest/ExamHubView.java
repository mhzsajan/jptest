package com.example.jptest;

import android.content.Context;
import android.graphics.Color;
import android.graphics.Typeface;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.HorizontalScrollView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import java.util.List;
import java.util.Locale;

public class ExamHubView extends LinearLayout {

    public interface OnExamSelectedListener {
        void onExamSelected(ExamItem exam);
    }

    private final OnExamSelectedListener listener;
    private final ScoreStore scoreStore;

    private String selectedCategory = ExamCatalog.CAT_ALL;
    private String currentSearch = "";

    private LinearLayout statsContainer;
    private LinearLayout chipsContainer;
    private LinearLayout examsListLayout;
    private EditText searchInput;

    public ExamHubView(Context context, ScoreStore scoreStore, OnExamSelectedListener listener) {
        super(context);
        this.scoreStore = scoreStore;
        this.listener = listener;
        init();
    }

    private void init() {
        setOrientation(VERTICAL);
        setBackgroundColor(UiTheme.BG_CANVAS);

        // Scrollable content
        ScrollView scrollView = new ScrollView(getContext());
        scrollView.setFillViewport(true);
        scrollView.setVerticalScrollBarEnabled(false);

        LinearLayout contentLayout = new LinearLayout(getContext());
        contentLayout.setOrientation(VERTICAL);
        contentLayout.setPadding(UiTheme.dp(getContext(), 16), UiTheme.dp(getContext(), 16),
                                  UiTheme.dp(getContext(), 16), UiTheme.dp(getContext(), 24));

        // 1. Header Banner
        contentLayout.addView(createHeader());

        // 2. Summary Stats Card
        statsContainer = new LinearLayout(getContext());
        statsContainer.setOrientation(VERTICAL);
        contentLayout.addView(statsContainer);
        refreshStats();

        // 3. Search Bar
        contentLayout.addView(createSearchBar());

        // 4. Category Filter Chips
        chipsContainer = new LinearLayout(getContext());
        chipsContainer.setOrientation(HORIZONTAL);
        HorizontalScrollView hsv = new HorizontalScrollView(getContext());
        hsv.setHorizontalScrollBarEnabled(false);
        hsv.addView(chipsContainer);
        hsv.setPadding(0, 0, 0, UiTheme.dp(getContext(), 12));
        contentLayout.addView(hsv);
        setupChips();

        // 5. Exam Cards Container
        examsListLayout = new LinearLayout(getContext());
        examsListLayout.setOrientation(VERTICAL);
        contentLayout.addView(examsListLayout);

        scrollView.addView(contentLayout);
        addView(scrollView, new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT));

        renderExams();
    }

    private View createHeader() {
        LinearLayout header = new LinearLayout(getContext());
        header.setOrientation(VERTICAL);
        header.setPadding(0, 0, 0, UiTheme.dp(getContext(), 14));

        TextView title = new TextView(getContext());
        title.setText("JFT & SSW Mock Exam Hub");
        title.setTextSize(TypedValue.COMPLEX_UNIT_SP, 22);
        title.setTypeface(Typeface.DEFAULT_BOLD);
        title.setTextColor(UiTheme.TEXT_PRIMARY);

        TextView sub = new TextView(getContext());
        sub.setText("जापानी भाषा तथा निर्दिष्ट सीप (Tokutei Ginou) नमुना परीक्षा");
        sub.setTextSize(TypedValue.COMPLEX_UNIT_SP, 13);
        sub.setTextColor(UiTheme.TEXT_SECONDARY);
        sub.setPadding(0, UiTheme.dp(getContext(), 2), 0, 0);

        header.addView(title);
        header.addView(sub);
        return header;
    }

    public void refreshStats() {
        statsContainer.removeAllViews();

        int total = scoreStore.getTotalExams();
        int passed = scoreStore.getPassedCount();
        double avg = scoreStore.getAverageScore();

        LinearLayout card = new LinearLayout(getContext());
        card.setOrientation(HORIZONTAL);
        card.setBackground(UiTheme.borderRound(UiTheme.BG_CARD, UiTheme.BORDER_LIGHT, 1, UiTheme.dp(getContext(), 14)));
        card.setPadding(UiTheme.dp(getContext(), 16), UiTheme.dp(getContext(), 14),
                         UiTheme.dp(getContext(), 16), UiTheme.dp(getContext(), 14));
        card.setWeightSum(3);

        LayoutParams p = new LayoutParams(0, LayoutParams.WRAP_CONTENT, 1);

        card.addView(createStatItem("Tests Taken", String.valueOf(total), UiTheme.BRAND_PRIMARY), p);
        card.addView(createStatItem("Average", String.format(Locale.getDefault(), "%.0f%%", avg), UiTheme.CAT_FOOD), p);
        card.addView(createStatItem("Passed", passed + " / " + total, UiTheme.SUCCESS), p);

        LayoutParams cardParams = new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT);
        cardParams.bottomMargin = UiTheme.dp(getContext(), 14);
        statsContainer.addView(card, cardParams);
    }

    private View createStatItem(String label, String value, int color) {
        LinearLayout item = new LinearLayout(getContext());
        item.setOrientation(VERTICAL);
        item.setGravity(Gravity.CENTER);

        TextView valTv = new TextView(getContext());
        valTv.setText(value);
        valTv.setTextSize(TypedValue.COMPLEX_UNIT_SP, 18);
        valTv.setTypeface(Typeface.DEFAULT_BOLD);
        valTv.setTextColor(color);

        TextView lblTv = new TextView(getContext());
        lblTv.setText(label);
        lblTv.setTextSize(TypedValue.COMPLEX_UNIT_SP, 11);
        lblTv.setTextColor(UiTheme.TEXT_SECONDARY);
        lblTv.setPadding(0, UiTheme.dp(getContext(), 2), 0, 0);

        item.addView(valTv);
        item.addView(lblTv);
        return item;
    }

    private View createSearchBar() {
        LinearLayout searchBox = new LinearLayout(getContext());
        searchBox.setOrientation(HORIZONTAL);
        searchBox.setGravity(Gravity.CENTER_VERTICAL);
        searchBox.setBackground(UiTheme.borderRound(UiTheme.BG_CARD, UiTheme.BORDER_LIGHT, 1, UiTheme.dp(getContext(), 12)));
        searchBox.setPadding(UiTheme.dp(getContext(), 12), 0, UiTheme.dp(getContext(), 12), 0);

        TextView icon = new TextView(getContext());
        icon.setText("🔍");
        icon.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
        icon.setPadding(0, 0, UiTheme.dp(getContext(), 8), 0);
        searchBox.addView(icon);

        searchInput = new EditText(getContext());
        searchInput.setHint("Search test by name, trade or category...");
        searchInput.setHintTextColor(UiTheme.TEXT_MUTED);
        searchInput.setTextColor(UiTheme.TEXT_PRIMARY);
        searchInput.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
        searchInput.setBackground(null);
        searchInput.setSingleLine(true);
        searchInput.setLayoutParams(new LayoutParams(LayoutParams.MATCH_PARENT, UiTheme.dp(getContext(), 46)));

        searchInput.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override
            public void onTextChanged(CharSequence s, int start, int count, int after) {
                currentSearch = s.toString();
                renderExams();
            }
            @Override
            public void afterTextChanged(Editable s) {}
        });

        searchBox.addView(searchInput);

        LayoutParams p = new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT);
        p.bottomMargin = UiTheme.dp(getContext(), 12);
        searchBox.setLayoutParams(p);
        return searchBox;
    }

    private void setupChips() {
        chipsContainer.removeAllViews();
        String[] categories = new String[]{
            ExamCatalog.CAT_ALL,
            ExamCatalog.CAT_JFT,
            ExamCatalog.CAT_SSW,
            ExamCatalog.CAT_NURSING
        };

        for (String cat : categories) {
            final String categoryName = cat;
            boolean isSelected = categoryName.equalsIgnoreCase(selectedCategory);

            TextView chip = new TextView(getContext());
            chip.setText(categoryName);
            chip.setTextSize(TypedValue.COMPLEX_UNIT_SP, 13);
            chip.setTypeface(isSelected ? Typeface.DEFAULT_BOLD : Typeface.DEFAULT);
            chip.setTextColor(isSelected ? Color.WHITE : UiTheme.TEXT_PRIMARY);
            chip.setPadding(UiTheme.dp(getContext(), 14), UiTheme.dp(getContext(), 7),
                            UiTheme.dp(getContext(), 14), UiTheme.dp(getContext(), 7));

            int bg = isSelected ? UiTheme.BRAND_PRIMARY : UiTheme.BG_CARD;
            int border = isSelected ? UiTheme.BRAND_PRIMARY : UiTheme.BORDER_LIGHT;
            chip.setBackground(UiTheme.borderRound(bg, border, 1, UiTheme.dp(getContext(), 20)));

            LayoutParams cp = new LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT);
            cp.rightMargin = UiTheme.dp(getContext(), 8);
            chip.setLayoutParams(cp);

            chip.setOnClickListener(v -> {
                selectedCategory = categoryName;
                setupChips();
                renderExams();
            });

            chipsContainer.addView(chip);
        }
    }

    public void renderExams() {
        examsListLayout.removeAllViews();
        List<ExamItem> items = ExamCatalog.filter(selectedCategory, currentSearch);

        if (items.isEmpty()) {
            TextView empty = new TextView(getContext());
            empty.setText("No tests found matching your search.");
            empty.setGravity(Gravity.CENTER);
            empty.setPadding(0, UiTheme.dp(getContext(), 32), 0, 0);
            empty.setTextColor(UiTheme.TEXT_MUTED);
            examsListLayout.addView(empty);
            return;
        }

        for (ExamItem item : items) {
            examsListLayout.addView(createExamCard(item));
        }
    }

    private View createExamCard(ExamItem item) {
        LinearLayout card = new LinearLayout(getContext());
        card.setOrientation(VERTICAL);
        card.setBackground(UiTheme.borderRound(UiTheme.BG_CARD, UiTheme.BORDER_LIGHT, 1, UiTheme.dp(getContext(), 14)));
        card.setPadding(UiTheme.dp(getContext(), 16), UiTheme.dp(getContext(), 14),
                         UiTheme.dp(getContext(), 16), UiTheme.dp(getContext(), 14));

        // Top Badges Row
        LinearLayout badgeRow = new LinearLayout(getContext());
        badgeRow.setOrientation(HORIZONTAL);
        badgeRow.setGravity(Gravity.CENTER_VERTICAL);

        // Category Pill
        TextView catPill = new TextView(getContext());
        catPill.setText(item.category.toUpperCase(Locale.ROOT));
        catPill.setTextSize(TypedValue.COMPLEX_UNIT_SP, 10);
        catPill.setTypeface(Typeface.DEFAULT_BOLD);
        catPill.setTextColor(item.accentColor);
        catPill.setPadding(UiTheme.dp(getContext(), 8), UiTheme.dp(getContext(), 3),
                           UiTheme.dp(getContext(), 8), UiTheme.dp(getContext(), 3));
        catPill.setBackground(UiTheme.round(Color.argb(25, Color.red(item.accentColor),
                                             Color.green(item.accentColor), Color.blue(item.accentColor)),
                                             UiTheme.dp(getContext(), 6)));
        badgeRow.addView(catPill);

        // Audio Badge (if applicable)
        if (item.hasAudio) {
            TextView audioPill = new TextView(getContext());
            audioPill.setText("🎧 AUDIO LISTENING");
            audioPill.setTextSize(TypedValue.COMPLEX_UNIT_SP, 10);
            audioPill.setTypeface(Typeface.DEFAULT_BOLD);
            audioPill.setTextColor(UiTheme.BRAND_PRIMARY);
            audioPill.setPadding(UiTheme.dp(getContext(), 8), UiTheme.dp(getContext(), 3),
                                 UiTheme.dp(getContext(), 8), UiTheme.dp(getContext(), 3));
            audioPill.setBackground(UiTheme.round(UiTheme.BRAND_PRIMARY_LIGHT, UiTheme.dp(getContext(), 6)));

            LayoutParams ap = new LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT);
            ap.leftMargin = UiTheme.dp(getContext(), 6);
            badgeRow.addView(audioPill, ap);
        }

        card.addView(badgeRow);

        // Exam Title
        TextView title = new TextView(getContext());
        title.setText(item.title);
        title.setTextSize(TypedValue.COMPLEX_UNIT_SP, 17);
        title.setTypeface(Typeface.DEFAULT_BOLD);
        title.setTextColor(UiTheme.TEXT_PRIMARY);
        title.setPadding(0, UiTheme.dp(getContext(), 6), 0, 0);
        card.addView(title);

        // Nepali Title
        TextView nepali = new TextView(getContext());
        nepali.setText(item.nepaliTitle);
        nepali.setTextSize(TypedValue.COMPLEX_UNIT_SP, 12);
        nepali.setTextColor(UiTheme.TEXT_SECONDARY);
        nepali.setPadding(0, UiTheme.dp(getContext(), 1), 0, UiTheme.dp(getContext(), 6));
        card.addView(nepali);

        // Details Row: Questions, Time, Passing score
        LinearLayout metaRow = new LinearLayout(getContext());
        metaRow.setOrientation(HORIZONTAL);
        metaRow.setGravity(Gravity.CENTER_VERTICAL);

        metaRow.addView(createMetaBadge("📝 " + item.questionsCount + " Qs"));
        metaRow.addView(createMetaBadge("⏱️ " + item.durationMinutes + "m"));
        metaRow.addView(createMetaBadge("🎯 Pass: " + item.passingScorePercent + "%"));
        card.addView(metaRow);

        // Best Attempt badge (if any)
        ScoreRecord best = scoreStore.getBestScore(item.title);
        if (best != null) {
            TextView bestTv = new TextView(getContext());
            bestTv.setText(String.format(Locale.getDefault(), "🏆 Best Attempt: %.0f%% (%s)",
                best.percentage, best.passed ? "PASSED" : "FAILED"));
            bestTv.setTextSize(TypedValue.COMPLEX_UNIT_SP, 11);
            bestTv.setTextColor(best.passed ? UiTheme.SUCCESS : UiTheme.DANGER);
            bestTv.setPadding(0, UiTheme.dp(getContext(), 6), 0, 0);
            card.addView(bestTv);
        }

        // Action Button: "Start Exam"
        Button startBtn = new Button(getContext());
        startBtn.setText("START PRACTICE EXAM");
        startBtn.setTextSize(TypedValue.COMPLEX_UNIT_SP, 13);
        startBtn.setTypeface(Typeface.DEFAULT_BOLD);
        startBtn.setTextColor(Color.WHITE);
        UiTheme.ripple(startBtn, item.accentColor, Color.WHITE, UiTheme.dp(getContext(), 8));

        LayoutParams btnParams = new LayoutParams(LayoutParams.MATCH_PARENT, UiTheme.dp(getContext(), 42));
        btnParams.topMargin = UiTheme.dp(getContext(), 12);
        startBtn.setLayoutParams(btnParams);

        startBtn.setOnClickListener(v -> {
            if (listener != null) {
                listener.onExamSelected(item);
            }
        });

        card.addView(startBtn);

        LayoutParams cardParams = new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT);
        cardParams.bottomMargin = UiTheme.dp(getContext(), 12);
        card.setLayoutParams(cardParams);
        return card;
    }

    private View createMetaBadge(String text) {
        TextView tv = new TextView(getContext());
        tv.setText(text);
        tv.setTextSize(TypedValue.COMPLEX_UNIT_SP, 12);
        tv.setTextColor(UiTheme.TEXT_SECONDARY);
        tv.setPadding(UiTheme.dp(getContext(), 8), UiTheme.dp(getContext(), 3),
                      UiTheme.dp(getContext(), 8), UiTheme.dp(getContext(), 3));
        tv.setBackground(UiTheme.round(UiTheme.BORDER_LIGHT, UiTheme.dp(getContext(), 6)));

        LayoutParams p = new LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT);
        p.rightMargin = UiTheme.dp(getContext(), 6);
        tv.setLayoutParams(p);
        return tv;
    }
}

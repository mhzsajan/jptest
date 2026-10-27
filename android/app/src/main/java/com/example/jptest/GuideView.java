package com.example.jptest;

import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.Typeface;
import android.net.Uri;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

public class GuideView extends LinearLayout {

    public GuideView(Context context) {
        super(context);
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
                            UiTheme.dp(getContext(), 16), UiTheme.dp(getContext(), 28));

        // Header
        TextView title = new TextView(getContext());
        title.setText("Exam Guide & Rules");
        title.setTextSize(TypedValue.COMPLEX_UNIT_SP, 22);
        title.setTypeface(Typeface.DEFAULT_BOLD);
        title.setTextColor(UiTheme.TEXT_PRIMARY);
        content.addView(title);

        TextView sub = new TextView(getContext());
        sub.setText("JFT-Basic तथा निर्दिष्ट सीप (SSW) परीक्षा सम्बन्धी जानकारी");
        sub.setTextSize(TypedValue.COMPLEX_UNIT_SP, 13);
        sub.setTextColor(UiTheme.TEXT_SECONDARY);
        sub.setPadding(0, UiTheme.dp(getContext(), 2), 0, UiTheme.dp(getContext(), 16));
        content.addView(sub);

        // 1. JFT-Basic Guide Card
        content.addView(createSectionCard(
            "🇯🇵 JFT-Basic Exam Overview",
            "• Total Questions: ~50-60 Questions\n" +
            "• Test Duration: 60 Minutes (Computer Based Test)\n" +
            "• Passing Score: 200 out of 250 points (~80%)\n" +
            "• 4 Sections:\n" +
            "   1. 文字と語彙 (Script & Vocabulary): Kanji reading & word meanings\n" +
            "   2. 会話と表現 (Conversation & Expression): Daily situational Japanese\n" +
            "   3. 聴解 (Listening Comprehension): Audio played max 2 times!\n" +
            "   4. 読解 (Reading Comprehension): Short notices, forms & articles",
            UiTheme.CAT_JFT
        ));

        // 2. SSW Skills Card
        content.addView(createSectionCard(
            "💼 Tokutei Ginou (SSW) Trades",
            "• Prometric CBT format held in Nepal (Kathmandu/Chitwan).\n" +
            "• Food Service (外食業): Food safety, sanitation, cooking, customer service.\n" +
            "• Agriculture (農業): Cultivation management, livestock, harvesting & safety.\n" +
            "• Building Cleaning (ビルクリーニング): Chemical safety, cleaning tools, facility care.\n" +
            "• Nursing Care (介護): Ethics, body mechanics, ADL assistance, hygiene.",
            UiTheme.CAT_FOOD
        ));

        // 3. Audio Rule Card
        content.addView(createSectionCard(
            "🎧 Official Audio 2-Play Limit",
            "In official CBT Prometric tests:\n" +
            "• You are allowed to play each audio listening question at most TWO (2) times.\n" +
            "• Once the second play finishes, the audio is locked.\n" +
            "• Our mock test engine strictly simulates this exact behavior so you build real exam discipline.",
            UiTheme.BRAND_PRIMARY
        ));

        // 4. Nepali Tips Card
        content.addView(createSectionCard(
            "🇳🇵 परीक्षा तयारीका लागि महत्वपूर्ण टिप्स",
            "१. समय व्यवस्थापन: ६० मिनेटमा ५५-६० वटा प्रश्न गर्नुपर्ने भएकाले एउटै प्रश्नमा धेरै समय नअल्झिनुहोस्।\n" +
            "२. अडियो सुन्ने तरिका: अडियो सुरु हुनुअगाडि प्रश्न र विकल्पहरू छिटो पढेर तयार रहनुहोस्।\n" +
            "३. दैनिक अभ्यास: नमुना परीक्षा नियमित दिएर आफ्नो गति र अंक सुधार गर्नुहोस्।",
            UiTheme.CAT_NURSE_NEP
        ));

        // 5. Consultancy & Support
        LinearLayout contactCard = new LinearLayout(getContext());
        contactCard.setOrientation(VERTICAL);
        contactCard.setBackground(UiTheme.borderRound(UiTheme.BG_CARD, UiTheme.BORDER_LIGHT, 1, UiTheme.dp(getContext(), 14)));
        contactCard.setPadding(UiTheme.dp(getContext(), 16), UiTheme.dp(getContext(), 16),
                               UiTheme.dp(getContext(), 16), UiTheme.dp(getContext(), 16));

        TextView consultTitle = new TextView(getContext());
        consultTitle.setText("Skill Point Education Consultancy");
        consultTitle.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
        consultTitle.setTypeface(Typeface.DEFAULT_BOLD);
        consultTitle.setTextColor(UiTheme.TEXT_PRIMARY);
        contactCard.addView(consultTitle);

        TextView consultDesc = new TextView(getContext());
        consultDesc.setText("Expert Japanese language classes, SSW exam booking, document processing, and interview preparation for Japan.");
        consultDesc.setTextSize(TypedValue.COMPLEX_UNIT_SP, 12);
        consultDesc.setTextColor(UiTheme.TEXT_SECONDARY);
        consultDesc.setPadding(0, UiTheme.dp(getContext(), 4), 0, UiTheme.dp(getContext(), 14));
        contactCard.addView(consultDesc);

        Button waBtn = new Button(getContext());
        waBtn.setText("💬 CONTACT ON WHATSAPP");
        waBtn.setTextSize(TypedValue.COMPLEX_UNIT_SP, 13);
        waBtn.setTypeface(Typeface.DEFAULT_BOLD);
        waBtn.setTextColor(Color.WHITE);
        UiTheme.ripple(waBtn, UiTheme.SUCCESS, Color.WHITE, UiTheme.dp(getContext(), 8));

        waBtn.setOnClickListener(v -> {
            try {
                Intent i = new Intent(Intent.ACTION_VIEW, Uri.parse("https://wa.me/9779860172118"));
                getContext().startActivity(i);
            } catch (Exception e) {
                Toast.makeText(getContext(), "WhatsApp link: +977 9860172118", Toast.LENGTH_SHORT).show();
            }
        });

        contactCard.addView(waBtn);
        content.addView(contactCard);

        scrollView.addView(content);
        addView(scrollView, new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT));
    }

    private View createSectionCard(String title, String body, int accentColor) {
        LinearLayout card = new LinearLayout(getContext());
        card.setOrientation(VERTICAL);
        card.setBackground(UiTheme.borderRound(UiTheme.BG_CARD, UiTheme.BORDER_LIGHT, 1, UiTheme.dp(getContext(), 14)));
        card.setPadding(UiTheme.dp(getContext(), 16), UiTheme.dp(getContext(), 14),
                         UiTheme.dp(getContext(), 16), UiTheme.dp(getContext(), 14));

        TextView titleTv = new TextView(getContext());
        titleTv.setText(title);
        titleTv.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
        titleTv.setTypeface(Typeface.DEFAULT_BOLD);
        titleTv.setTextColor(accentColor);
        card.addView(titleTv);

        TextView bodyTv = new TextView(getContext());
        bodyTv.setText(body);
        bodyTv.setTextSize(TypedValue.COMPLEX_UNIT_SP, 13);
        bodyTv.setLineSpacing(0, 1.25f);
        bodyTv.setTextColor(UiTheme.TEXT_PRIMARY);
        bodyTv.setPadding(0, UiTheme.dp(getContext(), 8), 0, 0);
        card.addView(bodyTv);

        LayoutParams p = new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT);
        p.bottomMargin = UiTheme.dp(getContext(), 12);
        card.setLayoutParams(p);
        return card;
    }
}

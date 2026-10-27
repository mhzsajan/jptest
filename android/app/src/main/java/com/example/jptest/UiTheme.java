package com.example.jptest;

import android.app.Activity;
import android.content.Context;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.drawable.GradientDrawable;
import android.graphics.drawable.RippleDrawable;
import android.content.res.ColorStateList;
import android.os.Build;
import android.util.TypedValue;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;

/**
 * Modern Japanese Aesthetic UI Theme System
 * High-contrast, clean typography, tactile touch feedback.
 */
public final class UiTheme {

    // Primary Brand Palette (Sakura Crimson & Imperial Navy)
    public static final int BRAND_PRIMARY = Color.parseColor("#D32F2F");       // Sakura Crimson
    public static final int BRAND_PRIMARY_DARK = Color.parseColor("#B71C1C");  // Deep Crimson
    public static final int BRAND_PRIMARY_LIGHT = Color.parseColor("#FFCDD2"); // Soft Sakura
    public static final int BRAND_NAVY = Color.parseColor("#0F172A");          // Imperial Slate Navy
    public static final int BRAND_NAVY_LIGHT = Color.parseColor("#1E293B");    // Card Slate

    // Neutral Surfaces
    public static final int BG_CANVAS = Color.parseColor("#F8FAFC");          // Crisp Warm White
    public static final int BG_CARD = Color.parseColor("#FFFFFF");            // Pure White Card
    public static final int TEXT_PRIMARY = Color.parseColor("#0F172A");       // High Contrast Charcoal
    public static final int TEXT_SECONDARY = Color.parseColor("#64748B");     // Slate Gray
    public static final int TEXT_MUTED = Color.parseColor("#94A3B8");         // Light Slate
    public static final int BORDER_LIGHT = Color.parseColor("#E2E8F0");       // Border subtle

    // Feedback Accents
    public static final int SUCCESS = Color.parseColor("#16A34A");            // Forest Green
    public static final int SUCCESS_BG = Color.parseColor("#DCFCE7");         // Light Green Pill
    public static final int DANGER = Color.parseColor("#DC2626");             // Crimson Red
    public static final int DANGER_BG = Color.parseColor("#FEE2E2");          // Light Red Pill
    public static final int WARNING = Color.parseColor("#D97706");            // Amber
    public static final int WARNING_BG = Color.parseColor("#FEF3C7");         // Light Amber

    // Category Specific Accents
    public static final int CAT_JFT = Color.parseColor("#DC2626");            // Crimson Red
    public static final int CAT_FOOD = Color.parseColor("#2563EB");           // Sapphire Blue
    public static final int CAT_AGRI = Color.parseColor("#16A34A");           // Leaf Green
    public static final int CAT_CLEAN = Color.parseColor("#9333EA");          // Royal Purple
    public static final int CAT_GROUND = Color.parseColor("#0D9488");         // Ocean Teal
    public static final int CAT_NURSE_NEP = Color.parseColor("#EA580C");      // Saffron Orange
    public static final int CAT_NURSE_JPN = Color.parseColor("#DB2777");      // Lotus Pink

    public static int dp(Context ctx, int dp) {
        return (int) TypedValue.applyDimension(
            TypedValue.COMPLEX_UNIT_DIP, dp, ctx.getResources().getDisplayMetrics()
        );
    }

    public static GradientDrawable round(int fillColor, int cornerRadiusPx) {
        GradientDrawable gd = new GradientDrawable();
        gd.setShape(GradientDrawable.RECTANGLE);
        gd.setColor(fillColor);
        gd.setCornerRadius(cornerRadiusPx);
        return gd;
    }

    public static GradientDrawable borderRound(int fillColor, int borderColor, int borderWidthPx, int cornerRadiusPx) {
        GradientDrawable gd = new GradientDrawable();
        gd.setShape(GradientDrawable.RECTANGLE);
        gd.setColor(fillColor);
        gd.setStroke(borderWidthPx, borderColor);
        gd.setCornerRadius(cornerRadiusPx);
        return gd;
    }

    public static GradientDrawable gradientRound(int startColor, int endColor, GradientDrawable.Orientation orientation, int cornerRadiusPx) {
        GradientDrawable gd = new GradientDrawable(orientation, new int[]{startColor, endColor});
        gd.setCornerRadius(cornerRadiusPx);
        return gd;
    }

    public static View ripple(View view, int normalColor, int rippleColor, int cornerRadiusPx) {
        GradientDrawable content = round(normalColor, cornerRadiusPx);
        GradientDrawable mask = round(Color.WHITE, cornerRadiusPx);
        RippleDrawable rd = new RippleDrawable(
            ColorStateList.valueOf(rippleColor), content, mask
        );
        view.setBackground(rd);
        return view;
    }

    public static void setStatusAndNavBar(Activity activity) {
        Window w = activity.getWindow();
        w.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        w.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
        w.setStatusBarColor(BRAND_PRIMARY_DARK);
        w.setNavigationBarColor(BRAND_NAVY);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            View decor = w.getDecorView();
            int flags = decor.getSystemUiVisibility();
            // Clear light status bar flag so status bar text is crisp white
            flags &= ~View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
            decor.setSystemUiVisibility(flags);
        }
    }
}

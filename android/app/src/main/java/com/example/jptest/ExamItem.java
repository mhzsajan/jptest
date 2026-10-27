package com.example.jptest;

public class ExamItem {
    public final String id;
    public final String title;
    public final String nepaliTitle;
    public final String category; // "JFT-Basic", "Tokutei SSW", "Nursing Care"
    public final int questionsCount;
    public final int durationMinutes;
    public final int passingScorePercent;
    public final boolean hasAudio;
    public final int accentColor;
    public final String assetPath;
    public final String description;

    public ExamItem(String id, String title, String nepaliTitle, String category,
                    int questionsCount, int durationMinutes, int passingScorePercent,
                    boolean hasAudio, int accentColor, String assetPath, String description) {
        this.id = id;
        this.title = title;
        this.nepaliTitle = nepaliTitle;
        this.category = category;
        this.questionsCount = questionsCount;
        this.durationMinutes = durationMinutes;
        this.passingScorePercent = passingScorePercent;
        this.hasAudio = hasAudio;
        this.accentColor = accentColor;
        this.assetPath = assetPath;
        this.description = description;
    }
}

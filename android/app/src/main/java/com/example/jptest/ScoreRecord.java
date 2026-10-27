package com.example.jptest;

import org.json.JSONException;
import org.json.JSONObject;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class ScoreRecord {
    public final long id;
    public final String testTitle;
    public final String category;
    public final int score;
    public final int total;
    public final double percentage;
    public final boolean passed;
    public final int timeSpentSeconds;
    public final long timestamp;

    public ScoreRecord(long id, String testTitle, String category, int score,
                       int total, double percentage, boolean passed,
                       int timeSpentSeconds, long timestamp) {
        this.id = id;
        this.testTitle = testTitle;
        this.category = category;
        this.score = score;
        this.total = total;
        this.percentage = percentage;
        this.passed = passed;
        this.timeSpentSeconds = timeSpentSeconds;
        this.timestamp = timestamp;
    }

    public JSONObject toJson() {
        JSONObject o = new JSONObject();
        try {
            o.put("id", id);
            o.put("testTitle", testTitle);
            o.put("category", category);
            o.put("score", score);
            o.put("total", total);
            o.put("percentage", percentage);
            o.put("passed", passed);
            o.put("timeSpentSeconds", timeSpentSeconds);
            o.put("timestamp", timestamp);
        } catch (JSONException ignored) {}
        return o;
    }

    public static ScoreRecord fromJson(JSONObject o) {
        try {
            return new ScoreRecord(
                o.optLong("id", System.currentTimeMillis()),
                o.optString("testTitle", "Mock Exam"),
                o.optString("category", "General"),
                o.optInt("score", 0),
                o.optInt("total", 0),
                o.optDouble("percentage", 0.0),
                o.optBoolean("passed", false),
                o.optInt("timeSpentSeconds", 0),
                o.optLong("timestamp", System.currentTimeMillis())
            );
        } catch (Exception e) {
            return null;
        }
    }

    public String getFormattedDate() {
        SimpleDateFormat sdf = new SimpleDateFormat("MMM d, yyyy • h:mm a", Locale.getDefault());
        return sdf.format(new Date(timestamp));
    }

    public String getFormattedTimeSpent() {
        int minutes = timeSpentSeconds / 60;
        int seconds = timeSpentSeconds % 60;
        if (minutes == 0) {
            return seconds + "s";
        }
        return minutes + "m " + seconds + "s";
    }
}

package com.example.jptest;

import android.content.Context;
import android.content.SharedPreferences;
import org.json.JSONArray;
import org.json.JSONObject;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class ScoreStore {

    private static final String PREF_NAME = "jptest_exam_scores";
    private static final String KEY_HISTORY = "history_records";

    private final SharedPreferences prefs;

    public ScoreStore(Context context) {
        this.prefs = context.getApplicationContext().getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
    }

    public synchronized void saveAttempt(ScoreRecord record) {
        List<ScoreRecord> records = getAll();
        records.add(0, record); // prepend newest first

        JSONArray arr = new JSONArray();
        for (ScoreRecord r : records) {
            arr.put(r.toJson());
        }
        prefs.edit().putString(KEY_HISTORY, arr.toString()).apply();
    }

    public synchronized List<ScoreRecord> getAll() {
        String json = prefs.getString(KEY_HISTORY, "[]");
        List<ScoreRecord> list = new ArrayList<>();
        try {
            JSONArray arr = new JSONArray(json);
            for (int i = 0; i < arr.length(); i++) {
                JSONObject obj = arr.getJSONObject(i);
                ScoreRecord rec = ScoreRecord.fromJson(obj);
                if (rec != null) {
                    list.add(rec);
                }
            }
        } catch (Exception ignored) {}
        return list;
    }

    public synchronized int getTotalExams() {
        return getAll().size();
    }

    public synchronized int getPassedCount() {
        int c = 0;
        for (ScoreRecord r : getAll()) {
            if (r.passed) c++;
        }
        return c;
    }

    public synchronized double getAverageScore() {
        List<ScoreRecord> list = getAll();
        if (list.isEmpty()) return 0.0;
        double sum = 0.0;
        for (ScoreRecord r : list) {
            sum += r.percentage;
        }
        return sum / list.size();
    }

    public synchronized ScoreRecord getBestScore(String title) {
        ScoreRecord best = null;
        for (ScoreRecord r : getAll()) {
            if (r.testTitle.equalsIgnoreCase(title)) {
                if (best == null || r.percentage > best.percentage) {
                    best = r;
                }
            }
        }
        return best;
    }

    public synchronized void clearAll() {
        prefs.edit().remove(KEY_HISTORY).apply();
    }
}

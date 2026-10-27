package com.example.jptest;

import java.util.ArrayList;
import java.util.List;

public final class ExamCatalog {

    public static final String CAT_ALL = "All";
    public static final String CAT_JFT = "JFT-Basic";
    public static final String CAT_SSW = "Tokutei SSW";
    public static final String CAT_NURSING = "Nursing Care";

    public static final String BASE_URL = "https://appassets.local/";

    private static final List<ExamItem> EXAMS = new ArrayList<>();

    static {
        // JFT-Basic Exams
        EXAMS.add(new ExamItem(
            "jft-basic-1",
            "JFT Basic Test 1",
            "जेएफटी आधारभूत परीक्षा १",
            CAT_JFT,
            55, 60, 70, true,
            UiTheme.CAT_JFT,
            BASE_URL + "tests/jft-basic-1/index.html",
            "Comprehensive mock exam: Script & Vocabulary, Conversation, Audio Listening (Q50-55), and Reading."
        ));

        EXAMS.add(new ExamItem(
            "jft-basic-2",
            "JFT Basic Test 2",
            "जेएफटी आधारभूत परीक्षा २",
            CAT_JFT,
            55, 60, 80, true,
            UiTheme.CAT_JFT,
            BASE_URL + "tests/jft-basic-2/index.html",
            "Standard JFT exam simulation: Practical daily conversation and audio listening comprehension."
        ));

        EXAMS.add(new ExamItem(
            "jft-basic-3",
            "JFT Basic Test 3",
            "जेएफटी आधारभूत परीक्षा ३",
            CAT_JFT,
            55, 60, 80, true,
            UiTheme.CAT_JFT,
            BASE_URL + "tests/jft-basic-3/index.html",
            "Advanced practice test with listening audio clips and contextual Japanese grammar."
        ));

        EXAMS.add(new ExamItem(
            "jft-basic-4",
            "JFT Basic Test 4",
            "जेएफटी आधारभूत परीक्षा ४",
            CAT_JFT,
            60, 60, 80, true,
            UiTheme.CAT_JFT,
            BASE_URL + "tests/jft-basic-4/index.html",
            "Full-length 60-question preparation test with multi-section audio listening items."
        ));

        // Tokutei Ginou SSW Skills Exams
        EXAMS.add(new ExamItem(
            "food-service",
            "Food Service Test",
            "खाद्य सेवा सीप परीक्षा (Gaiku)",
            CAT_SSW,
            52, 60, 60, false,
            UiTheme.CAT_FOOD,
            BASE_URL + "tests/food-service/index.html",
            "Hygiene management, customer hospitality, kitchen safety, and food preparation fundamentals."
        ));

        EXAMS.add(new ExamItem(
            "agriculture",
            "Agriculture Test",
            "कृषि सीप परीक्षा (Nogyo)",
            CAT_SSW,
            45, 50, 60, false,
            UiTheme.CAT_AGRI,
            BASE_URL + "tests/agriculture/index.html",
            "Crop cultivation, livestock management, agricultural tools, fertilizer safety, and seasonal harvesting."
        ));

        EXAMS.add(new ExamItem(
            "building-cleaning",
            "Building Cleaning Test",
            "भवन सरसफाइ सीप परीक्षा (Biru Cleaning)",
            CAT_SSW,
            50, 60, 60, false,
            UiTheme.CAT_CLEAN,
            BASE_URL + "tests/building-cleaning/index.html",
            "Facility sanitization, chemical detergents, floor machines, safety guidelines, and Japanese workplace protocols."
        ));

        EXAMS.add(new ExamItem(
            "ground-handling",
            "Ground Handling Test",
            "विमानस्थल ग्राउन्ड ह्यान्डलिङ परीक्षा",
            CAT_SSW,
            8, 15, 60, false,
            UiTheme.CAT_GROUND,
            BASE_URL + "tests/ground-handling/index.html",
            "Airport ramp operations, aircraft baggage loading, marshalling signals, and tarmac safety protocols."
        ));

        // Nursing Care (Kaigo) Exams
        EXAMS.add(new ExamItem(
            "nursing-care-nepali-1",
            "Nursing Care Nepali Test 1",
            "हेरचाह सहयोगी (काइगो) नेपाली १",
            CAT_NURSING,
            45, 45, 60, false,
            UiTheme.CAT_NURSE_NEP,
            BASE_URL + "tests/nursing-care-nepali-1/index.html",
            "Elderly dignity, ADL/QOL support, privacy protection, and mobility assistance in complete Nepali."
        ));

        EXAMS.add(new ExamItem(
            "nursing-care-nepali-2",
            "Nursing Care Nepali Test 2",
            "हेरचाह सहयोगी (काइगो) नेपाली २",
            CAT_NURSING,
            45, 50, 60, false,
            UiTheme.CAT_NURSE_NEP,
            BASE_URL + "tests/nursing-care-nepali-2/index.html",
            "Dietary support, wheelchair transfers, dementia communication, and safety hygiene in Nepali."
        ));

        EXAMS.add(new ExamItem(
            "nursing-care-japanese-1",
            "Nursing Care Japanese Test 1",
            "介護技能試験 日本語版 １",
            CAT_NURSING,
            15, 25, 60, false,
            UiTheme.CAT_NURSE_JPN,
            BASE_URL + "tests/nursing-care-japanese-1/index.html",
            "Original Japanese version: Physical care terms, basic medical terminology, and caregiver ethics."
        ));

        EXAMS.add(new ExamItem(
            "nursing-care-japanese-2",
            "Nursing Care Japanese Test 2",
            "介護技能試験 日本語版 ２",
            CAT_NURSING,
            15, 25, 60, false,
            UiTheme.CAT_NURSE_JPN,
            BASE_URL + "tests/nursing-care-japanese-2/index.html",
            "Japanese version: Hygiene, vital signs recording, incident prevention, and client communication."
        ));
    }

    public static List<ExamItem> getAll() {
        return new ArrayList<>(EXAMS);
    }

    public static List<ExamItem> filter(String category, String query) {
        List<ExamItem> filtered = new ArrayList<>();
        String q = (query == null) ? "" : query.trim().toLowerCase();
        for (ExamItem item : EXAMS) {
            boolean matchesCat = CAT_ALL.equalsIgnoreCase(category) || item.category.equalsIgnoreCase(category);
            boolean matchesQuery = q.isEmpty()
                || item.title.toLowerCase().contains(q)
                || item.nepaliTitle.toLowerCase().contains(q)
                || item.description.toLowerCase().contains(q)
                || item.category.toLowerCase().contains(q);

            if (matchesCat && matchesQuery) {
                filtered.add(item);
            }
        }
        return filtered;
    }
}

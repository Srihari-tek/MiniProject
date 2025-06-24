package com.cognitive.app.service;

import com.cognitive.app.dto.ProgressSummary;
import com.cognitive.app.model.QuizResultEntity;
import com.cognitive.app.repository.QuizResultRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProgressService {

    private final QuizResultRepository quizResultRepository;

    private static final Map<String, List<String>> RECOMMENDATION_SKILL_MAP = new HashMap<>();
    static {
        RECOMMENDATION_SKILL_MAP.put("incorporate_motor_skill_exercises", Arrays.asList("Attention Focus Skills"));
        RECOMMENDATION_SKILL_MAP.put("use_peer_modeling_and_social_stories", Arrays.asList("Social Understanding Skills"));
        RECOMMENDATION_SKILL_MAP.put("use_memory_games", Arrays.asList("Memory Skills"));
        RECOMMENDATION_SKILL_MAP.put("apply_visual_math_tools", Arrays.asList("Mathematical Knowledge"));
        RECOMMENDATION_SKILL_MAP.put("include_logical_puzzles", Arrays.asList("Logical Thinking Skills"));
    }

    public ProgressService(QuizResultRepository quizResultRepository) {
        this.quizResultRepository = quizResultRepository;
    }

    public ProgressSummary calculateProgress(String userId) {
        List<QuizResultEntity> submissions = quizResultRepository.findByUserId(userId);

        ProgressSummary summary = new ProgressSummary();
        summary.setTotalQuizzes(submissions.size());

        if (!submissions.isEmpty()) {
            double avgScore = submissions.stream()
                    .mapToDouble(s -> (double) s.getCorrectAnswers() / s.getTotalQuestions() * 100)
                    .average()
                    .orElse(0.0);
            summary.setAverageScore(avgScore);
        }

        // Prepare Skill Score Timeline
        Map<String, SkillTimeline> skillTimelineMap = new HashMap<>();

        LocalDate today = LocalDate.now();
        int currentMonth = today.getMonthValue();
        int currentYear = today.getYear();

        for (QuizResultEntity submission : submissions) {
            double totalScore = (double) submission.getCorrectAnswers() / submission.getTotalQuestions() * 100;
            LocalDate submittedDate = submission.getSubmittedAt().toLocalDate();
            int month = submittedDate.getMonthValue();
            int year = submittedDate.getYear();

            List<String> mappedSkills = mapSkillName(submission);
            int skillCount = mappedSkills.size();

            double scorePerSkill = skillCount > 0 ? totalScore / skillCount : 0.0;

            for (String skill : mappedSkills) {
                SkillTimeline timeline = skillTimelineMap.computeIfAbsent(skill, k -> new SkillTimeline());

                timeline.totalScores.add(scorePerSkill);

                if (month == currentMonth && year == currentYear) {
                    timeline.thisMonthScores.add(scorePerSkill);
                } else if ((month == (currentMonth - 1) && year == currentYear) ||
                        (currentMonth == 1 && month == 12 && year == currentYear - 1)) {
                    timeline.lastMonthScores.add(scorePerSkill);
                }
            }
        }


        List<ProgressSummary.SkillProgress> skillProgressList = new ArrayList<>();
        for (Map.Entry<String, SkillTimeline> entry : skillTimelineMap.entrySet()) {
            ProgressSummary.SkillProgress sp = new ProgressSummary.SkillProgress();
            sp.setSkillName(entry.getKey());

            double lastMonthAvg = average(entry.getValue().lastMonthScores);
            double thisMonthAvg = average(entry.getValue().thisMonthScores);
            double overallAvg = average(entry.getValue().totalScores);

            sp.setLastMonthScore(lastMonthAvg);
            sp.setThisMonthScore(thisMonthAvg);
            sp.setAverageScore(overallAvg);
            sp.setCurrentCategory(categorize(thisMonthAvg));

            if (thisMonthAvg > lastMonthAvg) sp.setStatus("Improved");
            else if (thisMonthAvg < lastMonthAvg) sp.setStatus("Declined");
            else sp.setStatus("No Change");

            skillProgressList.add(sp);
        }

        summary.setSkillProgressList(skillProgressList);

        // Collect Recent Activities
        List<ProgressSummary.RecentActivity> recentActivities = submissions.stream()
                .sorted(Comparator.comparing(QuizResultEntity::getSubmittedAt).reversed())
                .limit(5)
                .map(s -> {
                    ProgressSummary.RecentActivity activity = new ProgressSummary.RecentActivity();
                    activity.setQuizType(s.getQuizType());
                    activity.setReferenceName(s.getReferenceName());
                    activity.setCorrectAnswers(s.getCorrectAnswers());
                    activity.setTotalQuestions(s.getTotalQuestions());
                    activity.setDate(s.getSubmittedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
                    return activity;
                })
                .collect(Collectors.toList());
        summary.setRecentActivities(recentActivities);

        return summary;
    }

    // Helper to calculate average
    private double average(List<Double> scores) {
        return scores.isEmpty() ? 0.0 : scores.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
    }

    // Helper to categorize score
    private String categorize(double score) {
        if (score >= 75) return "High";
        else if (score >= 50) return "Moderate";
        else return "Low";
    }

    // Helper: Map quiz reference names to skills
    private List<String> mapSkillName(QuizResultEntity submission) {
        List<String> allSkills = new ArrayList<>();

        if ("skill".equalsIgnoreCase(submission.getQuizType())) {
            // Direct skill type — assumed to already be a skill name
            allSkills.add(submission.getReferenceName().trim());
        } else if ("learning".equalsIgnoreCase(submission.getQuizType())) {
            // Split the reference string by comma only
            String[] references = submission.getReferenceName().split(",");

            for (String ref : references) {
                String trimmedRef = ref.trim();

                // Remove leading underscore if present
                if (trimmedRef.startsWith("_")) {
                    trimmedRef = trimmedRef.substring(1);
                }

                List<String> mappedSkills = RECOMMENDATION_SKILL_MAP.getOrDefault(trimmedRef, Collections.emptyList());
                allSkills.addAll(mappedSkills);
            }
        }

        return allSkills;
    }




    // Inner class for skill timelines
    private static class SkillTimeline {
        List<Double> totalScores = new ArrayList<>();
        List<Double> lastMonthScores = new ArrayList<>();
        List<Double> thisMonthScores = new ArrayList<>();
    }
}

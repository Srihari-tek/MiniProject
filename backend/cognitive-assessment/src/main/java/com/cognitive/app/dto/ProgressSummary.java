package com.cognitive.app.dto;

import java.util.List;

public class ProgressSummary {
    private int totalQuizzes;
    private double averageScore;
    private List<SkillProgress> skillProgressList;
    private List<RecentActivity> recentActivities;

    public int getTotalQuizzes() {
        return totalQuizzes;
    }

    public void setTotalQuizzes(int totalQuizzes) {
        this.totalQuizzes = totalQuizzes;
    }

    public double getAverageScore() {
        return averageScore;
    }

    public void setAverageScore(double averageScore) {
        this.averageScore = averageScore;
    }

    public List<SkillProgress> getSkillProgressList() {
        return skillProgressList;
    }

    public void setSkillProgressList(List<SkillProgress> skillProgressList) {
        this.skillProgressList = skillProgressList;
    }

    public List<RecentActivity> getRecentActivities() {
        return recentActivities;
    }

    public void setRecentActivities(List<RecentActivity> recentActivities) {
        this.recentActivities = recentActivities;
    }

    // ✅ UPDATED SkillProgress class
    public static class SkillProgress {
        private String skillName;
        private String currentCategory;
        private double lastMonthScore;
        private double thisMonthScore;
        private double averageScore;
        private String status;

        public String getSkillName() {
            return skillName;
        }

        public void setSkillName(String skillName) {
            this.skillName = skillName;
        }

        public String getCurrentCategory() {
            return currentCategory;
        }

        public void setCurrentCategory(String currentCategory) {
            this.currentCategory = currentCategory;
        }

        public double getLastMonthScore() {
            return lastMonthScore;
        }

        public void setLastMonthScore(double lastMonthScore) {
            this.lastMonthScore = lastMonthScore;
        }

        public double getThisMonthScore() {
            return thisMonthScore;
        }

        public void setThisMonthScore(double thisMonthScore) {
            this.thisMonthScore = thisMonthScore;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }


        public void setAverageScore(double averageScore) {
            this.averageScore=averageScore;
        }

        public double getAverageScore() {
            return averageScore;
        }
    }

    // ✅ Same RecentActivity class
    public static class RecentActivity {
        private String quizType;
        private String referenceName;
        private int correctAnswers;
        private int totalQuestions;
        private String date; // You can also use LocalDateTime if you prefer

        public String getQuizType() {
            return quizType;
        }

        public void setQuizType(String quizType) {
            this.quizType = quizType;
        }

        public String getReferenceName() {
            return referenceName;
        }

        public void setReferenceName(String referenceName) {
            this.referenceName = referenceName;
        }

        public int getCorrectAnswers() {
            return correctAnswers;
        }

        public void setCorrectAnswers(int correctAnswers) {
            this.correctAnswers = correctAnswers;
        }

        public int getTotalQuestions() {
            return totalQuestions;
        }

        public void setTotalQuestions(int totalQuestions) {
            this.totalQuestions = totalQuestions;
        }

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }
    }
}

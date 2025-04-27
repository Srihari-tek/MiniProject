package com.cognitive.app.service;

import org.springframework.stereotype.Service;
import com.cognitive.app.model.QuizResultEntity;
import com.cognitive.app.repository.QuizResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class QuizService {

    private final Map<String, List<Map<String, Object>>> learningQuizMap;
    private final List<Map<String, Object>> skillQuizList;

    public QuizService() {
        learningQuizMap = new HashMap<>();
        skillQuizList = new ArrayList<>();

        loadLearningResourceQuizzes();
        loadSkillEvaluationQuiz();
    }

    private void loadLearningResourceQuizzes() {
        // 1. Maintain Current Learning Strategy
        List<Map<String, Object>> maintainStrategyQuiz = List.of(
                createQuestion("What does 'maintain strategy' mean?", List.of("Change learning methods", "Keep successful methods", "Ignore old methods", "None"), "Keep successful methods"),
                createQuestion("Why is consistency important?", List.of("It confuses students", "It helps stability", "It limits creativity", "None"), "It helps stability"),
                createQuestion("When should you maintain a strategy?", List.of("Only after failures", "After successful attempts", "Before trying anything", "None"), "After successful attempts"),
                createQuestion("What should you track while maintaining a strategy?", List.of("Results and behavior", "Weather patterns", "Random opinions", "None"), "Results and behavior"),
                createQuestion("Consistency in learning improves?", List.of("Confusion", "Retention and skills", "Anxiety", "None"), "Retention and skills")
        );
        learningQuizMap.put("maintain_current_learning_strategy", maintainStrategyQuiz);

        // 2. Incorporate Motor Skill Exercises
        List<Map<String, Object>> motorSkillQuiz = List.of(
                createQuestion("Which exercise improves motor skills?", List.of("Jumping Jacks", "Reading quietly", "Listening to music", "None"), "Jumping Jacks"),
                createQuestion("Hand-eye coordination can be improved by?", List.of("Catching a ball", "Listening to a podcast", "Meditating", "None"), "Catching a ball"),
                createQuestion("Motor skill practice should be?", List.of("Once a month", "Frequent and consistent", "Rare", "None"), "Frequent and consistent"),
                createQuestion("Fine motor skills involve?", List.of("Large muscle groups", "Small precise movements", "Running fast", "None"), "Small precise movements"),
                createQuestion("Which activity supports fine motor skills?", List.of("Coloring", "Jumping rope", "Shouting", "None"), "Coloring")
        );
        learningQuizMap.put("incorporate_motor_skill_exercises", motorSkillQuiz);

        // 3. Use Peer Modeling and Social Stories
        List<Map<String, Object>> peerModelingQuiz = List.of(
                createQuestion("Peer modeling means?", List.of("Learning by watching peers", "Ignoring peers", "Competing with peers", "None"), "Learning by watching peers"),
                createQuestion("Social stories help students to?", List.of("Predict social situations", "Ignore feelings", "Avoid society", "None"), "Predict social situations"),
                createQuestion("In peer modeling, the model should be?", List.of("Random", "Skillful and relatable", "Unfamiliar", "None"), "Skillful and relatable"),
                createQuestion("Social stories usually include?", List.of("Realistic scenarios", "Fictional monsters", "Confusing instructions", "None"), "Realistic scenarios"),
                createQuestion("Key benefit of peer modeling?", List.of("Creating jealousy", "Enhancing learning through observation", "Creating competition", "None"), "Enhancing learning through observation")
        );
        learningQuizMap.put("use_peer_modeling_and_social_stories", peerModelingQuiz);

        // 4. Use Memory Games
        List<Map<String, Object>> memoryGamesQuiz = List.of(
                createQuestion("Memory games help improve?", List.of("Physical strength", "Recall ability", "Anger", "None"), "Recall ability"),
                createQuestion("Which is a memory game?", List.of("Simon Says", "Running race", "Arm wrestling", "None"), "Simon Says"),
                createQuestion("Memory games should be?", List.of("Boring", "Challenging and fun", "Punishing", "None"), "Challenging and fun"),
                createQuestion("One benefit of memory games?", List.of("Forgetfulness", "Cognitive sharpening", "Laziness", "None"), "Cognitive sharpening"),
                createQuestion("Good memory practice?", List.of("Matching cards", "Running marathons", "Cooking pasta", "None"), "Matching cards")
        );
        learningQuizMap.put("use_memory_games", memoryGamesQuiz);

        // 5. Apply Visual Math Tools
        List<Map<String, Object>> visualMathQuiz = List.of(
                createQuestion("Visual math tools help to?", List.of("Confuse learners", "Make concepts clear", "Increase anxiety", "None"), "Make concepts clear"),
                createQuestion("An example of a visual math tool?", List.of("Flashcards", "Soccer ball", "Drama script", "None"), "Flashcards"),
                createQuestion("Graphs and charts are?", List.of("Visual learning tools", "Physical workouts", "Storybooks", "None"), "Visual learning tools"),
                createQuestion("Using visuals improves?", List.of("Confusion", "Understanding", "Memory loss", "None"), "Understanding"),
                createQuestion("Which is a visual representation?", List.of("Equation drawing", "Music lyrics", "Running track", "None"), "Equation drawing")
        );
        learningQuizMap.put("apply_visual_math_tools", visualMathQuiz);

        // 6. Include Logical Puzzles
        List<Map<String, Object>> logicalPuzzlesQuiz = List.of(
                createQuestion("Logical puzzles improve?", List.of("Problem solving", "Sleeping habits", "Dancing", "None"), "Problem solving"),
                createQuestion("A type of logical puzzle?", List.of("Sudoku", "Singing", "Running", "None"), "Sudoku"),
                createQuestion("Logical thinking is?", List.of("Random", "Step-by-step reasoning", "Chaotic", "None"), "Step-by-step reasoning"),
                createQuestion("Which boosts logical reasoning?", List.of("Solving riddles", "Screaming", "Jumping", "None"), "Solving riddles"),
                createQuestion("Key benefit of puzzles?", List.of("Memory loss", "Enhanced critical thinking", "Boredom", "None"), "Enhanced critical thinking")
        );
        learningQuizMap.put("include_logical_puzzles", logicalPuzzlesQuiz);
    }

    private void loadSkillEvaluationQuiz() {
        // 5 Core Skills Evaluation
        skillQuizList.addAll(List.of(
                createQuestion("Memory: Recall the sequence shown earlier.", List.of("A-B-C", "C-B-A", "B-C-A", "A-C-B"), "A-B-C"),
                createQuestion("Logical Reasoning: Find the next number in pattern (2, 4, 6, __)", List.of("8", "10", "12", "6"), "8"),
                createQuestion("Motor Skill: Which improves hand-eye coordination?", List.of("Playing catch", "Sleeping", "Watching TV", "None"), "Playing catch"),
                createQuestion("Math Skill: Solve 5 + 7 =", List.of("10", "11", "12", "13"), "12"),
                createQuestion("Social Understanding: Friend is upset. You should?", List.of("Laugh", "Ignore", "Comfort them", "Scold them"), "Comfort them")
        ));
    }

    private Map<String, Object> createQuestion(String question, List<String> options, String answer) {
        Map<String, Object> map = new HashMap<>();
        map.put("question", question);
        map.put("options", options);
        map.put("answer", answer);
        return map;
    }

    public List<Map<String, Object>> getLearningQuiz(String recommendation) {
        return learningQuizMap.getOrDefault(recommendation.toLowerCase().replaceAll(" ", "_"), new ArrayList<>());
    }

    public List<Map<String, Object>> getSkillQuiz() {
        return skillQuizList;
    }
    @Autowired
    private QuizResultRepository quizResultRepository;

    public void saveQuizResult(Map<String, Object> submission) {
        QuizResultEntity result = new QuizResultEntity();

        result.setUserId((String) submission.get("userId"));
        result.setQuizType((String) submission.get("quizType")); // "learning" or "skill"
        result.setReferenceName((String) submission.get("referenceName")); // e.g. "use_memory_games"
        result.setTotalQuestions((Integer) submission.get("totalQuestions"));
        result.setCorrectAnswers((Integer) submission.get("correctAnswers"));

        List<String> answers = (List<String>) submission.get("answers");
        result.setAnswers(answers);

        result.setSubmittedAt(LocalDateTime.now());

        quizResultRepository.save(result);
    }
}


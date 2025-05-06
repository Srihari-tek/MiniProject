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
                createQuestion("Which of the following tasks would most require fine motor skills?",
                        List.of("Running a mile", "Threading a needle", "Kicking a football", "Climbing stairs"),
                        "Threading a needle"),
                createQuestion("What is peer modeling?",
                        List.of("Imitating a teacher", "Copying a peer’s appropriate behavior", "Watching videos", "Learning via flashcards"),
                        "Copying a peer’s appropriate behavior"),
                createQuestion("You hear a phone number once and recall it. This is:",
                        List.of("Long-term memory", "Procedural memory", "Working memory", "Episodic memory"),
                        "Working memory"),
                createQuestion("What shape has four equal sides and all right angles?",
                        List.of("Rectangle", "Triangle", "Square", "Rhombus"),
                        "Square"),
                createQuestion("What comes next? A, C, E, G, ___",
                        List.of("H", "J", "K", "I"),
                        "J")
        );
        learningQuizMap.put("maintain_current_learning_strategy", maintainStrategyQuiz);

        // 2. Incorporate Motor Skill Exercises
        List<Map<String, Object>> motorSkillQuiz = List.of(
                createQuestion("What does hand-eye coordination help with?",
                        List.of("Reading comprehension", "Typing on a keyboard", "Solving math equations", "Memorizing dates"),
                        "Typing on a keyboard"),
                createQuestion("A student rotates a puzzle piece to fit it. This requires:",
                        List.of("Motor planning", "Passive motion", "Spatial neglect", "Resting tone"),
                        "Motor planning"),
                createQuestion("Which activity enhances bilateral coordination?",
                        List.of("Hopping on one leg", "Catching a ball with both hands", "Listening to a story", "Reading silently"),
                        "Catching a ball with both hands"),
                createQuestion("Why is crossing the midline important?",
                        List.of("It helps regulate emotions", "It supports two-handed activities", "It strengthens bones", "It improves vision"),
                        "It supports two-handed activities"),
                createQuestion("When practicing with scissors, which skill is being developed?",
                        List.of("Core strength", "Visual sequencing", "Finger dexterity", "Time management"),
                        "Finger dexterity")
        );
        learningQuizMap.put("incorporate_motor_skill_exercises", motorSkillQuiz);

        // 3. Use Peer Modeling and Social Stories
        List<Map<String, Object>> peerModelingQuiz = List.of(
                createQuestion("What is typically described in a social story?",
                        List.of("Historical events", "A child’s routine and expected social behavior", "Scientific processes", "Fictional characters only"),
                        "A child’s routine and expected social behavior"),
                createQuestion("Which of the following promotes empathy?",
                        List.of("Winning a game", "Talking without listening", "Taking turns in a conversation", "Avoiding peers"),
                        "Taking turns in a conversation"),
                createQuestion("A child sees another help and later does the same. This is:",
                        List.of("Abstract thinking", "Peer modeling", "Internal motivation", "Language delay"),
                        "Peer modeling"),
                createQuestion("What should a good social story include?",
                        List.of("Complex vocabulary", "Real-world relevance and clarity", "Fictional monsters", "Confusing instructions"),
                        "Real-world relevance and clarity"),
                createQuestion("Which scenario reflects poor social understanding?",
                        List.of("Waiting in line", "Apologizing", "Laughing when someone is upset", "Holding the door"),
                        "Laughing when someone is upset")
        );
        learningQuizMap.put("use_peer_modeling_and_social_stories", peerModelingQuiz);

        // 4. Use Memory Games
        List<Map<String, Object>> memoryGamesQuiz = List.of(
                createQuestion("Which task best improves working memory?",
                        List.of("Copying notes", "Playing a number recall game", "Listening to music", "Drawing a picture"),
                        "Playing a number recall game"),
                createQuestion("Following three-step instructions uses:",
                        List.of("Emotional regulation", "Working memory", "Visual perception", "Word decoding"),
                        "Working memory"),
                createQuestion("Which strategy helps verbal memory?",
                        List.of("Ignoring", "Repeating aloud", "Walking away", "Drawing random images"),
                        "Repeating aloud"),
                createQuestion("Remembering unrelated words is:",
                        List.of("Long-term memory", "Muscle memory", "Implicit memory", "Short-term memory"),
                        "Short-term memory"),
                createQuestion("Reversing a number sequence aloud involves:",
                        List.of("Repeating numbers", "Reversing a sequence", "Looking at pictures", "Typing randomly"),
                        "Reversing a sequence")
        );
        learningQuizMap.put("use_memory_games", memoryGamesQuiz);

        // 5. Apply Visual Math Tools
        List<Map<String, Object>> visualMathQuiz = List.of(
                createQuestion("Which of the following represents a pattern?",
                        List.of("Red, blue, red, blue, red, ___", "1, 3, 7, 9, 2", "A, B, D, F", "Green, yellow, apple"),
                        "Red, blue, red, blue, red, ___"),
                createQuestion("Which tool compares quantities visually?",
                        List.of("Bar graph", "Paragraph", "Stopwatch", "Textbook"),
                        "Bar graph"),
                createQuestion("Counting blocks in a triangle involves:",
                        List.of("Number line", "Volume", "Geometry and spatial visualization", "Phonemic awareness"),
                        "Geometry and spatial visualization"),
                createQuestion("What defines symmetry?",
                        List.of("Opposite colors", "Same shape on both sides", "Uneven patterns", "Random shapes"),
                        "Same shape on both sides"),
                createQuestion("What comes next? 2, 4, 6, 8, ___",
                        List.of("11", "12", "10", "9"),
                        "10")
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


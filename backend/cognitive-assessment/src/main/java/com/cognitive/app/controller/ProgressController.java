package com.cognitive.app.controller;
import com.cognitive.app.dto.ProgressSummary;
import com.cognitive.app.service.ProgressService;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    private final ProgressService progressService;

    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @GetMapping("/{userId}")
    public ProgressSummary getProgress(@PathVariable String userId) {
        return progressService.calculateProgress(userId);
    }
}

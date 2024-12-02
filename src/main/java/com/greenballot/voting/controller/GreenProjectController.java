package com.greenballot.voting.controller;

import com.google.gson.Gson;
import com.greenballot.voting.dto.GreenProjectDto;
import com.greenballot.voting.dto.UpdateGreenProjectDto;
import com.greenballot.voting.model.GreenProject;
import com.greenballot.voting.model.enums.ProjectStatus;
import com.greenballot.voting.service.GreenProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("api/v1/project")
@RequiredArgsConstructor
public class GreenProjectController {

    private final GreenProjectService projectService;
    private final RedisTemplate<String, Object> redisTemplate;
    private final Gson gson;

    @PostMapping("/cache")
    public void cacheFormData(@RequestBody Map<String, Object> formData) {
        String userId = formData.get("userId").toString();
        redisTemplate.opsForHash().putAll("formData:" + userId, formData);
    }

    @GetMapping("/cache")
    public ResponseEntity<String> getCachedFormData(@RequestParam String userId) {

        Map<Object, Object> rawData = redisTemplate.opsForHash().entries("formData:" + userId);

        Map<String, Object> result = new HashMap<>();
        for (Map.Entry<Object, Object> entry : rawData.entrySet()) {
            result.put((String) entry.getKey(), entry.getValue());
        }
        return ResponseEntity.ok(gson.toJson(result));
    }

    @PostMapping("/clear-cache")
    public ResponseEntity<String> clearRedisCache(@RequestBody String userId) {
        Map<String, String> response = new HashMap<>();
        if (redisTemplate.hasKey("formData:" + userId)) {
            redisTemplate.delete("formData:" + userId);
            response.put("status", "0");
            response.put("message", "cache successfully cleared.");
            return ResponseEntity.ok(gson.toJson(response));
        } else {
            response.put("status", "1");
            response.put("message", "cache could not be found for userid: " + userId);
            return ResponseEntity.ok(gson.toJson(response));
        }
    }

    @Transactional
    @PostMapping("/new")
    public ResponseEntity<String> newProject(@RequestBody GreenProjectDto projectDto) {
        return ResponseEntity.ok(projectService.addNewProject(projectDto));
    }

    @Transactional
    @PatchMapping("/update")
    public ResponseEntity<String> updateProject(@RequestBody UpdateGreenProjectDto projectDto){
        return ResponseEntity.ok(projectService.updateProject(projectDto));
    }

    @PostMapping("/upload-proposal")
    public ResponseEntity<String> uploadProposal(@RequestParam("file") MultipartFile file) {
        Map<String, String> result = projectService.uploadProposal(file);
        Gson gson = new Gson();
        if (result.get("status").equals("0"))
            return ResponseEntity.status(HttpStatus.OK).body(gson.toJson(result));
        else
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(gson.toJson(result));
    }

    @PostMapping("/upload-image")
    public ResponseEntity<String> uploadFeaturedImage(@RequestParam("file") MultipartFile file) {
        Map<String, String> result = projectService.uploadFeaturedImage(file);
        Gson gson = new Gson();
        if (result.get("status").equals("0"))
            return ResponseEntity.status(HttpStatus.OK).body(gson.toJson(result));
        else
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(gson.toJson(result));
    }
    @PostMapping("/upload-presentation")
    public ResponseEntity<String> uploadPresentation(@RequestParam("file") MultipartFile file) {
        Map<String, String> result = projectService.uploadPresentation(file);
        Gson gson = new Gson();
        if (result.get("status").equals("0"))
            return ResponseEntity.status(HttpStatus.OK).body(gson.toJson(result));
        else
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(gson.toJson(result));
    }

    @Transactional
    @GetMapping("/get-projects")
    public Page<GreenProject> getUserProjects(@RequestParam String userId, Pageable pageable) {
        return projectService.getUserProjects(userId, ProjectStatus.DELETED, pageable);
    }

    @Transactional
    @GetMapping("/get-project-by-status")
    public Page<GreenProject> getProjectByStatus(@RequestParam String projectStatus, Pageable pageable) {

        return projectService.getProjectByStatus(ProjectStatus.valueOf(projectStatus), pageable);
    }

    @PostMapping("/delete")
    public ResponseEntity<String> deleteProject(@RequestBody Long id) {
        return projectService.deleteProject(id);
    }

    @GetMapping("/get-project")
    public ResponseEntity<GreenProject> getProjectById(@RequestParam Long id){
        return projectService.getProjectById(id);
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @Transactional
    @PostMapping("/verify")
    public ResponseEntity<String> verifyProject(@RequestBody Long id) {
        return projectService.verifyProject(id);
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @Transactional
    @PostMapping("/reject")
    public ResponseEntity<String> rejectProject(@RequestBody Long id) {
        return projectService.rejectProject(id);
    }
}

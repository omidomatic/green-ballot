package com.greenballot.voting.service;

import com.google.gson.Gson;
import com.greenballot.voting.dto.GreenProjectDto;
import com.greenballot.voting.dto.LocationDto;
import com.greenballot.voting.dto.UpdateGreenProjectDto;
import com.greenballot.voting.model.GreenProject;
import com.greenballot.voting.model.enums.ProjectStatus;
import com.greenballot.voting.model.error.Error;
import com.greenballot.voting.repository.GreenProjectRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.apache.commons.text.similarity.LevenshteinDistance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class GreenProjectService {

    private final GreenProjectRepository repository;
    private final LevenshteinDistance levenshtein = new LevenshteinDistance();

    private final Gson gson;
    private final Path rootLocation = Paths.get("D:\\_Voting\\voting");
    List<String> files = new ArrayList<String>();

    public String addNewProject(GreenProjectDto projectDto) {

        Map<String, String> response = new HashMap<>();
        // Fetch all proposals from the repository (for large datasets, you could optimize this)
        List<GreenProject> allProjects = repository.findAll();

        for (GreenProject project : allProjects) {
            int titleDistance = levenshtein.apply(projectDto.getName(), project.getName());
            int descriptionDistance = levenshtein.apply(projectDto.getDescription(), project.getDescription());

            // Set a threshold for similarity, e.g., if the titles are more than 80% similar
            int titleThreshold = Math.min(projectDto.getName().length(), project.getName().length()) / 5;
            int descriptionThreshold = Math.min(projectDto.getDescription().length(), project.getDescription().length()) / 5;

            if (titleDistance <= titleThreshold || descriptionDistance <= descriptionThreshold) {
                return new Error(409, "Project Already Exists!").toString();
            }
        }

        String locationJson = gson.toJson(projectDto.getLocation());
        String fundingAllocationJson = gson.toJson(projectDto.getFundingAllocation());

        GreenProject newProject = GreenProject.builder()
                .projectStatus(ProjectStatus.PENDING)
                .name(projectDto.getName())
                .userId(Integer.valueOf(projectDto.getUserId()))
                .category(projectDto.getCategory())
                .description(projectDto.getDescription())
                .location(locationJson)
                .targetOutcomes(projectDto.getTargetOutcomes())
                .startDate(projectDto.getStartDate())
                .endDate(projectDto.getEndDate())
                .votingDue(LocalDate.now().plusMonths(6))
                .projectLeadName(projectDto.getProjectLeadName())
                .projectLeadContact(projectDto.getProjectLeadContact())
                .fundingGoal(Double.valueOf(projectDto.getFundingGoal()))
                .fundingAllocation(fundingAllocationJson)
                .videoUrl(projectDto.getVideoUrl())
                .websiteUrl(projectDto.getWebsiteUrl())
                .challengesAndRisks(projectDto.getChallengesAndRisks())
                .sustainabilityPlan(projectDto.getSustainabilityPlan())
                .submittedBy(projectDto.getSubmittedBy())
                .teamMembers(projectDto.getTeamMembers())
                .impactGoals(projectDto.getImpactGoals())
                .proposal(projectDto.getProposal())
                .keywords(projectDto.getKeywords())
                .presentation(projectDto.getPresentation())
                .featuredImage(projectDto.getFeaturedImage())
                .socialMediaLinks(projectDto.getSocialMediaLinks())
                .voteCount(0L)
                .build();

        repository.save(newProject);

        response.put("status", "0");
        response.put("Message", "success");

        return gson.toJson(response);
    }

    public Map<String, String> uploadProposal(MultipartFile file) {
        Map<String, String> response = new HashMap<>();
        System.out.println("trying to upload file!");
        String uuid = UUID.randomUUID().toString();
        Gson gson = new Gson();
        String filename = uuid.split("-")[uuid.split("-").length - 1] + "-" + file.getOriginalFilename();
        try {
            try {
                Files.copy(file.getInputStream(), this.rootLocation.resolve(filename));
            } catch (Exception e) {
                throw new RuntimeException("FAIL!");
            }
            files.add(file.getOriginalFilename());

            response.put("message", "Successfully uploaded!");
            response.put("filename", filename);
            response.put("status", "0");

            return response;
        } catch (Exception e) {

            response.put("message", "Failed to upload file!");
            response.put("status", "1");

            return response;
        }
    }

    public Map<String, String> uploadPresentation(MultipartFile file) {
        Map<String, String> response = new HashMap<>();
        System.out.println("trying to upload file!");
        String uuid = UUID.randomUUID().toString();
        Gson gson = new Gson();
        String filename = uuid.split("-")[uuid.split("-").length - 1] + "-" + file.getOriginalFilename();
        try {
            try {
                Files.copy(file.getInputStream(), this.rootLocation.resolve(filename));
            } catch (Exception e) {
                throw new RuntimeException("FAIL!");
            }
            files.add(file.getOriginalFilename());

            response.put("message", "Successfully uploaded!");
            response.put("filename", filename);
            response.put("status", "0");

            return response;
        } catch (Exception e) {

            response.put("message", "Failed to upload file!");
            response.put("status", "1");

            return response;
        }
    }

    public Page<GreenProject> getUserProjects(String userId,
                                              ProjectStatus status,
                                              Pageable pageable) {
        return repository.findAllByUserIdAndProjectStatusNot(Integer.valueOf(userId), status, pageable);
    }

    public Page<GreenProject> getProjectByStatus(ProjectStatus projectStatus, Pageable pageable) {
        return repository.findAllByProjectStatus(projectStatus, pageable);
    }

    public ResponseEntity<String> verifyProject(Long id) {
        Optional<GreenProject> project = repository.findById(id);
        Map<String, String> response = new HashMap<>();

        if (project.isPresent()) {
            project.get().setProjectStatus(ProjectStatus.ACTIVE);
            repository.save(project.get());
            response.put("status", "0");
            response.put("message", "success");

        } else {
            response.put("status", "0");
            response.put("message", "success");
        }

        return ResponseEntity.ok(gson.toJson(response));
    }

    public ResponseEntity<String> rejectProject(Long id) {
        Optional<GreenProject> project = repository.findById(id);
        Map<String, String> response = new HashMap<>();

        if (project.isPresent()) {
            project.get().setProjectStatus(ProjectStatus.REJECTED);
            repository.save(project.get());
            response.put("status", "0");
            response.put("message", "success");
        } else {
            response.put("status", "0");
            response.put("message", "success");
        }

        return ResponseEntity.ok(gson.toJson(response));
    }

    public ResponseEntity<String> deleteProject(Long id) {
        Map<String, String> response = new HashMap<>();
        Optional<GreenProject> search = repository.findById(id);
        if (search.isPresent()) {
            search.get().setProjectStatus(ProjectStatus.DELETED);
            repository.save(search.get());
            response.put("status", "0");
            response.put("message", "success");
        } else {
            response.put("status", "1");
            response.put("message", "Failed! Project could not be found.");
        }
        return ResponseEntity.ok(gson.toJson(response));
    }

    public ResponseEntity<GreenProject> getProjectById(Long id) {
        Optional<GreenProject> search = repository.findById(id);
        Map<String, String> response = new HashMap<>();

        if (search.isPresent()) {
            return ResponseEntity.ok(search.get());
        } else {
            throw new EntityNotFoundException("Could not find project with the given id");
        }
    }

    public String updateProject(UpdateGreenProjectDto projectDto) {
        Map<String, String> response = new HashMap<>();
        Optional<GreenProject> search = repository.findById(projectDto.getId());
        if (search.isPresent()) {
            LocationDto locationDto = gson.fromJson(projectDto.getLocation().toString(),LocationDto.class);
            String fundingAllocationJson = gson.toJson(projectDto.getFundingAllocation());

            GreenProject newProject = search.get();
            newProject.setId(projectDto.getId());
            newProject.setProjectStatus(ProjectStatus.PENDING);
            newProject.setName(projectDto.getName());
            newProject.setUserId(Integer.valueOf(projectDto.getUserId()));
            newProject.setCategory(projectDto.getCategory());
            newProject.setDescription(projectDto.getDescription());
            newProject.setLocation(locationDto.toString());
            newProject.setTargetOutcomes(projectDto.getTargetOutcomes());
            newProject.setStartDate(projectDto.getStartDate());
            newProject.setEndDate(projectDto.getEndDate());
            newProject.setVotingDue(newProject.getVotingDue());
            newProject.setProjectLeadName(projectDto.getProjectLeadName());
            newProject.setProjectLeadContact(projectDto.getProjectLeadContact());
            newProject.setFundingGoal(Double.valueOf(projectDto.getFundingGoal()));
            newProject.setFundingAllocation(fundingAllocationJson);
            newProject.setVideoUrl(projectDto.getVideoUrl());
            newProject.setWebsiteUrl(projectDto.getWebsiteUrl());
            newProject.setChallengesAndRisks(projectDto.getChallengesAndRisks());
            newProject.setSustainabilityPlan(projectDto.getSustainabilityPlan());
            newProject.setSubmittedBy(projectDto.getSubmittedBy());
            newProject.setTeamMembers(projectDto.getTeamMembers());
            newProject.setImpactGoals(projectDto.getImpactGoals());
            newProject.setProposal(projectDto.getProposal());
            newProject.setKeywords(projectDto.getKeywords());
            newProject.setPresentation(projectDto.getPresentation());
            newProject.setSocialMediaLinks(projectDto.getSocialMediaLinks());
            newProject.setFeaturedImage(projectDto.getFeaturedImage());
            newProject.setVoteCount(0L);
            repository.save(newProject);
            response.put("status", "0");
            response.put("Message", "success");
        } else {
            response.put("status", "1");
            response.put("Message", "Project could not be found with the given id:" + projectDto.getId());
        }

        return gson.toJson(response);
    }

    public Map<String, String> uploadFeaturedImage(MultipartFile file) {
        Map<String, String> response = new HashMap<>();
        System.out.println("trying to upload file!");
        String uuid = UUID.randomUUID().toString();
        Gson gson = new Gson();
        String filename = uuid.split("-")[uuid.split("-").length - 1] + "-" + file.getOriginalFilename();
        try {
            try {
                Files.copy(file.getInputStream(), this.rootLocation.resolve(filename));
            } catch (Exception e) {
                throw new RuntimeException("FAIL!");
            }
            files.add(file.getOriginalFilename());

            response.put("message", "Successfully uploaded!");
            response.put("filename", filename);
            response.put("status", "0");

            return response;
        } catch (Exception e) {

            response.put("message", "Failed to upload file!");
            response.put("status", "1");

            return response;
        }
    }

    public StreamingResponseBody download(String fileName) throws FileNotFoundException {
        String filePath = this.rootLocation + "/" + fileName;
        InputStream inputStream = new FileInputStream(filePath);
        StreamingResponseBody body = outputStream -> FileCopyUtils.copy(inputStream, outputStream);
        return body;
    }
}

package com.greenballot.voting.service;

import com.google.gson.Gson;
import com.greenballot.voting.auth.AuthenticationService;
import com.greenballot.voting.dto.VoteDto;
import com.greenballot.voting.model.GreenProject;
import com.greenballot.voting.model.VoteRecord;
import com.greenballot.voting.model.enums.Vote;
import com.greenballot.voting.repository.GreenProjectRepository;
import com.greenballot.voting.repository.VoteRecordRepository;
import com.greenballot.voting.user.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VotingService {


    private final VoteRecordRepository voteRepository;
    private final GreenProjectRepository projectRepository;
    private final AuthenticationService authService;

    private final Gson gson;

    public ResponseEntity<String> castVote(VoteDto vote, String authorization) {
        Map<String, String> response = new HashMap<>();
        List<VoteRecord> search = voteRepository.findByProjectIdAndUserId(vote.getProjectId(),vote.getUserId());

        User user = authService.getUser(authorization);
        if (!Long.valueOf(user.getId()).equals(vote.getUserId())) {
            response.put("status", "3");
            response.put("message", "There is a mismatch between the voter id:"
                    + vote.getUserId()
                    + " and the authenticated user id:"
                    + user.getId()
            );
            return ResponseEntity.ok(gson.toJson(response));
        }
        // Retrieve all votes the user has cast for this project
        List<VoteRecord> userVotes = voteRepository.findByProjectIdAndUserId(vote.getProjectId(), vote.getUserId());

        boolean hasVotedUp = userVotes.stream().anyMatch(vr -> vr.getVote().equals(Vote.UP));
        boolean hasVotedDown = userVotes.stream().anyMatch(vr -> vr.getVote().equals(Vote.DOWN));

        // Prevent voting DOWN if the user has previously voted UP
        if (hasVotedUp) {
            response.put("status", "2");
            response.put("message", "You have already voted UP for this project and cannot vote DOWN.");
            return ResponseEntity.ok(gson.toJson(response));
        }

        // Find the project to update its vote count
        Optional<GreenProject> projectSearch = projectRepository.findById(vote.getProjectId());
        if (projectSearch.isEmpty()) {
            response.put("status", "1");
            response.put("message", "Project could not be found!");
            return ResponseEntity.ok(gson.toJson(response));
        }

        GreenProject project = projectSearch.get();

        // Update the project's vote count if voting UP
        if (vote.getVote().equals(Vote.UP)) {
            if (!hasVotedUp) { // Only increment if the user hasn't already voted UP
                project.setVoteCount(project.getVoteCount() + 1);
                projectRepository.save(project);
            }
        }

        // Save the new vote record
        VoteRecord voteRecord = VoteRecord.builder()
                .projectId(vote.getProjectId())
                .vote(vote.getVote())
                .userId(vote.getUserId())
                .build();

        voteRepository.save(voteRecord);

        response.put("status", "0");
        response.put("message", "Your vote has been registered.");
        return ResponseEntity.ok(gson.toJson(response));
    }


    public ResponseEntity<String> getVotes(VoteDto voteDto) {
        List<VoteRecord> search = voteRepository.findByProjectIdAndUserId(voteDto.getUserId(), voteDto.getProjectId());
        if (search.size() > 0) {
            return ResponseEntity.ok(gson.toJson(search));
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("status", "1");
            response.put("status", "0");
            return ResponseEntity.ok(gson.toJson(response));
        }
    }

    public ResponseEntity<List<VoteRecord>> getAll() {
        List<VoteRecord> voteRecords = voteRepository.findAll();
        if (voteRecords.size() > 0)
            return ResponseEntity.ok(voteRecords);
        else {
            throw new EntityNotFoundException();
        }
    }

    public ResponseEntity<String> castVote(VoteDto voteDto) {
        VoteRecord voteRecord = VoteRecord.builder()
                .userId(voteDto.getUserId())
                .projectId(voteDto.getProjectId())
                .vote(voteDto.getVote())
                .build();
        voteRepository.save(voteRecord);
        return ResponseEntity.ok(gson.toJson(voteDto));
    }

}

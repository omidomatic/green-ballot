package com.greenballot.voting.controller;

import com.greenballot.voting.dto.VoteDto;
import com.greenballot.voting.model.VoteRecord;
import com.greenballot.voting.model.enums.Vote;
import com.greenballot.voting.repository.GreenProjectRepository;
import com.greenballot.voting.repository.VoteRecordRepository;
import com.greenballot.voting.service.VotingService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

@RestController
@RequestMapping("api/v1/voting")
@RequiredArgsConstructor
public class VotingController {

    private final VotingService votingService;
    @PostMapping("/vote")
    public ResponseEntity<String> vote(@RequestBody VoteDto vote,
                                       @RequestHeader (name="Authorization") String token) {
        String authorization = "";
        if(!token.isEmpty()){
            authorization = token.substring(7);
        }
        return votingService.castVote(vote, authorization);
    }

    @GetMapping("/votes")
    public ResponseEntity<String> getVotes(@RequestBody VoteDto voteDto){
        return  votingService.getVotes(voteDto);
    }


    @GetMapping("/all")
    public ResponseEntity<List<VoteRecord>> getAll(){
        return votingService.getAll();

    }
}

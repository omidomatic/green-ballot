package com.greenballot.voting.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AddNewProposalDto {

    private String title;
    private String description;
    private String submittedBy;
    private String website;
    private Long shareHoldersCount;
    private Long totalInvestmentNeeded;
    private Date startDate;
    private Date votingDue;
    private List<String> proposal;
    private List<String> oneMinuteVideo;
    private List<String> presentation;

}

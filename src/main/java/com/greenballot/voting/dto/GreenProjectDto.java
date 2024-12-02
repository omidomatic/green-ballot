package com.greenballot.voting.dto;

import com.greenballot.voting.model.enums.ProjectCategory;
import com.greenballot.voting.model.enums.ProjectStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GreenProjectDto {
    private String name;
    private String userId;
    private ProjectCategory category;
    private String description;
    private LocationDto location;
    private String targetOutcomes;
    private LocalDate startDate;
    private LocalDate endDate;
    private String projectLeadName;
    private String projectLeadContact;
    private String fundingGoal;
    private List<FundingAllocationDto> fundingAllocation;
    private String featuredImage;
    private String videoUrl;
    private String websiteUrl;
    private String challengesAndRisks;
    private String sustainabilityPlan;
    private String submittedBy;
    private String teamMembers;
    private String impactGoals;
    private String socialMediaLinks;
    private String proposal;
    private String keywords;
    private String presentation;
}

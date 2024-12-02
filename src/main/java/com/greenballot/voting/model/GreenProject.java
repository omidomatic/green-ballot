package com.greenballot.voting.model;

import com.google.gson.Gson;
import com.greenballot.voting.model.enums.ProjectCategory;
import com.greenballot.voting.model.enums.ProjectStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GreenProject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer userId;
    private String name;
    @Enumerated(EnumType.STRING)
    private ProjectCategory category;
    private String description;
    @Lob
    private String location;
    private String targetOutcomes;
    private LocalDate startDate;
    private LocalDate endDate;
    private String projectLeadName;
    private String projectLeadContact;
    private Double fundingGoal;
    @Lob
    private String fundingAllocation;
    private String videoUrl;
    private String websiteUrl;
    private String challengesAndRisks;
    private String sustainabilityPlan;
    @Enumerated(EnumType.STRING)
    private ProjectStatus projectStatus;
    private String submittedBy;

    private String teamMembers;

    private String impactGoals;


    private String socialMediaLinks;

    private String proposal;

    private String presentation;

    private String featuredImage;

    private String keywords;
    private Long voteCount;
    private LocalDate votingDue;
    @Override
    public String toString(){
        Gson gson = new Gson();
        return gson.toJson(this);
    }


}

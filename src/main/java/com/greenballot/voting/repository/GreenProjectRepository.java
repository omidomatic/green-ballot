package com.greenballot.voting.repository;

import com.greenballot.voting.model.GreenProject;
import com.greenballot.voting.model.enums.ProjectStatus;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GreenProjectRepository extends JpaRepository<GreenProject,Long> {

    Optional<List<GreenProject>> findGreenProposalsBySubmittedBy(String submittedBy);

    Page<GreenProject> findAllBySubmittedBy(String submittedBy, Pageable pageable);

    Page<GreenProject> findAllByUserId(Integer userId, Pageable pageable);
    Page<GreenProject> findAllByUserIdAndProjectStatusNot(Integer userId,
                                                       ProjectStatus projectStatus,
                                                       Pageable pageable);
    Page<GreenProject> findAllByProjectStatus(ProjectStatus projectStatus, Pageable pageable);
    Optional<GreenProject> findById(Long id);
}

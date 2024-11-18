package com.greenballot.voting.repository;

import com.greenballot.voting.model.GreenProject;
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
}

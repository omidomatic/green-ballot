package com.greenballot.voting.repository;

import com.greenballot.voting.model.VoteRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VoteRecordRepository extends JpaRepository<VoteRecord,Long> {

    Optional<VoteRecord> findByProjectId(Long id);

    List<VoteRecord> findByProjectIdAndUserId(Long projectId, Long userId);
}

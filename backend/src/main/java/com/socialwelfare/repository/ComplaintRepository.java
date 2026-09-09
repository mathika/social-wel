package com.socialwelfare.repository;

import com.socialwelfare.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    List<Complaint> findByDepartment(String department);

    List<Complaint> findByUserId(Long userId);
    long countByStatus(String status);
}
package com.socialwelfare.service;

import com.socialwelfare.repository.ComplaintRepository;
import com.socialwelfare.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AdminService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;

    public AdminService(ComplaintRepository complaintRepository,
                        UserRepository userRepository) {

        this.complaintRepository = complaintRepository;
        this.userRepository = userRepository;
    }

    public Map<String, Long> getDashboardStats() {

        Map<String, Long> stats = new HashMap<>();

        stats.put("totalUsers", userRepository.count());
        stats.put("totalComplaints", complaintRepository.count());
        stats.put("pending", complaintRepository.countByStatus("PENDING"));
        stats.put("inProgress", complaintRepository.countByStatus("IN_PROGRESS"));
        stats.put("resolved", complaintRepository.countByStatus("RESOLVED"));

        return stats;
    }
}
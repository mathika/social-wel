package com.socialwelfare.service;

import com.socialwelfare.entity.Complaint;
import com.socialwelfare.repository.ComplaintRepository;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final GeocodingService geocodingService;
    private final DepartmentDetectionService departmentDetectionService;
    private final FileStorageService fileStorageService;

    public ComplaintService(
            ComplaintRepository complaintRepository,
            GeocodingService geocodingService,
            DepartmentDetectionService departmentDetectionService,
            FileStorageService fileStorageService) {

        this.complaintRepository = complaintRepository;
        this.geocodingService = geocodingService;
        this.departmentDetectionService = departmentDetectionService;
        this.fileStorageService = fileStorageService;
    }


    // =========================================================
    // CREATE COMPLAINT
    // =========================================================

    public Complaint createComplaint(Complaint complaint) {

        // Get address from latitude and longitude
        if (complaint.getLatitude() != null
                && complaint.getLongitude() != null) {

            String address = geocodingService.getAddress(
                    complaint.getLatitude(),
                    complaint.getLongitude()
            );

            complaint.setAddress(address);
        }


        // Detect department from description
        if (complaint.getDescription() != null
                && !complaint.getDescription().isBlank()) {

            String department =
                    departmentDetectionService.detectDepartment(
                            complaint.getDescription()
                    );

            complaint.setDepartment(department);

        } else {

            complaint.setDepartment(null);
        }


        // New complaint always starts as PENDING
        complaint.setStatus("PENDING");


        // No resolved image when complaint is created
        complaint.setResolvedImagePath(null);


        return complaintRepository.save(complaint);
    }


    // =========================================================
    // GET ALL COMPLAINTS
    // =========================================================

    public List<Complaint> getAllComplaints() {

        return complaintRepository.findAll();
    }


    // =========================================================
    // GET DEPARTMENT COMPLAINTS
    // =========================================================

    public List<Complaint> getComplaintsByDepartment(
            String department) {

        return complaintRepository.findByDepartment(department);
    }


    // =========================================================
    // GET USER COMPLAINTS
    // =========================================================

    public List<Complaint> getComplaintsByUser(Long userId) {

        return complaintRepository.findByUserId(userId);
    }


    // =========================================================
    // NORMAL STATUS UPDATE
    // =========================================================

    public Complaint updateComplaintStatus(
            Long complaintId,
            String status) {

        Complaint complaint =
                complaintRepository.findById(complaintId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Complaint not found"));

        complaint.setStatus(status.toUpperCase());

        return complaintRepository.save(complaint);
    }


    // =========================================================
    // COMPLETE COMPLAINT WITH RESOLVED IMAGE
    // =========================================================

    public Complaint completeComplaint(
            Long complaintId,
            MultipartFile resolvedImage) throws IOException {

        Complaint complaint =
                complaintRepository.findById(complaintId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Complaint not found"));


        // Resolved image is compulsory
        if (resolvedImage == null
                || resolvedImage.isEmpty()) {

            throw new RuntimeException(
                    "Resolved image is required");
        }


        // Save resolved image
        String resolvedImagePath =
                fileStorageService.saveFile(resolvedImage);


        // Store image path
        complaint.setResolvedImagePath(
                resolvedImagePath);


        // Mark complaint completed
        complaint.setStatus("COMPLETED");


        return complaintRepository.save(complaint);
    }
}
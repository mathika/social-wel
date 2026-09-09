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
    private final CloudinaryService cloudinaryService;

    public ComplaintService(
            ComplaintRepository complaintRepository,
            GeocodingService geocodingService,
            DepartmentDetectionService departmentDetectionService,
            CloudinaryService cloudinaryService) {

        this.complaintRepository = complaintRepository;
        this.geocodingService = geocodingService;
        this.departmentDetectionService = departmentDetectionService;
        this.cloudinaryService = cloudinaryService;
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

        complaint.setStatus("PENDING");
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
    // GET COMPLAINTS BY DEPARTMENT
    // =========================================================

    public List<Complaint> getComplaintsByDepartment(
            String department) {

        return complaintRepository.findByDepartment(department);
    }

    // =========================================================
    // GET COMPLAINTS BY USER
    // =========================================================

    public List<Complaint> getComplaintsByUser(Long userId) {

        return complaintRepository.findByUserId(userId);
    }

    // =========================================================
    // UPDATE STATUS
    // =========================================================

    public Complaint updateComplaintStatus(
            Long complaintId,
            String status) {

        Complaint complaint =
                complaintRepository.findById(complaintId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Complaint not found"
                                )
                        );

        complaint.setStatus(status.toUpperCase());

        return complaintRepository.save(complaint);
    }

    // =========================================================
    // COMPLETE COMPLAINT + RESOLVED IMAGE
    // =========================================================

    public Complaint completeComplaint(
            Long complaintId,
            MultipartFile resolvedImage) throws IOException {

        Complaint complaint =
                complaintRepository.findById(complaintId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Complaint not found"
                                )
                        );

        if (resolvedImage == null
                || resolvedImage.isEmpty()) {

            throw new RuntimeException(
                    "Resolved image is required"
            );
        }

        // Upload resolved image to Cloudinary
        String resolvedImageUrl =
                cloudinaryService.uploadImage(resolvedImage);

        // Save Cloudinary URL in database
        complaint.setResolvedImagePath(
                resolvedImageUrl
        );

        complaint.setStatus("COMPLETED");

        return complaintRepository.save(complaint);
    }
}

package com.socialwelfare.controller;

import com.socialwelfare.entity.Complaint;
import com.socialwelfare.service.CloudinaryService;
import com.socialwelfare.service.ComplaintService;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin
public class ComplaintController {

    private final ComplaintService complaintService;
    private final CloudinaryService cloudinaryService;

    public ComplaintController(
            ComplaintService complaintService,
            CloudinaryService cloudinaryService) {

        this.complaintService = complaintService;
        this.cloudinaryService = cloudinaryService;
    }

    // =========================================================
    // CREATE COMPLAINT
    // =========================================================

    @PostMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public Complaint createComplaint(

            @RequestParam("userId")
            Long userId,

            @RequestParam(
                    value = "image",
                    required = false
            )
            MultipartFile image,

            @RequestParam(
                    value = "description",
                    required = false
            )
            String description,

            @RequestParam("latitude")
            Double latitude,

            @RequestParam("longitude")
            Double longitude

    ) throws IOException {

        String imageUrl = null;

        // Upload complaint image to Cloudinary
        if (image != null && !image.isEmpty()) {

            imageUrl =
                    cloudinaryService.uploadImage(image);
        }

        Complaint complaint = new Complaint();

        complaint.setUserId(userId);
        complaint.setImagePath(imageUrl);
        complaint.setDescription(description);
        complaint.setLatitude(latitude);
        complaint.setLongitude(longitude);

        complaint.setAddress(null);
        complaint.setDepartment(null);
        complaint.setResolvedImagePath(null);
        complaint.setStatus("PENDING");

        return complaintService.createComplaint(complaint);
    }

    // =========================================================
    // GET ALL COMPLAINTS
    // =========================================================

    @GetMapping
    public List<Complaint> getAllComplaints() {

        return complaintService.getAllComplaints();
    }

    // =========================================================
    // GET COMPLAINTS BY DEPARTMENT
    // =========================================================

    @GetMapping("/department/{department}")
    public List<Complaint> getByDepartment(
            @PathVariable String department) {

        return complaintService
                .getComplaintsByDepartment(department);
    }

    // =========================================================
    // GET COMPLAINTS BY USER
    // =========================================================

    @GetMapping("/user/{userId}")
    public List<Complaint> getByUser(
            @PathVariable Long userId) {

        return complaintService
                .getComplaintsByUser(userId);
    }

    // =========================================================
    // UPDATE STATUS
    // =========================================================

    @PutMapping("/{id}/status")
    public Complaint updateStatus(

            @PathVariable Long id,

            @RequestParam String status) {

        return complaintService
                .updateComplaintStatus(id, status);
    }

    // =========================================================
    // COMPLETE COMPLAINT + RESOLVED IMAGE
    // =========================================================

    @PutMapping(
            value = "/{id}/complete",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public Complaint completeComplaint(

            @PathVariable Long id,

            @RequestParam("resolvedImage")
            MultipartFile resolvedImage

    ) throws IOException {

        return complaintService.completeComplaint(
                id,
                resolvedImage
        );
    }

    // =========================================================
    // TEST CONTROLLER
    // =========================================================

    @GetMapping("/test")
    public String test() {

        return "Complaint Controller is working";
    }
}

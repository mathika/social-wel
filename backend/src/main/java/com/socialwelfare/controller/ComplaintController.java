package com.socialwelfare.controller;

import com.socialwelfare.entity.Complaint;
import com.socialwelfare.service.ComplaintService;
import com.socialwelfare.service.FileStorageService;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin
public class ComplaintController {

    private final ComplaintService complaintService;
    private final FileStorageService fileStorageService;

    public ComplaintController(
            ComplaintService complaintService,
            FileStorageService fileStorageService) {

        this.complaintService = complaintService;
        this.fileStorageService = fileStorageService;
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

        String imagePath = null;

        if (image != null && !image.isEmpty()) {

            imagePath =
                    fileStorageService.saveFile(image);
        }


        Complaint complaint = new Complaint();

        complaint.setUserId(userId);
        complaint.setImagePath(imagePath);
        complaint.setDescription(description);
        complaint.setLatitude(latitude);
        complaint.setLongitude(longitude);

        complaint.setAddress(null);
        complaint.setDepartment(null);
        complaint.setResolvedImagePath(null);
        complaint.setStatus("PENDING");


        return complaintService.createComplaint(
                complaint
        );
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


    // =========================================================
    // VIEW UPLOADED IMAGE
    // =========================================================

    @GetMapping("/image/{filename:.+}")
    public ResponseEntity<Resource> getImage(
            @PathVariable String filename) throws IOException {

        Path uploadDirectory =
                Paths.get("uploads").toAbsolutePath().normalize();

        Path filePath =
                uploadDirectory
                        .resolve(filename)
                        .normalize();

        // Security check
        if (!filePath.startsWith(uploadDirectory)) {
            return ResponseEntity.badRequest().build();
        }

        Resource resource =
                new UrlResource(filePath.toUri());

        if (!resource.exists() || !resource.isReadable()) {

            return ResponseEntity.notFound().build();
        }

        String contentType =
                getContentType(filename);

        return ResponseEntity.ok()
                .contentType(
                        MediaType.parseMediaType(contentType)
                )
                .body(resource);
    }


    // =========================================================
    // GET IMAGE CONTENT TYPE
    // =========================================================

    private String getContentType(String filename) {

        int dotIndex = filename.lastIndexOf(".");

        if (dotIndex == -1) {
            return "application/octet-stream";
        }

        String extension =
                filename.substring(dotIndex + 1)
                        .toLowerCase();

        switch (extension) {

            case "png":
                return "image/png";

            case "jpg":
            case "jpeg":
                return "image/jpeg";

            case "gif":
                return "image/gif";

            case "webp":
                return "image/webp";

            case "bmp":
                return "image/bmp";

            default:
                return "application/octet-stream";
        }
    }
}
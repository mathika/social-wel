package com.socialwelfare.service;

import org.springframework.stereotype.Service;

@Service
public class DepartmentDetectionService {

    public String detectDepartment(String description) {

        if (description == null || description.isBlank()) {
            return null;
        }

        String text = description
                .toLowerCase()
                .trim();

        // ==========================================
        // WATER
        // ==========================================

        if (text.contains("water")
                || text.contains("pipe")
                || text.contains("leak")
                || text.contains("leaking")
                || text.contains("tap")
                || text.contains("drinking")
                || text.contains("supply")
                || text.contains("no water")
                || text.contains("water supply")
                || text.contains("pipeline")
                || text.contains("tank")
                || text.contains("water tank")) {

            return "WATER";
        }


        // ==========================================
        // DRAINAGE
        // ==========================================

        if (text.contains("drain")
                || text.contains("drainage")
                || text.contains("sewage")
                || text.contains("sewer")
                || text.contains("wastewater")
                || text.contains("clog")
                || text.contains("blocked drain")
                || text.contains("overflow")
                || text.contains("stagnant water")) {

            return "DRAINAGE";
        }


        // ==========================================
        // GARBAGE
        // ==========================================

        if (text.contains("garbage")
                || text.contains("trash")
                || text.contains("dustbin")
                || text.contains("dump")
                || text.contains("waste")
                || text.contains("litter")
                || text.contains("rubbish")
                || text.contains("cleaning")
                || text.contains("unclean")
                || text.contains("dirty")
                || text.contains("garbage collection")) {

            return "GARBAGE";
        }


        // ==========================================
        // STREETLIGHT / ROAD
        // ==========================================

        if (text.contains("streetlight")
                || text.contains("street light")
                || text.contains("road")
                || text.contains("pothole")
                || text.contains("potholes")
                || text.contains("traffic")
                || text.contains("signal")
                || text.contains("lamp")
                || text.contains("road damage")
                || text.contains("broken road")
                || text.contains("street lamp")) {

            return "STREETLIGHT_ROAD";
        }


        // No department identified
        return null;
    }
}
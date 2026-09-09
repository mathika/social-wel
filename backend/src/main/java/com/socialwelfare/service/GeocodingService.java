package com.socialwelfare.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class GeocodingService {

    private final RestClient restClient;

    public GeocodingService() {
        this.restClient = RestClient.builder()
                .baseUrl("https://nominatim.openstreetmap.org")
                .defaultHeader(
                        "User-Agent",
                        "SocialWelfareApp/1.0"
                )
                .build();
    }

    public String getAddress(Double latitude, Double longitude) {

        try {

            NominatimResponse response = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/reverse")
                            .queryParam("lat", latitude)
                            .queryParam("lon", longitude)
                            .queryParam("format", "json")
                            .build())
                    .retrieve()
                    .body(NominatimResponse.class);

            if (response != null && response.display_name != null) {
                return response.display_name;
            }

            return "Address not found";

        } catch (Exception e) {

            System.out.println(
                    "Geocoding error: " + e.getMessage()
            );

            return "Address not available";
        }
    }

    public static class NominatimResponse {

        public String display_name;
    }
}
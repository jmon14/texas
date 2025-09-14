package com.quickview_ai.controllers;

import com.quickview_ai.health.MongoHealthIndicator;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {

    private static final Logger logger = LoggerFactory.getLogger(HealthController.class);
    
    private final MongoHealthIndicator mongoHealthIndicator;

    public HealthController(MongoHealthIndicator mongoHealthIndicator) {
        this.mongoHealthIndicator = mongoHealthIndicator;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        logger.info("Health check requested");
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", Instant.now().toString());
        response.put("service", "vision");
        
        // Check MongoDB health
        Map<String, Object> mongoHealth = mongoHealthIndicator.checkHealth();
        boolean isMongoHealthy = "UP".equals(mongoHealth.get("status"));
        
        response.put("components", Map.of("mongo", mongoHealth));

        if (isMongoHealthy) {
            logger.info("Health check passed - all components healthy");
            return ResponseEntity.ok(response);
        } else {
            logger.warn("Health check failed - MongoDB is unhealthy");
            response.put("status", "DOWN");
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
        }
    }
}
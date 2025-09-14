package com.quickview_ai.controllers;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class HealthControllerTest {

    private HealthController healthController;

    @BeforeEach
    void setUp() {
        healthController = new HealthController();
    }

    @Test
    void health_ShouldReturnOK() {
        // When
        ResponseEntity<Map<String, Object>> response = healthController.health();

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        
        Map<String, Object> body = response.getBody();
        assertNotNull(body);
        assertEquals("UP", body.get("status"));
        assertEquals("vision", body.get("service"));
        assertTrue(body.containsKey("timestamp"));
        
        // Ensure timestamp is not empty
        assertNotNull(body.get("timestamp"));
        assertTrue(body.get("timestamp").toString().length() > 0);
    }

    @Test
    void health_ShouldNotExposeSensitiveInformation() {
        // When
        ResponseEntity<Map<String, Object>> response = healthController.health();

        // Then
        Map<String, Object> body = response.getBody();
        assertNotNull(body);
        
        // Ensure no sensitive database information is exposed
        assertFalse(body.containsKey("database"));
        assertFalse(body.containsKey("collections"));
        assertFalse(body.containsKey("objects"));
        assertFalse(body.containsKey("connection"));
        assertFalse(body.containsKey("error"));
        
        // Only expected fields should be present
        assertEquals(3, body.size()); // status, timestamp, service
    }
}
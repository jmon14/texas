package com.quickview_ai.controllers;

import com.quickview_ai.health.MongoHealthIndicator;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class HealthControllerTest {

    @Mock
    private MongoHealthIndicator mongoHealthIndicator;

    private HealthController healthController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        healthController = new HealthController(mongoHealthIndicator);
    }

    @Test
    void health_WhenMongoIsHealthy_ShouldReturnOK() {
        // Given
        Map<String, Object> mongoHealthStatus = new HashMap<>();
        mongoHealthStatus.put("status", "UP");
        mongoHealthStatus.put("database", "vision");
        mongoHealthStatus.put("message", "Connected");

        when(mongoHealthIndicator.checkHealth()).thenReturn(mongoHealthStatus);

        // When
        ResponseEntity<Map<String, Object>> response = healthController.health();

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("UP", response.getBody().get("status"));
        assertEquals("vision", response.getBody().get("service"));
        assertTrue(response.getBody().containsKey("timestamp"));
        assertTrue(response.getBody().containsKey("components"));
    }

    @Test
    void health_WhenMongoIsUnhealthy_ShouldReturnServiceUnavailable() {
        // Given
        Map<String, Object> mongoHealthStatus = new HashMap<>();
        mongoHealthStatus.put("status", "DOWN");
        mongoHealthStatus.put("database", "vision");
        mongoHealthStatus.put("message", "Disconnected");
        mongoHealthStatus.put("error", "Connection timeout");

        when(mongoHealthIndicator.checkHealth()).thenReturn(mongoHealthStatus);

        // When
        ResponseEntity<Map<String, Object>> response = healthController.health();

        // Then
        assertEquals(HttpStatus.SERVICE_UNAVAILABLE, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("DOWN", response.getBody().get("status"));
        assertEquals("vision", response.getBody().get("service"));
        assertTrue(response.getBody().containsKey("timestamp"));
        assertTrue(response.getBody().containsKey("components"));
        
        @SuppressWarnings("unchecked")
        Map<String, Object> components = (Map<String, Object>) response.getBody().get("components");
        @SuppressWarnings("unchecked")
        Map<String, Object> mongoComponent = (Map<String, Object>) components.get("mongo");
        assertEquals("DOWN", mongoComponent.get("status"));
        assertEquals("Connection timeout", mongoComponent.get("error"));
    }
}
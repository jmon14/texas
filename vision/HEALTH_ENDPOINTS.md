# Health Endpoints Documentation

This document describes the health check endpoints available in the Vision service.

## Endpoints

### 1. Custom Health Endpoint (`/health`)

- **URL**: `GET /health`
- **Port**: 3001 (service port)
- **Description**: Custom health endpoint that provides MongoDB connectivity status
- **Response Format**: JSON

#### Healthy Response (200 OK)
```json
{
  "status": "UP",
  "timestamp": "2024-09-14T10:55:40.337Z",
  "service": "vision",
  "components": {
    "mongo": {
      "status": "UP",
      "database": "vision",
      "collections": 2,
      "objects": 15,
      "message": "Connected"
    }
  }
}
```

#### Unhealthy Response (503 Service Unavailable)
```json
{
  "status": "DOWN",
  "timestamp": "2024-09-14T10:55:40.348Z",
  "service": "vision",
  "components": {
    "mongo": {
      "status": "DOWN",
      "database": "vision",
      "message": "Disconnected",
      "error": "Connection timeout"
    }
  }
}
```

### 2. Spring Boot Actuator Health Endpoint (`/actuator/health`)

- **URL**: `GET /actuator/health`
- **Port**: 3001 (service port)
- **Description**: Standard Spring Boot Actuator health endpoint with MongoDB health indicator
- **Response Format**: JSON

#### Healthy Response (200 OK)
```json
{
  "status": "UP",
  "components": {
    "mongo": {
      "status": "UP",
      "details": {
        "version": "5.0"
      }
    }
  }
}
```

#### Unhealthy Response (503 Service Unavailable)
```json
{
  "status": "DOWN",
  "components": {
    "mongo": {
      "status": "DOWN",
      "details": {
        "error": "Unable to connect to MongoDB"
      }
    }
  }
}
```

## Configuration

The health endpoints are configured in `application.properties`:

```properties
# Actuator configuration
management.endpoints.web.exposure.include=health,info
management.endpoints.web.base-path=/actuator
management.endpoint.health.show-details=when-authorized
management.endpoint.health.show-components=always
management.health.mongo.enabled=true
```

## Health Check Logic

Both endpoints perform the following MongoDB connectivity checks:

1. **Database Connection**: Attempts to connect to the configured MongoDB instance
2. **Database Stats**: Executes a `dbStats` command to verify the database is responsive
3. **Response Details**: Includes database name, collection count, and object count when healthy

## Usage Examples

### Using curl
```bash
# Check custom health endpoint
curl http://localhost:3001/health

# Check actuator health endpoint
curl http://localhost:3001/actuator/health
```

### Using in Docker Health Checks
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1
```

### Using in Kubernetes Probes
```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 3001
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /health
    port: 3001
  initialDelaySeconds: 5
  periodSeconds: 5
```

## Error Handling

The health endpoints include comprehensive error handling:

- **Connection Timeouts**: Properly handled with appropriate error messages
- **Database Unavailable**: Returns 503 status with error details
- **Network Issues**: Logged with detailed error information
- **Authentication Errors**: Handled gracefully with appropriate responses

## Monitoring Integration

These endpoints are designed to work with:

- **Docker**: Built-in health check support
- **Kubernetes**: Liveness and readiness probes
- **Load Balancers**: Health check integration (HAProxy, nginx, etc.)
- **Monitoring Tools**: Prometheus, Grafana, New Relic, etc.
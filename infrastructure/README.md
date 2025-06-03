# Texas Infrastructure

This directory contains the infrastructure configuration for deploying the Texas application to AWS.

## Prerequisites

1. AWS Account with appropriate permissions
2. AWS CLI installed and configured
3. Terraform installed
4. SSH key pair (for EC2 access)
5. Docker and Docker Compose installed locally

## Directory Structure

```
infrastructure/
├── aws/                    # AWS Terraform configuration
│   └── main.tf            # Main Terraform configuration
├── nginx/                 # Nginx configuration
│   └── nginx.conf        # Nginx reverse proxy configuration
├── docker-compose.prod.yml # Production Docker Compose file
├── deploy.sh              # Deployment script
└── README.md             # This file
```

## Setup Instructions

1. Create a `.env` file in the infrastructure directory with the following variables:
   ```
   AWS_ACCESS_KEY_ID=your_access_key_id
   AWS_SECRET_ACCESS_KEY=your_secret_access_key
   MONGO_PASSWORD=your_mongo_password
   POSTGRES_PASSWORD=your_postgres_password
   NODE_ENV=production
   SPRING_PROFILES_ACTIVE=prod
   ```

2. Ensure your SSH key pair is set up:
   - The public key should be in `~/.ssh/id_rsa.pub`
   - The private key should be in `~/.ssh/id_rsa`

3. Run the deployment script:
   ```bash
   ./deploy.sh
   ```

## Architecture

The application is deployed on a single EC2 instance (t3.micro) with the following components:

- Nginx reverse proxy (ports 80/443)
- MongoDB database
- PostgreSQL database
- Vision service (Java Spring Boot)
- Ultron service (NestJS)
- Quickview frontend (React)

## Cost Estimation

- EC2 t3.micro: ~$8-10/month
- Data transfer: ~$5-10/month
- Total estimated cost: €15-20/month

## Scaling Considerations

This setup is designed to be easily scalable. To scale in the future:

1. Multiple EC2 instances:
   - Update Terraform configuration to create multiple instances
   - Use a load balancer
   - Consider using ECS/EKS for container orchestration

2. Database scaling:
   - Move databases to RDS/Aurora
   - Implement read replicas
   - Use connection pooling

3. Caching:
   - Add Redis for caching
   - Implement CDN for static assets

## Monitoring and Maintenance

1. Set up CloudWatch alarms for:
   - CPU utilization
   - Memory usage
   - Disk space
   - Application metrics

2. Regular maintenance:
   - Update Docker images
   - Rotate database passwords
   - Monitor logs
   - Backup databases

## Security Considerations

1. All services are behind Nginx reverse proxy
2. Database passwords are managed through environment variables
3. AWS security groups restrict access to necessary ports
4. Regular security updates through Docker image updates 
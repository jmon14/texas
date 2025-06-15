# Texas Infrastructure

This directory contains the infrastructure configuration for deploying the Texas application to AWS.

## Prerequisites

1. AWS Account with appropriate permissions
2. AWS CLI installed and configured
3. Terraform installed
4. SSH key pair (required for EC2 access and deployment)
5. Docker and Docker Compose installed locally
6. A `.env` file with the following variables:

```
# AWS Configuration
AWS_REGION=eu-central-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# Database Configuration
POSTGRES_USER=ultron_app  # Database username (avoid using 'admin')
POSTGRES_PASSWORD=your_secure_password  # Database password
POSTGRES_DB=ultron  # Database name

# JWT Configuration
JWT_SECRET=your_jwt_secret  # Secret for regular authentication tokens
JWT_REFRESH_SECRET=your_refresh_secret  # Secret for refresh tokens
JWT_EMAIL_SECRET=your_email_secret  # Secret for email confirmation/reset tokens

# Domain Configuration
DOMAIN_EMAIL=admin@allinrange.com  # Email for SSL certificates and notifications

# AWS SES Configuration
AWS_SES_SMTP_USERNAME=your_ses_smtp_username  # Get from AWS SES Console
AWS_SES_SMTP_PASSWORD=your_ses_smtp_password  # Get from AWS SES Console
```

## Environment Configuration

### Production Environment

The production environment configuration is managed in two places:

1. `infrastructure/.env`: Contains non-sensitive configuration values that are used during deployment
2. AWS SSM Parameter Store: Contains sensitive values and secrets

To update the SSM parameters:

```bash
cd aws/scripts
./upload-env-to-ssm.sh ../production.env
```

This will upload all variables from `production.env` to SSM Parameter Store under the `/texas/ultron/` path.

### Sensitive vs Non-Sensitive Values

- **Sensitive values** (stored in SSM through .production.env):

  - Database credentials
  - JWT secrets
  - API keys
  - Email service credentials
  - AWS SES SMTP credentials

- **Non-sensitive values** (stored in .env through docker compose):
  - Domain configuration
  - Port numbers
  - Service URLs
  - JWT expiration times
  - AWS region
  - Bucket names

## Setting up AWS SES

1. Go to AWS Console → SES
2. Click on "SMTP Settings"
3. Click "Create My SMTP Credentials"
4. Save both the SMTP username and password
5. Add these credentials to your `.production.env` file
6. Upload to SSM using the upload script

Note: Make sure your AWS region supports SES. If not, you'll need to:

1. Request production access to SES
2. Verify your domain in SES
3. Set up DKIM records for your domain

## Directory Structure

```
infrastructure/
├── aws/                    # AWS Terraform configuration
│   ├── main.tf            # Main Terraform configuration
│   ├── vpc.tf             # VPC configuration
│   ├── domain.tf          # Domain and DNS configuration
│   ├── security.tf        # Security groups and rules
│   ├── variables.tf       # Terraform variables
│   ├── backend.tf         # Terraform backend configuration
│   ├── iam.tf             # IAM roles and policies
│   ├── outputs.tf         # Terraform outputs
│   ├── scripts/           # Deployment and setup scripts
│   └── environments/      # Environment-specific configurations
├── nginx/                 # Nginx configuration
│   ├── nginx.conf        # Nginx reverse proxy configuration
│   └── ssl/              # SSL certificates
├── docker-compose.prod.yml # Production Docker Compose file
├── deploy.sh              # Deployment script
└── README.md             # This file
```

## Setup Instructions

1. Create a `.env` file in the infrastructure directory with the following variables (this file is required for deployment):

   ```
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_access_key
   DOMAIN_EMAIL=your_email@example.com  # Required for SSL certificate
   MONGO_PASSWORD=your_mongo_password
   POSTGRES_USER=ultron_app  # Database username (avoid using 'admin')
   POSTGRES_PASSWORD=your_postgres_password
   POSTGRES_DB=ultron  # Database name
   NODE_ENV=production
   SPRING_PROFILES_ACTIVE=prod
   ```

2. Set up SSH key pair (required for deployment and EC2 access):

   - Generate a new key pair if you don't have one:
     ```bash
     ssh-keygen -t rsa -b 4096 -f ~/.ssh/texas_key
     ```
   - The public key will be used by Terraform to configure EC2 access
   - The private key will be used by the deployment script to copy files and execute commands

3. Initialize Terraform:

   ```bash
   cd aws
   terraform init
   ```

4. Run the deployment script:
   ```bash
   ./deploy.sh
   ```

## Architecture

The application is deployed on AWS with the following components:

### Infrastructure (AWS)

- VPC with public and private subnets
- EC2 instance (t3.micro) in private subnet
- Security groups for service isolation
- IAM roles and policies for service access
- Route53 DNS configuration
- SSL/TLS termination at Nginx

### Application Services

- Nginx reverse proxy (ports 80/443)
- MongoDB database (containerized)
- PostgreSQL database (containerized)
- Vision service (Java Spring Boot)
- Ultron service (NestJS)
- Quickview frontend (React)

## Cost Estimation

- EC2 t3.micro: ~$8-10/month
- Data transfer: ~$5-10/month
- Route53 hosted zone: ~$0.50/month
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
   - Renew SSL certificates

## Security Considerations

1. All services are behind Nginx reverse proxy with SSL/TLS
2. Database passwords are managed through environment variables
3. AWS security groups restrict access to necessary ports
4. Services run in private subnet with limited internet access
5. IAM roles follow principle of least privilege
6. Regular security updates through Docker image updates

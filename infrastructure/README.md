# Texas Infrastructure

This directory contains the infrastructure configuration for the Texas application, which consists of multiple microservices deployed on AWS EC2 with Docker Compose.

## 🏗️ Architecture Overview

The infrastructure consists of:

- **AWS EC2 Instance** (t3.micro) running Ubuntu 22.04
- **Docker Compose** orchestrating multiple services
- **Nginx** reverse proxy with SSL termination
- **Route53** DNS management for `allinrange.com`
- **S3** bucket for file storage and deployment packages
- **SSM Parameter Store** for secure configuration management

### Services

1. **Quickview** - React frontend application
2. **Ultron** - NestJS backend API service
3. **Vision** - Java Spring Boot service
4. **PostgreSQL** - Database for Ultron service
5. **MongoDB** - Database for Vision service
6. **Nginx** - Reverse proxy and SSL termination

## 🚀 Quick Start

### Prerequisites

- AWS CLI configured with appropriate permissions
- Terraform installed
- Docker and Docker Compose (for local development)
- Domain name configured to point to AWS nameservers

### Initial Setup

1. **Configure AWS credentials:**

   ```bash
   aws configure
   ```

2. **Create and configure `prod.tfvars`:**

   ```bash
   cd infrastructure/aws/environments
   cp prod.tfvars.example prod.tfvars
   # Edit prod.tfvars and replace all placeholder values with your actual credentials
   ```

3. **Initialize Terraform:**

   ```bash
   cd infrastructure/aws
   terraform init
   ```

4. **Deploy infrastructure** (this automatically creates all SSM parameters):

   ```bash
   terraform plan
   terraform apply
   ```

5. **Deploy application:**
   ```bash
   cd infrastructure
   ./deploy.sh
   ```

## 📁 Directory Structure

```
infrastructure/
├── aws/                    # Terraform configuration
│   ├── environments/       # Environment-specific variables
│   ├── main.tf            # Main EC2 instance configuration
│   ├── security.tf        # Security groups
│   ├── domain.tf          # Route53 DNS configuration
│   ├── s3.tf             # S3 bucket configuration
│   ├── iam.tf            # IAM roles and policies
│   ├── ssm.tf            # SSM parameter store
│   └── variables.tf      # Variable definitions
├── nginx/                 # Nginx configuration
│   ├── nginx.conf        # Nginx reverse proxy config
│   └── setup-ssl.sh      # SSL certificate setup script
├── docker-compose.prod.yml # Production Docker Compose
└── deploy.sh             # Deployment script
```

## 🔧 Configuration

### Environment Variables

The application uses SSM Parameter Store for secure configuration management. Required parameters:

**Ultron Service:**

- `/texas/ultron/POSTGRES_USER` - PostgreSQL username
- `/texas/ultron/POSTGRES_PASSWORD` - PostgreSQL password
- `/texas/ultron/DOMAIN_EMAIL` - Email for SSL certificates

**Vision Service:**

- `/vision/mongodb/MONGO_USER` - MongoDB username
- `/vision/mongodb/MONGO_PASSWORD` - MongoDB password

### Terraform Variables

Key variables in `infrastructure/aws/variables.tf`:

- `aws_region` - AWS region (default: eu-central-1)
- `instance_type` - EC2 instance type (default: t3.micro)
- `volume_size` - EBS volume size in GB (default: 20)
- `aws_public_bucket_name` - S3 bucket name (default: files.allinrange.com)

## 🚀 Deployment

### Automated Deployment

The `deploy.sh` script automates the entire deployment process:

1. **Package and upload** code to S3
2. **Download and extract** code on EC2 instance
3. **Configure environment** variables from SSM
4. **Deploy containers** using Docker Compose
5. **Setup SSL certificates** using Let's Encrypt
6. **Cleanup** temporary files

```bash
./deploy.sh
```

### Manual Deployment

If you need to deploy manually:

1. **Connect to the instance via SSM:**

   ```bash
   # Get instance ID
   INSTANCE_ID=$(aws ec2 describe-instances \
       --filters "Name=tag:Name,Values=texas-server" "Name=instance-state-name,Values=running" \
       --query 'Reservations[0].Instances[0].InstanceId' \
       --output text)

   # Connect via SSM Session Manager
   aws ssm start-session --target $INSTANCE_ID
   ```

2. **Navigate to the project:**

   ```bash
   cd ~/texas
   ```

3. **Deploy containers:**

   ```bash
   docker-compose -f infrastructure/docker-compose.prod.yml down
   docker-compose -f infrastructure/docker-compose.prod.yml pull
   docker-compose -f infrastructure/docker-compose.prod.yml up -d
   ```

4. **Setup SSL (if needed):**
   ```bash
   cd infrastructure/nginx
   ./setup-ssl.sh
   ```

**Alternative: Run commands remotely without connecting:**

```bash
# Run commands directly on the instance
aws ssm send-command \
    --instance-ids $INSTANCE_ID \
    --document-name "AWS-RunShellScript" \
    --parameters "commands=[
        'cd ~/texas',
        'docker-compose -f infrastructure/docker-compose.prod.yml ps'
    ]"
```

## 🔒 Security

### Security Groups

The EC2 instance is configured with a security group that allows:

- **Port 80** (HTTP) - for initial SSL setup
- **Port 443** (HTTPS) - for secure traffic
- **All outbound traffic** - for updates and external API calls

### SSL/TLS

- **Automatic SSL setup** using Let's Encrypt
- **Certificate renewal** handled by Certbot
- **HTTPS enforcement** via Nginx configuration

### Secrets Management

- **SSM Parameter Store** for sensitive configuration
- **Encrypted parameters** for passwords and secrets
- **No hardcoded secrets** in configuration files

## 🐛 Troubleshooting

### Common Issues

1. **SSL Certificate Issues:**

   ```bash
   # Check certificate status
   sudo certbot certificates

   # Renew certificates manually
   sudo certbot renew
   ```

2. **Container Issues:**

   ```bash
   # Check container status
   docker-compose -f infrastructure/docker-compose.prod.yml ps

   # View logs
   docker-compose -f infrastructure/docker-compose.prod.yml logs
   ```

3. **SSM Parameter Issues:**

   ```bash
   # List parameters
   aws ssm describe-parameters --query "Parameters[?starts_with(Name, '/texas/') || starts_with(Name, '/vision/')]"

   # Get parameter value
   aws ssm get-parameter --name "/texas/ultron/POSTGRES_USER" --query "Parameter.Value" --output text
   ```

### Logs

- **Application logs:** `docker-compose -f infrastructure/docker-compose.prod.yml logs [service-name]`
- **Nginx logs:** `docker logs texas_nginx_1`
- **System logs:** `journalctl -u docker`

### Health Checks

```bash
# Check if all services are running
docker-compose -f infrastructure/docker-compose.prod.yml ps

# Test application endpoints
curl -I https://allinrange.com
curl -I https://www.allinrange.com
```

## 🔄 Updates and Maintenance

### Application Updates

1. **Code changes:** Use `./deploy.sh` for full deployment
2. **Configuration changes:** Update SSM parameters and redeploy
3. **Infrastructure changes:** Use Terraform for infrastructure updates

### Infrastructure Updates

```bash
cd infrastructure/aws
terraform plan
terraform apply
```

### SSL Certificate Renewal

Certificates are automatically renewed by Certbot, but you can manually renew:

```bash
sudo certbot renew
```

## 🗑️ Cleanup

### Destroy Infrastructure

```bash
cd infrastructure/aws
terraform destroy
```

### Clean S3 Bucket

```bash
aws s3 rm s3://files.allinrange.com --recursive
```

## 📝 Notes

### Cost Optimization

- **Use Spot Instances** for non-critical workloads
- **Implement auto-scaling** based on demand
- **Monitor and optimize** EBS volumes
- **Use AWS Cost Explorer** to track spending

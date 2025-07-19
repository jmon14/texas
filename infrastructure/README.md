# Infrastructure Documentation

This directory contains all infrastructure-related configuration for the Texas Poker application.

## 🏗️ Architecture

### AWS Resources

- **EC2 Instance**: Application server running Docker containers
- **Elastic IP**: Static IP for consistent access
- **Security Groups**: Network access control
- **SSM Parameters**: Secure configuration storage
- **ECR Repositories**: Container image storage

### Network Flow

```
Internet → Elastic IP → EC2 → Nginx → Docker Containers
                                    ├── Quickview (Frontend)
                                    ├── Ultron (NestJS API)
                                    └── Vision (Spring Boot API)
```

## 📁 File Structure

```
infrastructure/
├── aws/                        # Terraform configuration
│   ├── main.tf                 # Main Terraform configuration
│   ├── variables.tf            # Input variables
│   ├── outputs.tf              # Output values
│   ├── backend.tf              # Backend state s3 bucket
│   ├── ecr.tf                  # ECR repositories
│   ├── s3.tf                   # S3 bucket for user files
│   ├── ssm.tf                  # SSM parameters
│   ├── security.tf             # Security groups
│   ├── domain.tf               # Domain configuration
│   └── environments/           # Environment-specific variables
│       ├── prod.tfvars.example # Example production variables
│       └── prod.tfvars         # Production variables (create this)
├── nginx/                      # Nginx configuration
│   ├── nginx.conf              # Main nginx config
│   └── ssl/                    # SSL certificates
├── docker-compose.prod.yml     # Production Docker setup
└── deploy.sh                   # Deployment script
```

## 🚀 Deployment Process

### 1. Infrastructure Setup

```bash
cd infrastructure/aws

# Create environments directory and configuration
mkdir environments
cp environments/prod.tfvars.example environments/prod.tfvars
# Edit environments/prod.tfvars with your actual values

# Initialize Terraform
terraform init

# Plan the deployment
terraform plan -var-file="environments/prod.tfvars"

# Apply the infrastructure
terraform apply -var-file="environments/prod.tfvars"
```

### 2. Application Deployment

```bash
# Build and push Docker images
./infrastructure/deploy.sh
```

## 🔧 Configuration

### Environment Variables

All sensitive configuration is stored in AWS SSM Parameters:

- **Database credentials**: MongoDB Atlas, Supabase
- **JWT secrets**: Authentication tokens
- **API keys**: External service credentials
- **Domain configuration**: SSL certificates

### SSL Configuration

- **Domain**: allinrange.com and www.allinrange.com
- **Certificate**: Let's Encrypt (manual renewal required)
- **Setup**: Run `./infrastructure/nginx/setup-ssl.sh` to create certificates

## 📊 Monitoring

### Logs

- **Application logs**: Docker container logs
- **Nginx logs**: Access and error logs
- **System logs**: EC2 instance logs
- **No CloudWatch**: Basic logging only

### Health Checks

- **Frontend**: https://www.allinrange.com
- **API**: https://www.allinrange.com/api/health (public)
- **Vision API**: No health endpoint available

## 🔐 Security

### Network Security

- **Security Groups**: Restrict access to necessary ports
- **SSL/TLS**: All traffic encrypted
- **CORS**: Properly configured for domain

### Application Security

- **JWT Authentication**: Secure token-based auth
- **Environment Variables**: No secrets in code
- **Docker Security**: Containers run with limited privileges

## 🛠️ Maintenance

### Updates

```bash
# Update infrastructure
cd infrastructure/aws
terraform plan -var-file="environments/prod.tfvars"
terraform apply -var-file="environments/prod.tfvars"

# Update applications (via CI/CD)
# Push to production branch triggers automatic deployment
```

### Troubleshooting

- **Check container status**: `docker ps`
- **View logs**: `docker logs <container>`
- **SSM access**: `aws ssm start-session --target <instance-id>`

## 💰 Cost Optimization

### Current Setup

- **EC2**: t3.small (production instance)
- **MongoDB**: Atlas free tier
- **Supabase**: Free tier
- **Domain**: ~$12/year

### Estimated Monthly Cost

- **EC2**: $15-20/month (t3.small)
- **Data Transfer**: $0-5/month
- **Total**: ~$20-30/month

## 📚 Additional Resources

- [Terraform Documentation](https://www.terraform.io/docs)
- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Docker Compose](https://docs.docker.com/compose/)

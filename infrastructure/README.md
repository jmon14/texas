# Infrastructure Documentation

This folder contains the production infrastructure for the Texas Poker app (allinrange.com), including Terraform, Nginx, Docker Compose, and a remote deployment script.

## 🏗️ Architecture

### What’s provisioned with Terraform

- EC2 (Ubuntu 22.04) running the app stack via Docker Compose
- Elastic IP (used by DNS, SSL, and DB allow-list)
- Security Group (80/443 inbound, all outbound)
- IAM
  - EC2 instance profile with SSM, S3, and ECR access
  - GitHub Actions OIDC role (push to ECR, read SSM, EC2 read-only)
- SSM Parameters (secrets and config for Ultron)
- ECR Repos (texas-ultron, texas-quickview)
- S3 bucket (files.allinrange.com) for public files and deployment package transfer
- Route53 hosted zone for allinrange.com + A records (root and www)

### Runtime topology

```
Internet → Elastic IP → EC2 → Nginx → Containers
                                    ├── Quickview (Frontend, :8080)
                                    └── Ultron (NestJS API, :3000)
```

Region: eu-central-1

## 📁 File Structure (this repo)

```
infrastructure/
├── aws/                        # Terraform
│   ├── backend.tf              # Remote S3 backend for tfstate
│   ├── domain.tf               # Route53 zone + A records
│   ├── ecr.tf                  # ECR repos
│   ├── iam.tf                  # EC2 + GitHub Actions roles and policies
│   ├── main.tf                 # EC2 + EIP + outputs
│   ├── s3.tf                   # Public S3 bucket and policy
│   ├── security.tf             # Security group
│   ├── setup.tpl               # EC2 user-data (Docker, SSM agent, users)
│   ├── ssm.tf                  # SSM parameters for Ultron
│   ├── variables.tf            # Inputs (region, instance type, secrets)
│   └── environments/
│       ├── prod.tfvars.example # Copy to prod.tfvars and fill values
│       └── prod.tfvars         # (local, not committed)
├── nginx/
│   ├── nginx.conf              # Reverse proxy and TLS
│   ├── setup-ssl.sh            # Certbot (standalone) → ./nginx/ssl
│   └── ssl/                    # Certificates (created on server)
├── docker-compose.prod.yml     # Container wiring on the EC2 host
├── deploy.sh                   # Remote deploy via AWS SSM
└── .env                        # Local dev only (prod uses SSM + server .env)
```

## 🚀 How to deploy

### 1) Provision/Update infrastructure

```bash
cd infrastructure/aws

# First-time only (or when re-creating env vars file)
cp environments/prod.tfvars.example environments/prod.tfvars
# Edit environments/prod.tfvars with real values (e.g., domain_email, JWT secrets, DB creds, instance_type)

terraform init
terraform plan -var-file="environments/prod.tfvars"
terraform apply -var-file="environments/prod.tfvars"
```

Important DNS step: Terraform creates a Route53 hosted zone and outputs nameservers. At your domain registrar, set the domain’s nameservers to the Route53 NS values. Once that propagates, the A records for root and www will resolve to the EC2 Elastic IP.

Instance size: variables.tf defaults to t3.micro; prod example uses t3.small. Use t3.small for production traffic.

### 2) Build and push images to ECR

Images must exist in ECR before you deploy. CI (GitHub Actions) is set up for OIDC to push to ECR. Push your images tagged latest (or update tags in the server's .env later):

- texas-ultron:latest
- texas-quickview:latest

### 3) Run remote deployment

The script uploads only infra config (compose + nginx) to S3, then uses AWS SSM to apply on the EC2 host, set .env (from SSM and provided values), obtain TLS certs, login to ECR, pull latest images, and start containers.

Before running, set the ECR registry URL (used by Compose images):

```bash
export ECR_REGISTRY="<aws-account-id>.dkr.ecr.eu-central-1.amazonaws.com"
./infrastructure/deploy.sh
```

Notes
- The script expects the S3 bucket files.allinrange.com to exist (Terraform creates it).
- It writes /home/ssm-user/texas/infrastructure/.env on the server with: ECR_REGISTRY and image tags.
- If ECR_REGISTRY isn't set, image pulls will fail. Make sure it's exported when running the script.

### 4) TLS/SSL

`nginx/setup-ssl.sh` uses certbot in standalone mode to fetch certs for allinrange.com and www.allinrange.com and writes them to `nginx/ssl/` on the server.

- The script runs before Nginx starts; port 80 must be free to validate.
- Renewal: there’s no cron set here; re-run the script or add a cron/systemd timer for renewal.

## 🔧 Configuration and secrets

Where secrets live: Terraform creates SSM Parameters under `/texas/ultron/*`. Examples include:

- Ultron: JWT secrets, PostgreSQL user/password/host, MongoDB URI (for ranges), email (SES) creds, DOMAIN, UI_URL
- Domain email for SSL: `/texas/ultron/DOMAIN_EMAIL` (set from `domain_email` in prod.tfvars)

Runtime env: Containers read minimal env from Compose; application services fetch sensitive config from SSM using the instance role.

### MongoDB Configuration
Ultron uses MongoDB Atlas for storing poker ranges data. The connection string is stored in SSM Parameter Store at `/texas/ultron/MONGODB_URI`. Format:
```
mongodb+srv://username:password@cluster0.x9mmmer.mongodb.net/texas?retryWrites=true&w=majority&ssl=true
```

## 🔍 Monitoring and health

- No CloudWatch setup; use Docker/Nginx logs on the instance
- Frontend: https://www.allinrange.com
- API: https://www.allinrange.com/api/health

## 🔐 Security

- Security Group: 80/443 inbound, all outbound
- TLS: Nginx terminates TLS using Let’s Encrypt certs
- CORS: S3 bucket CORS allows allinrange.com and www subdomain
- IAM: least privileges for EC2; GitHub Actions OIDC role limited to this repo (jmon14/texas)

## 🧰 Maintenance

Infra updates
```bash
cd infrastructure/aws
terraform plan -var-file="environments/prod.tfvars"
terraform apply -var-file="environments/prod.tfvars"
```

App updates
- Push new images to ECR (CI)
- Re-run `./infrastructure/deploy.sh` to pull and restart containers

Troubleshooting
- `docker ps`, `docker-compose -f infrastructure/docker-compose.prod.yml ps` on the server via SSM session
- Check logs: `docker logs <container>`, Nginx at /var/log/nginx
- SSL issues: ensure DNS is pointing to the Elastic IP and re-run `setup-ssl.sh`
- ECR auth or image issues: confirm `ECR_REGISTRY` is set and images with `latest` exist

## 💰 Cost notes

- EC2: t3.small recommended (variables default to t3.micro)
- MongoDB Atlas and Supabase: free tiers in use
- Route53 + domain registration costs apply

## 📚 References

- Terraform: https://www.terraform.io/docs
- AWS EC2: https://docs.aws.amazon.com/ec2/
- Nginx: https://nginx.org/en/docs/
- Docker Compose: https://docs.docker.com/compose/

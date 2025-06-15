#!/bin/bash

# Exit on error
set -e

# Load environment variables
if [ -f .env ]; then
    source .env
else
    echo "Error: .env file not found"
    exit 1
fi

# Check if AWS credentials are set
if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
    echo "Error: AWS credentials not set in .env file"
    exit 1
fi

# Check if domain email is set
if [ -z "$DOMAIN_EMAIL" ]; then
    echo "Error: DOMAIN_EMAIL not set in .env file"
    exit 1
fi

# Initialize Terraform
cd aws
terraform init

# Apply Terraform configuration
terraform apply -auto-approve

# Get the EC2 instance IP and domain nameservers
EC2_IP=$(terraform output -raw public_ip)
NAMESERVERS=$(terraform output -json nameservers)

echo "Domain nameservers:"
echo "$NAMESERVERS"
echo "Please update your domain's nameservers in Namecheap with these values"
echo "Waiting for instance to be ready..."
sleep 30

# Copy the production docker-compose file and environment variables
scp -o StrictHostKeyChecking=no ../docker-compose.prod.yml ubuntu@$EC2_IP:~/docker-compose.yml
scp -o StrictHostKeyChecking=no ../.env ubuntu@$EC2_IP:~/.env

# SSH into the instance and start the services
ssh -o StrictHostKeyChecking=no ubuntu@$EC2_IP << 'ENDSSH'
    # Pull the latest code
    git clone https://github.com/yourusername/texas.git
    cd texas

    # Start the services
    docker-compose -f ~/docker-compose.yml up -d

    # Check if services are running
    docker-compose -f ~/docker-compose.yml ps

    # Check SSL certificate status
    certbot certificates
ENDSSH

echo "Deployment completed!"
echo "Your application should be available at:"
echo "http://$EC2_IP"
echo "https://allinrange.com (once DNS propagates)"
echo "https://www.allinrange.com (once DNS propagates)" 
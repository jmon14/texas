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

# Initialize Terraform
cd aws
terraform init

# Apply Terraform configuration
terraform apply -auto-approve

# Get the EC2 instance IP
EC2_IP=$(terraform output -raw public_ip)

# Wait for the instance to be ready
echo "Waiting for instance to be ready..."
sleep 30

# Copy the production docker-compose file and environment variables
scp -o StrictHostKeyChecking=no ../docker-compose.prod.yml ubuntu@$EC2_IP:~/docker-compose.yml
scp -o StrictHostKeyChecking=no ../.env ubuntu@$EC2_IP:~/.env

# Copy the nginx configuration
scp -o StrictHostKeyChecking=no -r ../nginx ubuntu@$EC2_IP:~/

# SSH into the instance and start the services
ssh -o StrictHostKeyChecking=no ubuntu@$EC2_IP << 'ENDSSH'
    # Pull the latest code
    git clone https://github.com/yourusername/texas.git
    cd texas

    # Start the services
    docker-compose -f ~/docker-compose.yml up -d

    # Check if services are running
    docker-compose -f ~/docker-compose.yml ps
ENDSSH

echo "Deployment completed! The application should be available at http://$EC2_IP" 
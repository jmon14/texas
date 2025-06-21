#!/bin/bash
set -e

# Get the EC2 instance ID from Terraform output
INSTANCE_ID=$(cd aws && terraform output -raw instance_id)

echo "Deploying to EC2 instance $INSTANCE_ID..."

# Generate SSL certificates if they don't exist
if [ ! -f "nginx/ssl/cert.pem" ] || [ ! -f "nginx/ssl/key.pem" ]; then
    echo "SSL certificates not found. Generating self-signed certificates..."
    cd nginx && ./generate-ssl.sh && cd ..
fi

# Create deployment directory if it doesn't exist
aws ssm send-command \
    --instance-ids $INSTANCE_ID \
    --document-name "AWS-RunShellScript" \
    --parameters "commands=['mkdir -p ~/texas']"

# Copy files to the instance
echo "Copying files to EC2 instance..."
aws ssm send-command \
    --instance-ids $INSTANCE_ID \
    --document-name "AWS-RunShellScript" \
    --parameters "commands=[
        'cd ~/texas',
        'rm -rf *'
    ]"

# Copy the entire project (excluding .git and other unnecessary files)
rsync -av --exclude='.git' --exclude='node_modules' --exclude='target' --exclude='.env' \
    -e "ssh -i ~/.ssh/projects/texas/texas-key -o StrictHostKeyChecking=no" \
    ./ ec2-user@$(cd aws && terraform output -raw public_ip):~/texas/

# Deploy the application
aws ssm send-command \
    --instance-ids $INSTANCE_ID \
    --document-name "AWS-RunShellScript" \
    --parameters "commands=[
        'cd ~/texas',
        'docker-compose -f infrastructure/docker-compose.prod.yml down',
        'docker-compose -f infrastructure/docker-compose.prod.yml pull',
        'docker-compose -f infrastructure/docker-compose.prod.yml up -d',
        'docker-compose -f infrastructure/docker-compose.prod.yml ps'
    ]"

echo "Deployment completed!"
echo "Your application should be available at:"
echo "https://allinrange.com"
echo "https://www.allinrange.com"
echo ""
echo "Note: Using self-signed certificates. For production, use Let's Encrypt." 
#!/bin/bash
set -e

# Update system
apt-get update

# Install required packages
apt-get install -y docker.io docker-compose git certbot snapd awscli

# Install and configure SSM agent
snap install amazon-ssm-agent --classic
systemctl enable snap.amazon-ssm-agent.amazon-ssm-agent.service
systemctl start snap.amazon-ssm-agent.amazon-ssm-agent.service

# Configure Docker
systemctl enable docker
systemctl start docker

# Create ssm-user if it doesn't exist and add to docker group
echo "Setting up ssm-user..."
if ! id "ssm-user" &>/dev/null; then
    echo "Creating ssm-user..."
    useradd -m -s /bin/bash ssm-user
    usermod -aG sudo ssm-user
    echo "ssm-user created successfully"
else
    echo "ssm-user already exists"
fi

# Add ssm-user to docker group
usermod -aG docker ssm-user
echo "Successfully added ssm-user to docker group"

echo "Setup completed successfully!"
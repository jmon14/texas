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

echo "Setup completed successfully!"
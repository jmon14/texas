#!/bin/bash
apt-get update
apt-get install -y docker.io docker-compose git
systemctl enable docker
systemctl start docker

# SSL certificates will be setup by the deployment script
# This ensures proper configuration and fallback options
#!/bin/bash
apt-get update
apt-get install -y docker.io docker-compose git certbot
systemctl enable docker
systemctl start docker
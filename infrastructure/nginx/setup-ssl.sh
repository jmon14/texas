#!/bin/bash

# SSL Setup Script for Texas Infrastructure
set -e

# Configuration
DOMAIN="${DOMAIN:-allinrange.com}"
WWW_DOMAIN="${WWW_DOMAIN:-www.allinrange.com}"
SSL_DIR="${SSL_DIR:-./ssl}"

# Check if DOMAIN_EMAIL is provided
if [ -z "$DOMAIN_EMAIL" ]; then
    echo "❌ DOMAIN_EMAIL environment variable is required"
    exit 1
fi

EMAIL="$DOMAIN_EMAIL"

echo "🔒 SSL Setup for Texas Infrastructure"
echo "Domain: $DOMAIN"
echo "Email: $EMAIL"

# Create SSL directory
mkdir -p $SSL_DIR

# Setup Let's Encrypt certificates
echo "🌐 Setting up Let's Encrypt certificates..."

certbot certonly --standalone \
    -d $DOMAIN \
    -d $WWW_DOMAIN \
    --non-interactive \
    --agree-tos \
    --email $EMAIL

# Copy certificates to the SSL directory
sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem $SSL_DIR/cert.pem
sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem $SSL_DIR/key.pem

# Set proper permissions
sudo chown ubuntu:ubuntu $SSL_DIR/cert.pem $SSL_DIR/key.pem
chmod 600 $SSL_DIR/key.pem
chmod 644 $SSL_DIR/cert.pem

echo "✅ Let's Encrypt certificates setup successfully!" 
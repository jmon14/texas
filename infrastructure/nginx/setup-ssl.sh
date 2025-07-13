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

# Create writable directories for certbot
mkdir -p /tmp/certbot/config
mkdir -p /tmp/certbot/work
mkdir -p /tmp/certbot/logs

certbot certonly --standalone \
    -d $DOMAIN \
    -d $WWW_DOMAIN \
    --non-interactive \
    --agree-tos \
    --email $EMAIL \
    --config-dir /tmp/certbot/config \
    --work-dir /tmp/certbot/work \
    --logs-dir /tmp/certbot/logs

# Copy certificates to the SSL directory
cp /tmp/certbot/config/live/$DOMAIN/fullchain.pem $SSL_DIR/cert.pem
cp /tmp/certbot/config/live/$DOMAIN/privkey.pem $SSL_DIR/key.pem

# Set proper permissions
chmod 600 $SSL_DIR/key.pem
chmod 644 $SSL_DIR/cert.pem

echo "✅ Let's Encrypt certificates setup successfully!" 
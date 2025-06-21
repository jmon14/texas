#!/bin/bash

# SSL Setup Script for Texas Infrastructure
# This script handles SSL certificate setup for containerized Nginx

set -e

# Configuration - use environment variables with fallbacks
DOMAIN="${DOMAIN:-allinrange.com}"
WWW_DOMAIN="${WWW_DOMAIN:-www.allinrange.com}"
SSL_DIR="${SSL_DIR:-./ssl}"  # Relative to nginx directory for container mounting
EMAIL="${DOMAIN_EMAIL:-admin@allinrange.com}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔒 SSL Setup for Texas Infrastructure (Containerized)${NC}"
echo "=================================================="
echo "Domain: $DOMAIN"
echo "Email: $EMAIL"
echo "SSL Directory: $SSL_DIR"

# Create SSL directory
mkdir -p $SSL_DIR

# Function to generate self-signed certificates
generate_self_signed() {
    echo -e "${YELLOW}📝 Generating self-signed SSL certificates...${NC}"
    
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout $SSL_DIR/key.pem \
        -out $SSL_DIR/cert.pem \
        -subj "/C=US/ST=State/L=City/O=Texas/CN=$DOMAIN" \
        -addext "subjectAltName = DNS:$DOMAIN,DNS:$WWW_DOMAIN"
    
    chmod 600 $SSL_DIR/key.pem
    chmod 644 $SSL_DIR/cert.pem
    
    echo -e "${GREEN}✅ Self-signed certificates generated successfully!${NC}"
}

# Function to setup Let's Encrypt certificates
setup_lets_encrypt() {
    echo -e "${YELLOW}🌐 Setting up Let's Encrypt certificates...${NC}"
    
    # Check if Docker containers are running
    if ! docker ps | grep -q nginx; then
        echo -e "${RED}❌ Nginx container is not running. Please start the application first.${NC}"
        return 1
    fi
    
    # Get certificates using standalone mode (since nginx is in container)
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
    sudo chown $USER:$USER $SSL_DIR/cert.pem $SSL_DIR/key.pem
    chmod 600 $SSL_DIR/key.pem
    chmod 644 $SSL_DIR/cert.pem
    
    echo -e "${GREEN}✅ Let's Encrypt certificates setup successfully!${NC}"
}

# Function to check certificate validity
check_certificates() {
    echo -e "${YELLOW}🔍 Checking certificate status...${NC}"
    
    if [ -f "$SSL_DIR/cert.pem" ] && [ -f "$SSL_DIR/key.pem" ]; then
        echo -e "${GREEN}✅ SSL certificates found${NC}"
        
        # Check certificate expiration
        if command -v openssl &> /dev/null; then
            EXPIRY=$(openssl x509 -enddate -noout -in $SSL_DIR/cert.pem | cut -d= -f2)
            echo -e "${YELLOW}📅 Certificate expires: $EXPIRY${NC}"
        fi
    else
        echo -e "${RED}❌ SSL certificates not found${NC}"
        return 1
    fi
}

# Function to setup auto-renewal for Let's Encrypt
setup_auto_renewal() {
    echo -e "${YELLOW}🔄 Setting up auto-renewal...${NC}"
    
    # Create renewal script
    sudo tee /etc/cron.daily/ssl-renewal > /dev/null << EOF
#!/bin/bash
# Renew Let's Encrypt certificates
certbot renew --quiet --standalone

# Copy renewed certificates to container SSL directory
if [ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem /home/ubuntu/texas/infrastructure/nginx/ssl/cert.pem
    cp /etc/letsencrypt/live/$DOMAIN/privkey.pem /home/ubuntu/texas/infrastructure/nginx/ssl/key.pem
    chown ubuntu:ubuntu /home/ubuntu/texas/infrastructure/nginx/ssl/cert.pem /home/ubuntu/texas/infrastructure/nginx/ssl/key.pem
    chmod 600 /home/ubuntu/texas/infrastructure/nginx/ssl/key.pem
    chmod 644 /home/ubuntu/texas/infrastructure/nginx/ssl/cert.pem
    
    # Reload nginx container
    cd /home/ubuntu/texas
    docker-compose -f infrastructure/docker-compose.prod.yml restart nginx
fi
EOF
    
    sudo chmod +x /etc/cron.daily/ssl-renewal
    
    echo -e "${GREEN}✅ Auto-renewal setup complete${NC}"
}

# Function to restart nginx container
restart_nginx() {
    echo -e "${YELLOW}🔄 Restarting Nginx container...${NC}"
    
    cd ~/texas
    docker-compose -f infrastructure/docker-compose.prod.yml restart nginx
    
    echo -e "${GREEN}✅ Nginx container restarted${NC}"
}

# Main execution
case "${1:-auto}" in
    "self-signed")
        generate_self_signed
        restart_nginx
        ;;
    "lets-encrypt")
        setup_lets_encrypt
        setup_auto_renewal
        restart_nginx
        ;;
    "check")
        check_certificates
        ;;
    "auto")
        # Try Let's Encrypt first, fallback to self-signed
        if setup_lets_encrypt 2>/dev/null; then
            setup_auto_renewal
        else
            echo -e "${YELLOW}⚠️  Let's Encrypt failed, using self-signed certificates${NC}"
            generate_self_signed
        fi
        restart_nginx
        ;;
    *)
        echo "Usage: $0 {self-signed|lets-encrypt|check|auto}"
        echo "  self-signed  - Generate self-signed certificates"
        echo "  lets-encrypt  - Setup Let's Encrypt certificates"
        echo "  check        - Check certificate status"
        echo "  auto         - Auto-detect and setup (default)"
        echo ""
        echo "Environment variables:"
        echo "  DOMAIN_EMAIL - Email for Let's Encrypt (required)"
        echo "  DOMAIN      - Domain name (default: allinrange.com)"
        echo "  WWW_DOMAIN  - WWW subdomain (default: www.allinrange.com)"
        echo "  SSL_DIR     - SSL directory (default: ./ssl)"
        exit 1
        ;;
esac

# Final check
if check_certificates; then
    echo -e "${GREEN}🎉 SSL setup completed successfully!${NC}"
    echo ""
    echo "Your application should now be accessible via HTTPS:"
    echo "  https://$DOMAIN"
    echo "  https://$WWW_DOMAIN"
    echo ""
    echo "Note: Nginx container has been restarted to load new certificates."
else
    echo -e "${RED}❌ SSL setup failed${NC}"
    exit 1
fi 
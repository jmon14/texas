#!/bin/bash

# SSL Setup Script for Texas Infrastructure
# This script handles SSL certificate setup for containerized Nginx

set -e

# Configuration - use environment variables with fallbacks
DOMAIN="${DOMAIN:-allinrange.com}"
WWW_DOMAIN="${WWW_DOMAIN:-www.allinrange.com}"
SSL_DIR="${SSL_DIR:-./ssl}"  # Relative to nginx directory for container mounting

# Check if DOMAIN_EMAIL is provided
if [ -z "$DOMAIN_EMAIL" ]; then
    echo -e "${RED}❌ DOMAIN_EMAIL environment variable is required${NC}"
    echo "Please set DOMAIN_EMAIL before running this script"
    echo "Example: DOMAIN_EMAIL=your-email@domain.com ./setup-ssl.sh"
    exit 1
fi

EMAIL="$DOMAIN_EMAIL"

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
    sudo chown ubuntu:ubuntu $SSL_DIR/cert.pem $SSL_DIR/key.pem
    chmod 600 $SSL_DIR/key.pem
    chmod 644 $SSL_DIR/cert.pem
    
    echo -e "${GREEN}✅ Let's Encrypt certificates setup successfully!${NC}"
}

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

# Function to check if certificates exist and are valid
check_existing_certificates() {
    echo -e "${YELLOW}🔍 Checking existing certificates...${NC}"
    
    if [ -f "$SSL_DIR/cert.pem" ] && [ -f "$SSL_DIR/key.pem" ]; then
        echo -e "${GREEN}✅ SSL certificates found${NC}"
        
        # Check certificate expiration (if openssl is available)
        if command -v openssl &> /dev/null; then
            EXPIRY=$(openssl x509 -enddate -noout -in $SSL_DIR/cert.pem | cut -d= -f2)
            EXPIRY_DATE=$(date -d "$EXPIRY" +%s)
            CURRENT_DATE=$(date +%s)
            DAYS_LEFT=$(( ($EXPIRY_DATE - $CURRENT_DATE) / 86400 ))
            
            echo -e "${YELLOW}📅 Certificate expires: $EXPIRY (in $DAYS_LEFT days)${NC}"
            
            # If certificate is valid for more than 30 days, use it
            if [ $DAYS_LEFT -gt 30 ]; then
                echo -e "${GREEN}✅ Certificate is still valid for $DAYS_LEFT days${NC}"
                return 0
            else
                echo -e "${YELLOW}⚠️  Certificate expires soon ($DAYS_LEFT days), will renew${NC}"
                return 1
            fi
        else
            echo -e "${GREEN}✅ Certificates exist, assuming valid${NC}"
            return 0
        fi
    else
        echo -e "${YELLOW}📝 No existing certificates found${NC}"
        return 1
    fi
}

# Main execution - Let's Encrypt only
echo -e "${YELLOW}🚀 Setting up Let's Encrypt SSL certificates...${NC}"

# Check if we need to generate new certificates
if check_existing_certificates; then
    echo -e "${GREEN}✅ Using existing valid certificates${NC}"
else
    # Setup Let's Encrypt certificates
    if setup_lets_encrypt; then
        echo -e "${GREEN}✅ Let's Encrypt setup completed successfully!${NC}"
    else
        echo -e "${RED}❌ Let's Encrypt setup failed${NC}"
        echo "Please check:"
        echo "  - Domain DNS is pointing to this server"
        echo "  - Port 80 is accessible from internet"
        echo "  - Nginx container is running"
        exit 1
    fi
fi

restart_nginx

echo -e "${GREEN}🎉 SSL setup completed successfully!${NC}"
echo ""
echo "Your application should now be accessible via HTTPS:"
echo "  https://$DOMAIN"
echo "  https://$WWW_DOMAIN"
echo ""
echo "Note: Nginx container has been restarted to load new certificates."
echo ""
echo "⚠️  IMPORTANT: Let's Encrypt certificates expire in 90 days."
echo "   You'll need to manually renew them or set up auto-renewal." 
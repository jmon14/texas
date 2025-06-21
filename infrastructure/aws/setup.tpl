#!/bin/bash
apt-get update
apt-get install -y docker.io docker-compose certbot python3-certbot-nginx
systemctl enable docker
systemctl start docker

# Install Nginx
apt-get install -y nginx

# Copy the Nginx configuration
cat > /etc/nginx/nginx.conf <<'EOF'
${nginx_conf}
EOF

# Restart Nginx
nginx -t && systemctl restart nginx

# Setup SSL with Let's Encrypt
certbot --nginx -d allinrange.com -d www.allinrange.com --non-interactive --agree-tos --email ${domain_email} 
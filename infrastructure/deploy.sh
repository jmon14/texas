#!/bin/bash
set -e

# Get the EC2 instance ID using AWS CLI (more reliable for CI/CD)
INSTANCE_ID=$(aws ec2 describe-instances \
    --filters "Name=tag:Name,Values=texas-server" "Name=instance-state-name,Values=running" \
    --query 'Reservations[0].Instances[0].InstanceId' \
    --output text)

# Validate instance ID
if [ -z "$INSTANCE_ID" ] || [ "$INSTANCE_ID" = "None" ]; then
    echo "❌ Could not find running texas-server instance"
    echo "Make sure the instance is running and has the tag Name=texas-server"
    exit 1
fi

echo "Deploying to EC2 instance $INSTANCE_ID..."

# Transfer the code directly to the server
echo "Transferring code to server..."
aws ssm send-command \
    --instance-ids $INSTANCE_ID \
    --document-name "AWS-RunShellScript" \
    --parameters "commands=[
        'cd ~',
        'rm -rf texas',
        'mkdir texas',
        'cd texas',
        'cat > deploy.tar.gz << \"EOF\"',
        '$(cd .. && tar -cz . | base64 -w 0)',
        'EOF',
        'base64 -d deploy.tar.gz | tar -xz',
        'rm deploy.tar.gz',
        'POSTGRES_USER=$(aws ssm get-parameter --name \"/texas/ultron/POSTGRES_USER\" --query \"Parameter.Value\" --output text)',
        'POSTGRES_PASSWORD=$(aws ssm get-parameter --name \"/texas/ultron/POSTGRES_PASSWORD\" --with-decryption --query \"Parameter.Value\" --output text)',
        'MONGO_USER=$(aws ssm get-parameter --name \"/vision/mongodb/MONGO_USER\" --query \"Parameter.Value\" --output text)',
        'MONGO_PASSWORD=$(aws ssm get-parameter --name \"/vision/mongodb/MONGO_PASSWORD\" --with-decryption --query \"Parameter.Value\" --output text)',
        'echo \"POSTGRES_USER=$POSTGRES_USER\" >> .env',
        'echo \"POSTGRES_PASSWORD=$POSTGRES_PASSWORD\" >> .env',
        'echo \"MONGO_USER=$MONGO_USER\" >> .env',
        'echo \"MONGO_PASSWORD=$MONGO_PASSWORD\" >> .env',
        'docker-compose -f infrastructure/docker-compose.prod.yml down',
        'docker-compose -f infrastructure/docker-compose.prod.yml pull',
        'docker-compose -f infrastructure/docker-compose.prod.yml up -d',
        'docker-compose -f infrastructure/docker-compose.prod.yml ps'
    ]"

# Wait for containers to be ready with health check
echo "Waiting for containers to be ready..."
aws ssm send-command \
    --instance-ids $INSTANCE_ID \
    --document-name "AWS-RunShellScript" \
    --parameters "commands=[
        'cd ~/texas',
        'timeout=120',
        'counter=0',
        'while [ $counter -lt $timeout ]; do',
        '  if docker-compose -f infrastructure/docker-compose.prod.yml ps | grep -q \"Up\"; then',
        '    echo \"Containers are ready!\"',
        '    break',
        '  fi',
        '  echo \"Waiting for containers... ($counter/$timeout)\"',
        '  sleep 5',
        '  counter=$((counter + 5))',
        'done',
        'if [ $counter -eq $timeout ]; then',
        '  echo \"Timeout waiting for containers\"',
        '  exit 1',
        'fi'
    ]"

# Setup SSL certificates on the server (with retry logic)
echo "Setting up SSL certificates..."
SSL_SETUP_RESULT=$(aws ssm send-command \
    --instance-ids $INSTANCE_ID \
    --document-name "AWS-RunShellScript" \
    --parameters "commands=[
        'cd ~/texas/infrastructure/nginx',
        'DOMAIN_EMAIL=$(aws ssm get-parameter --name \"/texas/ultron/DOMAIN_EMAIL\" --query \"Parameter.Value\" --output text)',
        'if [ -z \"$DOMAIN_EMAIL\" ]; then',
        '  echo \"❌ DOMAIN_EMAIL parameter not found in SSM Parameter Store\"',
        '  echo \"Please create the parameter: aws ssm put-parameter --name /texas/ultron/DOMAIN_EMAIL --value your-email@domain.com --type String\"',
        '  exit 1',
        'fi',
        'DOMAIN_EMAIL=$DOMAIN_EMAIL ./setup-ssl.sh'
    ]" \
    --query 'Command.CommandId' \
    --output text)

# Wait for SSL setup to complete and check result
echo "Waiting for SSL setup to complete..."
aws ssm wait command-executed --command-id $SSL_SETUP_RESULT --instance-id $INSTANCE_ID

# Check SSL setup status
SSL_STATUS=$(aws ssm get-command-invocation \
    --command-id $SSL_SETUP_RESULT \
    --instance-id $INSTANCE_ID \
    --query 'Status' \
    --output text)

if [ "$SSL_STATUS" != "Success" ]; then
    echo "⚠️  SSL setup had issues, but continuing with deployment..."
    echo "You can manually setup SSL later with: ./setup-ssl.sh"
else
    echo "✅ SSL setup completed successfully!"
fi

echo "Deployment completed!"
echo "Your application should be available at:"
echo "https://allinrange.com"
echo "https://www.allinrange.com"
echo ""
if [ "$SSL_STATUS" != "Success" ]; then
    echo "⚠️  SSL setup may need manual attention."
    echo "Run on server: cd ~/texas/infrastructure/nginx && ./setup-ssl.sh"
else
    echo "✅ SSL certificates have been automatically configured."
fi 
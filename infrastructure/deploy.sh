#!/bin/bash
set -e

# Configuration
S3_BUCKET="files.allinrange.com"
DEPLOYMENT_KEY="texas-deploy.tar.gz"

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

# Step 1: Create deployment package and upload to S3
echo "📦 Creating deployment package and uploading to S3..."
cd ..
tar -cz . | aws s3 cp - "s3://$S3_BUCKET/$DEPLOYMENT_KEY"
echo "✅ Deployment package uploaded to s3://$S3_BUCKET/$DEPLOYMENT_KEY"

# Step 2: Download and extract code on the server
echo "📥 Downloading and extracting code on server..."
aws ssm send-command \
    --instance-ids $INSTANCE_ID \
    --document-name "AWS-RunShellScript" \
    --parameters "commands=[
        'cd /home/ssm-user',
        'rm -rf texas',
        'mkdir texas',
        'cd texas',
        'aws s3 cp s3://files.allinrange.com/$DEPLOYMENT_KEY deploy.tar.gz',
        'tar -xzf deploy.tar.gz',
        'rm deploy.tar.gz'
    ]" \
    --output text

# Wait for code transfer to complete
echo "⏳ Waiting for code transfer to complete..."
sleep 10

# Step 3: Setup environment variables
echo "🔧 Setting up environment variables..."
ENV_SETUP_RESULT=$(aws ssm send-command \
    --instance-ids $INSTANCE_ID \
    --document-name "AWS-RunShellScript" \
    --parameters "commands=[
        'cd /home/ssm-user/texas',
        'echo \"Starting environment variable setup...\"',
        'POSTGRES_USER=$(aws ssm get-parameter --name "/texas/ultron/POSTGRES_USER" --query "Parameter.Value" --output text)',
        'echo \"POSTGRES_USER retrieved: \$POSTGRES_USER\"',
        'POSTGRES_PASSWORD=$(aws ssm get-parameter --name "/texas/ultron/POSTGRES_PASSWORD" --with-decryption --query "Parameter.Value" --output text)',
        'echo \"POSTGRES_PASSWORD retrieved: [HIDDEN]\"',
        'MONGO_USER=$(aws ssm get-parameter --name "/vision/mongodb/MONGO_USER" --query "Parameter.Value" --output text)',
        'echo \"MONGO_USER retrieved: \$MONGO_USER\"',
        'MONGO_PASSWORD=$(aws ssm get-parameter --name "/vision/mongodb/MONGO_PASSWORD" --with-decryption --query "Parameter.Value" --output text)',
        'echo \"MONGO_PASSWORD retrieved: [HIDDEN]\"',
        'echo \"POSTGRES_USER=\$POSTGRES_USER\" > .env',
        'echo \"POSTGRES_PASSWORD=\$POSTGRES_PASSWORD\" >> .env',
        'echo \"MONGO_USER=\$MONGO_USER\" >> .env',
        'echo \"MONGO_PASSWORD=\$MONGO_PASSWORD\" >> .env',
        'echo \"Environment variables configured successfully\"',
        'echo \"Contents of .env file:\"',
        'cat .env | sed \"s/=.*/=***/\"'
    ]" \
    --query 'Command.CommandId' \
    --output text)

# Wait for environment setup to complete
echo "⏳ Waiting for environment setup to complete..."
aws ssm wait command-executed --command-id $ENV_SETUP_RESULT --instance-id $INSTANCE_ID

# Get the output
echo "📋 Environment setup output:"
aws ssm get-command-invocation \
    --command-id $ENV_SETUP_RESULT \
    --instance-id $INSTANCE_ID \
    --query 'StandardOutputContent' \
    --output text

# Step 4: Deploy containers
echo "🐳 Deploying containers..."
aws ssm send-command \
    --instance-ids $INSTANCE_ID \
    --document-name "AWS-RunShellScript" \
    --parameters "commands=[
        'cd /home/ssm-user/texas',
        'docker-compose -f infrastructure/docker-compose.prod.yml down',
        'docker-compose -f infrastructure/docker-compose.prod.yml pull',
        'docker-compose -f infrastructure/docker-compose.prod.yml up -d',
        'docker-compose -f infrastructure/docker-compose.prod.yml ps'
    ]" \
    --output text

# Wait for containers to be ready with health check
echo "⏳ Waiting for containers to be ready..."
aws ssm send-command \
    --instance-ids $INSTANCE_ID \
    --document-name "AWS-RunShellScript" \
    --parameters "commands=[
        'cd /home/ssm-user/texas',
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
    ]" \
    --output text

# Step 5: Setup SSL certificates on the server (with retry logic)
echo "🔒 Setting up SSL certificates..."
SSL_SETUP_RESULT=$(aws ssm send-command \
    --instance-ids $INSTANCE_ID \
    --document-name "AWS-RunShellScript" \
    --parameters "commands=[
        'cd /home/ssm-user/texas/infrastructure/nginx',
        'echo \"Starting SSL certificate setup...\"',
        'echo \"Current directory: \$(pwd)\"',
        'echo \"Checking if setup-ssl.sh exists...\"',
        'ls -la setup-ssl.sh',
        'DOMAIN_EMAIL=$(aws ssm get-parameter --name "/texas/ultron/DOMAIN_EMAIL" --query "Parameter.Value" --output text)',
        'echo \"DOMAIN_EMAIL retrieved: \$DOMAIN_EMAIL\"',
        'if [ -z \"\$DOMAIN_EMAIL\" ]; then',
        '  echo \"❌ DOMAIN_EMAIL parameter not found in SSM Parameter Store\"',
        '  echo \"Please create the parameter: aws ssm put-parameter --name /texas/ultron/DOMAIN_EMAIL --value your-email@domain.com --type String\"',
        '  exit 1',
        'fi',
        'echo \"Using DOMAIN_EMAIL: \$DOMAIN_EMAIL\"',
        'echo \"Making setup-ssl.sh executable...\"',
        'chmod +x setup-ssl.sh',
        'echo \"Running SSL setup script with timeout...\"',
        'timeout 300 DOMAIN_EMAIL=\$DOMAIN_EMAIL ./setup-ssl.sh || echo \"SSL setup timed out or failed, but continuing...\"',
        'echo \"SSL setup script completed\"'
    ]" \
    --query 'Command.CommandId' \
    --output text)

# Wait for SSL setup to complete with a shorter timeout
echo "⏳ Waiting for SSL setup to complete (max 5 minutes)..."
if aws ssm wait command-executed --command-id $SSL_SETUP_RESULT --instance-id $INSTANCE_ID --cli-read-timeout 300; then
    echo "✅ SSL setup completed"
else
    echo "⚠️ SSL setup timed out, but continuing with deployment..."
fi

# Get the SSL setup output (even if it failed)
echo "📋 SSL setup output:"
aws ssm get-command-invocation \
    --command-id $SSL_SETUP_RESULT \
    --instance-id $INSTANCE_ID \
    --query 'StandardOutputContent' \
    --output text

# Check SSL setup status
SSL_STATUS=$(aws ssm get-command-invocation \
    --command-id $SSL_SETUP_RESULT \
    --instance-id $INSTANCE_ID \
    --query 'Status' \
    --output text)

# Step 6: Cleanup S3 deployment file
# echo "🧹 Cleaning up S3 deployment file..."
# aws s3 rm "s3://$S3_BUCKET/$DEPLOYMENT_KEY"

if [ "$SSL_STATUS" != "Success" ]; then
    echo "⚠️  SSL setup had issues, but continuing with deployment..."
    echo "You can manually setup SSL later with: ./setup-ssl.sh"
else
    echo "✅ SSL setup completed successfully!"
fi

echo "🎉 Deployment completed!"
echo "Your application should be available at:"
echo "https://allinrange.com"
echo "https://www.allinrange.com"
echo ""
if [ "$SSL_STATUS" != "Success" ]; then
    echo "⚠️  SSL setup may need manual attention."
    echo "Run on server: cd /home/ssm-user/texas/infrastructure/nginx && ./setup-ssl.sh"
else
    echo "✅ SSL certificates have been automatically configured."
fi 
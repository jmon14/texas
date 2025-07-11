#!/bin/bash
set -e

# Configuration
S3_BUCKET="files.allinrange.com"
DEPLOYMENT_KEY="texas-deploy-config.tar.gz"

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

# Step 1: Create minimal deployment package (only config files)
echo "📦 Creating minimal deployment package..."
cd ..
# Create a temporary directory with only the files we need
mkdir -p temp-deploy/infrastructure
cp infrastructure/docker-compose.prod.yml temp-deploy/infrastructure/
cp -r infrastructure/nginx temp-deploy/infrastructure/
cd temp-deploy
tar -cz . | aws s3 cp - "s3://$S3_BUCKET/$DEPLOYMENT_KEY"
cd ..
rm -rf temp-deploy
echo "✅ Minimal deployment package uploaded to s3://$S3_BUCKET/$DEPLOYMENT_KEY"

# Step 2: Download and extract config files on the server
echo "📥 Downloading and extracting config files on server..."
CONFIG_TRANSFER_RESULT=$(aws ssm send-command \
    --instance-ids $INSTANCE_ID \
    --document-name "AWS-RunShellScript" \
    --parameters "commands=[
        'cd /home/ssm-user',
        'rm -rf texas',
        'mkdir -p texas/infrastructure',
        'cd texas',
        'aws s3 cp s3://files.allinrange.com/$DEPLOYMENT_KEY deploy-config.tar.gz',
        'tar -xzf deploy-config.tar.gz',
        'rm deploy-config.tar.gz'
    ]" \
    --query 'Command.CommandId' \
    --output text)

# Wait for config transfer to complete
echo "⏳ Waiting for config transfer to complete..."
aws ssm wait command-executed --command-id $CONFIG_TRANSFER_RESULT --instance-id $INSTANCE_ID

# Get the config transfer output
echo "📋 Config transfer output:"
aws ssm get-command-invocation \
    --command-id $CONFIG_TRANSFER_RESULT \
    --instance-id $INSTANCE_ID \
    --query 'StandardOutputContent' \
    --output text

# Step 3: Setup environment variables
echo "🔧 Setting up environment variables..."
ENV_SETUP_RESULT=$(aws ssm send-command \
    --instance-ids $INSTANCE_ID \
    --document-name "AWS-RunShellScript" \
    --parameters "commands=[
        'cd /home/ssm-user/texas/infrastructure',
        'echo \"Starting environment variable setup...\"',
        'POSTGRES_USER=$(aws ssm get-parameter --name "/texas/ultron/POSTGRES_USER" --query "Parameter.Value" --output text)',
        'POSTGRES_PASSWORD=$(aws ssm get-parameter --name "/texas/ultron/POSTGRES_PASSWORD" --with-decryption --query "Parameter.Value" --output text)',
        'MONGO_USER=$(aws ssm get-parameter --name "/vision/mongodb/MONGO_USER" --query "Parameter.Value" --output text)',
        'MONGO_PASSWORD=$(aws ssm get-parameter --name "/vision/mongodb/MONGO_PASSWORD" --with-decryption --query "Parameter.Value" --output text)',
        'ECR_REGISTRY=${ECR_REGISTRY}',
        'IMAGE_TAG=${IMAGE_TAG:-latest}',
        'echo \"ECR_REGISTRY=\$ECR_REGISTRY\" > .env',
        'echo \"IMAGE_TAG=\$IMAGE_TAG\" >> .env',
        'echo \"POSTGRES_USER=\$POSTGRES_USER\" >> .env',
        'echo \"POSTGRES_PASSWORD=\$POSTGRES_PASSWORD\" >> .env',
        'echo \"MONGO_USER=\$MONGO_USER\" >> .env',
        'echo \"MONGO_PASSWORD=\$MONGO_PASSWORD\" >> .env',
        'echo \"Environment variables configured successfully\"'
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

# Step 4: Deploy pre-built containers
echo "🐳 Deploying pre-built containers from ECR..."
CONTAINER_DEPLOY_RESULT=$(aws ssm send-command \
    --instance-ids $INSTANCE_ID \
    --document-name "AWS-RunShellScript" \
    --parameters "commands=[
        'cd /home/ssm-user/texas',
        'echo \"Logging into ECR...\"',
        'aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin ${ECR_REGISTRY}',
        'echo \"Stopping existing containers...\"',
        'docker-compose -f infrastructure/docker-compose.prod.yml down',
        'echo \"Pulling latest images from ECR...\"',
        'docker-compose -f infrastructure/docker-compose.prod.yml pull',
        'echo \"Starting containers with pre-built images...\"',
        'docker-compose -f infrastructure/docker-compose.prod.yml up -d',
        'echo \"Container status:\"',
        'docker-compose -f infrastructure/docker-compose.prod.yml ps'
    ]" \
    --query 'Command.CommandId' \
    --output text)

# Wait for container deployment to complete
echo "⏳ Waiting for container deployment to complete..."
aws ssm wait command-executed --command-id $CONTAINER_DEPLOY_RESULT --instance-id $INSTANCE_ID

# Get the container deployment output
echo "📋 Container deployment output:"
aws ssm get-command-invocation \
    --command-id $CONTAINER_DEPLOY_RESULT \
    --instance-id $INSTANCE_ID \
    --query 'StandardOutputContent' \
    --output text

# Wait for containers to be ready with health check
echo "⏳ Waiting for containers to be ready..."
CONTAINER_HEALTH_RESULT=$(aws ssm send-command \
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
    --query 'Command.CommandId' \
    --output text)

# Wait for container health check to complete
aws ssm wait command-executed --command-id $CONTAINER_HEALTH_RESULT --instance-id $INSTANCE_ID

# Get the container health check output
echo "📋 Container health check output:"
aws ssm get-command-invocation \
    --command-id $CONTAINER_HEALTH_RESULT \
    --instance-id $INSTANCE_ID \
    --query 'StandardOutputContent' \
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
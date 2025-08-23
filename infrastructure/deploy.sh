#!/bin/bash
set -e

# Configuration
S3_BUCKET="files.allinrange.com"
DEPLOYMENT_KEY="texas-deploy-config.tar.gz"

# Get the EC2 instance ID using AWS CLI
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
        'MONGO_USER=$(aws ssm get-parameter --name "/vision/mongodb/MONGO_USER" --query "Parameter.Value" --output text)',
        'MONGO_PASSWORD=$(aws ssm get-parameter --name "/vision/mongodb/MONGO_PASSWORD" --with-decryption --query "Parameter.Value" --output text)',
        'ECR_REGISTRY=${ECR_REGISTRY}',
        'echo \"ECR_REGISTRY=\$ECR_REGISTRY\" > .env',
        'echo \"VISION_TAG=latest\" >> .env',
        'echo \"ULTRON_TAG=latest\" >> .env',
        'echo \"QUICKVIEW_TAG=latest\" >> .env',
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

# Step 4: Setup SSL certificates
echo "🔒 Setting up SSL certificates..."
SSL_SETUP_RESULT=$(aws ssm send-command \
    --instance-ids $INSTANCE_ID \
    --document-name "AWS-RunShellScript" \
    --parameters "commands=[
        'cd /home/ssm-user/texas/infrastructure/nginx',
        'DOMAIN_EMAIL=$(aws ssm get-parameter --name "/texas/ultron/DOMAIN_EMAIL" --query "Parameter.Value" --output text)',
        'echo \"DOMAIN_EMAIL retrieved: \$DOMAIN_EMAIL\"',
        'if [ -z \"\$DOMAIN_EMAIL\" ]; then',
        '  echo \"❌ DOMAIN_EMAIL parameter not found in SSM Parameter Store\"',
        '  echo \"Please create the parameter: aws ssm put-parameter --name /texas/ultron/DOMAIN_EMAIL --value your-email@domain.com --type String\"',
        '  exit 1',
        'fi',
        'echo \"Making setup-ssl.sh executable...\"',
        'chmod +x setup-ssl.sh',
        'echo \"Running SSL setup script with timeout...\"',
        'timeout 300 env DOMAIN_EMAIL=\$DOMAIN_EMAIL ./setup-ssl.sh || echo \"SSL setup timed out or failed, but continuing...\"',
        'echo \"SSL setup script completed\"'
    ]" \
    --query 'Command.CommandId' \
    --output text)

# Wait for SSL setup to complete
echo "⏳ Waiting for SSL setup to complete (max 5 minutes)..."
if aws ssm wait command-executed --command-id $SSL_SETUP_RESULT --instance-id $INSTANCE_ID --cli-read-timeout 300; then
    echo "✅ SSL setup completed"
else
    echo "⚠️ SSL setup timed out, but continuing with deployment..."
fi

# Get the SSL setup output
echo "📋 SSL setup output:"
aws ssm get-command-invocation \
    --command-id $SSL_SETUP_RESULT \
    --instance-id $INSTANCE_ID \
    --query 'StandardOutputContent' \
    --output text

# Step 5: Deploy containers using latest tags
echo "🐳 Deploying containers from ECR using latest tags..."
CONTAINER_DEPLOY_RESULT=$(aws ssm send-command \
    --instance-ids $INSTANCE_ID \
    --document-name "AWS-RunShellScript" \
    --parameters "commands=[
        'cd /home/ssm-user/texas',
        'echo \"🧹 Cleaning up Docker system before deployment...\"',
        'docker system prune -f --volumes',
        'echo \"Logging into ECR...\"',
        'aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin ${ECR_REGISTRY}',
        'echo \"Stopping existing containers...\"',
        'docker-compose -f infrastructure/docker-compose.prod.yml down',
        'echo \"Pulling latest images from ECR...\"',
        'docker-compose -f infrastructure/docker-compose.prod.yml pull',
        'echo \"Running database migrations (Ultron)...\"',
        'docker-compose -f infrastructure/docker-compose.prod.yml run --rm ultron node dist/scripts/migrate.js',
        'echo \"Starting containers with latest images...\"',
        'docker-compose -f infrastructure/docker-compose.prod.yml up -d'
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

# Step 6: Log disk space after deployment
echo "💾 Logging disk space after deployment..."
DISK_LOG_RESULT=$(aws ssm send-command \
    --instance-ids $INSTANCE_ID \
    --document-name "AWS-RunShellScript" \
    --parameters "commands=[
        'echo \"=== Disk Space After Deployment ===\"',
        'echo \"Available disk space on the server:\"',
        'df -h',
        'echo \"\"',
        'echo \"Docker disk usage:\"',
        'docker system df',
        'echo \"\"',
        'echo \"Container status:\"',
        'docker ps -a',
        'echo \"\"',
        'echo \"Docker Compose status:\"',
        'cd /home/ssm-user/texas && docker-compose -f infrastructure/docker-compose.prod.yml ps'
    ]" \
    --query 'Command.CommandId' \
    --output text)

# Wait for disk logging to complete
echo "⏳ Waiting for disk logging to complete..."
aws ssm wait command-executed --command-id $DISK_LOG_RESULT --instance-id $INSTANCE_ID

# Get the disk logging output
echo "📋 Disk space and container status:"
aws ssm get-command-invocation \
    --command-id $DISK_LOG_RESULT \
    --instance-id $INSTANCE_ID \
    --query 'StandardOutputContent' \
    --output text

# Step 7: Cleanup S3 deployment file
echo "🧹 Cleaning up S3 deployment file..."
aws s3 rm "s3://$S3_BUCKET/$DEPLOYMENT_KEY"

echo "🎉 Deployment completed!"
echo "Your application should be available at:"
echo "https://allinrange.com"
echo "https://www.allinrange.com"
echo ""
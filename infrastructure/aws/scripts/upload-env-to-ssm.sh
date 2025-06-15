#!/bin/bash

# Script to upload environment variables to AWS SSM Parameter Store
# This script takes a .env file and uploads each variable to SSM
# Sensitive values are stored as SecureString parameters

# Function to display usage
usage() {
    echo "Usage: $0 <env-file-path>"
    echo "Example: $0 ../production.env"
    echo ""
    echo "This script will:"
    echo "1. Read the specified .env file"
    echo "2. Upload each variable to SSM Parameter Store"
    echo "3. Store them under the /texas/ultron/ path"
    echo "4. Use SecureString type for all parameters"
    exit 1
}

# Check if env file is provided
if [ "$#" -ne 1 ]; then
    usage
fi

ENV_FILE=$1

# Check if file exists
if [ ! -f "$ENV_FILE" ]; then
    echo "Error: File $ENV_FILE does not exist"
    exit 1
fi

# Check if AWS CLI is installed and configured
if ! command -v aws &> /dev/null; then
    echo "AWS CLI is not installed. Please install it first."
    exit 1
fi

if ! aws sts get-caller-identity &> /dev/null; then
    echo "AWS credentials are not configured. Please run 'aws configure' first."
    exit 1
fi

# Function to upload parameter to SSM
upload_parameter() {
    local name=$1
    local value=$2
    local path="/texas/ultron/$name"
    
    echo "Uploading $name to SSM..."
    aws ssm put-parameter \
        --name "$path" \
        --value "$value" \
        --type SecureString \
        --overwrite
}

# Read the env file and upload each parameter
while IFS='=' read -r key value || [ -n "$key" ]; do
    # Skip comments and empty lines
    [[ $key =~ ^#.*$ ]] && continue
    [[ -z $key ]] && continue
    
    # Remove any quotes from the value
    value=$(echo "$value" | tr -d '"' | tr -d "'")
    
    # Upload to SSM
    upload_parameter "$key" "$value"
done < "$ENV_FILE"

echo "All parameters have been uploaded to SSM Parameter Store!"
echo "You can verify them using the manage-parameters.sh script." 
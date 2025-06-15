#!/bin/bash

# Function to display usage
usage() {
    echo "Usage: $0 [get|set] [parameter-name] [value]"
    echo "Examples:"
    echo "  $0 get mongodb_uri"
    echo "  $0 set mongodb_uri 'mongodb://user:pass@host:port/db'"
    exit 1
}

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "AWS credentials are not configured. Please run 'aws configure' first."
    exit 1
fi

# Get the parameter path
get_parameter_path() {
    local param_name=$1
    echo "/texas/ultron/$param_name"
}

# Main script logic
if [ "$#" -lt 2 ]; then
    usage
fi

ACTION=$1
PARAM_NAME=$2
PARAM_PATH=$(get_parameter_path "$PARAM_NAME")

case $ACTION in
    "get")
        aws ssm get-parameter --name "$PARAM_PATH" --with-decryption --query "Parameter.Value" --output text
        ;;
    "set")
        if [ "$#" -ne 3 ]; then
            echo "Error: Value is required for 'set' action"
            usage
        fi
        VALUE=$3
        aws ssm put-parameter \
            --name "$PARAM_PATH" \
            --value "$VALUE" \
            --type SecureString \
            --overwrite
        ;;
    *)
        usage
        ;;
esac 
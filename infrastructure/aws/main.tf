# =============================================================================
# Main Terraform Configuration for Texas Poker Application
# =============================================================================
#
# This file defines the core AWS infrastructure:
# - EC2 instance running Ubuntu 22.04
# - Elastic IP for static public IP
# - IAM instance profile for SSM access
# - Security groups for network access
#
# The EC2 instance runs Docker containers for:
# - Frontend (React)
# - Backend (NestJS)
# - Nginx (reverse proxy with SSL)
# =============================================================================

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Get the latest Ubuntu 22.04 AMI
data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"] # Canonical
}

# Elastic IP for the EC2 instance
# This IP is used for:
# - Domain DNS configuration
# - MongoDB Atlas whitelist
# - SSL certificate validation
# =============================================================================

resource "aws_eip" "texas_eip" {
  instance = aws_instance.texas_server.id
  domain   = "vpc"

  tags = {
    Name        = "texas-elastic-ip"
    Environment = "production"
    Project     = "texas"
    ManagedBy   = "terraform"
  }
}

# =============================================================================
# EC2 Instance Configuration
# =============================================================================
# Main application server running Ubuntu 22.04 LTS
# 
# Features:
# - t3.small instance type (production ready)
# - 20GB encrypted EBS volume
# - IAM instance profile for SSM access
# - Security group for network access
# - User data script for initial setup
#
# The instance runs Docker containers for all application services
# =============================================================================

resource "aws_instance" "texas_server" {
  ami                  = data.aws_ami.ubuntu.id
  instance_type        = var.instance_type
  iam_instance_profile = aws_iam_instance_profile.ec2_service_profile.name

  vpc_security_group_ids = [aws_security_group.texas_sg.id]

  root_block_device {
    volume_size = var.volume_size
    volume_type = "gp3"
    encrypted   = true
  }

  tags = {
    Name        = "texas-server"
    Environment = "production"
    Project     = "texas"
    ManagedBy   = "terraform"
  }

  user_data = templatefile("${path.module}/setup.tpl", {
    nginx_conf   = file("${path.module}/../nginx/nginx.conf")
    domain_email = var.domain_email
  })

  # Ignore AMI changes to prevent accidental instance replacement
  # AMI updates require manual intervention and planned migration
  lifecycle {
    ignore_changes = [ami]
  }
}

# =============================================================================
# Outputs
# =============================================================================
# Exports important values for use in other configurations
# =============================================================================

output "elastic_ip" {
  value       = aws_eip.texas_eip.public_ip
  description = "The Elastic IP address of the Texas server (use this IP for MongoDB Atlas whitelist)"
}
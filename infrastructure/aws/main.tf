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

# EC2 instance
resource "aws_instance" "texas_server" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
  key_name      = aws_key_pair.texas_key.key_name
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
}

output "public_ip" {
  value       = aws_instance.texas_server.public_ip
  description = "The public IP address of the Texas server"
}
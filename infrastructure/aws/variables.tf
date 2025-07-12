# AWS Region
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "eu-central-1"
}

# S3 Bucket
variable "aws_public_bucket_name" {
  description = "Name of the S3 bucket for public file storage"
  type        = string
  default     = "files.allinrange.com"
}

# EC2 Instance
variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "volume_size" {
  description = "Volume size in GB"
  type        = number
  default     = 20
}

variable "vision_mongodb_user" {
  description = "MongoDB username"
  type        = string
  sensitive   = true
}

variable "vision_mongodb_password" {
  description = "MongoDB password"
  type        = string
  sensitive   = true
}

variable "ultron_jwt_secret" {
  description = "JWT secret for Ultron"
  type        = string
  sensitive   = true
}

variable "ultron_jwt_refresh_secret" {
  description = "JWT refresh secret for Ultron"
  type        = string
  sensitive   = true
}

variable "ultron_jwt_email_secret" {
  description = "JWT email secret for Ultron"
  type        = string
  sensitive   = true
}

variable "ultron_postgres_user" {
  description = "PostgreSQL username for Ultron"
  type        = string
  sensitive   = true
}

variable "ultron_postgres_password" {
  description = "PostgreSQL password for Ultron"
  type        = string
  sensitive   = true
}

variable "ultron_postgres_host" {
  description = "PostgreSQL host for Ultron (Supabase)"
  type        = string
  default     = "aws-0-eu-central-1.pooler.supabase.com"
}

variable "aws_ses_smtp_username" {
  description = "AWS SES SMTP username"
  type        = string
  sensitive   = true
}

variable "aws_ses_smtp_password" {
  description = "AWS SES SMTP password"
  type        = string
  sensitive   = true
}

variable "domain_email" {
  description = "Email address for Let's Encrypt/Certbot"
  type        = string
}
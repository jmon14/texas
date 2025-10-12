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
  description = "EC2 Instance type"
  type        = string
  default     = "t3.micro"
}

variable "volume_size" {
  description = "Volume size in GB"
  type        = number
  default     = 20
}

variable "backend_jwt_secret" {
  description = "JWT secret for Backend"
  type        = string
  sensitive   = true
}

variable "backend_jwt_refresh_secret" {
  description = "JWT refresh secret for Backend"
  type        = string
  sensitive   = true
}

variable "backend_jwt_email_secret" {
  description = "JWT email secret for Backend"
  type        = string
  sensitive   = true
}

variable "backend_postgres_user" {
  description = "PostgreSQL username for Backend"
  type        = string
  sensitive   = true
}

variable "backend_postgres_password" {
  description = "PostgreSQL password for Backend"
  type        = string
  sensitive   = true
}

variable "backend_postgres_host" {
  description = "PostgreSQL host for Backend (Supabase)"
  type        = string
  default     = "aws-0-eu-central-1.pooler.supabase.com"
}

variable "backend_mongodb_uri" {
  description = "MongoDB connection URI for Backend (ranges data)"
  type        = string
  sensitive   = true
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
# IAM policy for SSM parameter access
resource "aws_iam_policy" "ssm_parameter_access" {
  name        = "SSMParameterAccess"
  description = "Policy to allow access to SSM parameters"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ssm:GetParameter",
          "ssm:GetParameters",
          "ssm:GetParametersByPath"
        ]
        Resource = [
          "arn:aws:ssm:${var.aws_region}:*:parameter/texas/backend/*"
        ]
      }
    ]
  })
}

# Attach the policy to the instance role
resource "aws_iam_role_policy_attachment" "ssm_parameter_access" {
  role       = aws_iam_instance_profile.ec2_service_profile.role
  policy_arn = aws_iam_policy.ssm_parameter_access.arn
}

# Attach SSM agent policy to the instance role
resource "aws_iam_role_policy_attachment" "ssm_agent_access" {
  role       = aws_iam_instance_profile.ec2_service_profile.role
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

# Databases Configuration

# PostgreSQL Configuration
resource "aws_ssm_parameter" "backend_postgres_user" {
  name        = "/texas/backend/POSTGRES_USER"
  description = "PostgreSQL user for Backend"
  type        = "String"
  value       = var.backend_postgres_user
}

resource "aws_ssm_parameter" "backend_postgres_password" {
  name        = "/texas/backend/POSTGRES_PASSWORD"
  description = "PostgreSQL password for Backend"
  type        = "SecureString"
  value       = var.backend_postgres_password
}

resource "aws_ssm_parameter" "backend_postgres_host" {
  name        = "/texas/backend/POSTGRES_HOST"
  description = "PostgreSQL host for Backend (Supabase)"
  type        = "String"
  value       = var.backend_postgres_host
}

# MongoDB Configuration (for ranges data)
resource "aws_ssm_parameter" "backend_mongodb_uri" {
  name        = "/texas/backend/MONGODB_URI"
  description = "MongoDB connection URI for Backend (ranges data)"
  type        = "SecureString"
  value       = var.backend_mongodb_uri
}

# Backend JWT Configuration
resource "aws_ssm_parameter" "backend_jwt_secret" {
  name        = "/texas/backend/JWT_SECRET"
  description = "JWT secret for Backend"
  type        = "SecureString"
  value       = var.backend_jwt_secret
}

resource "aws_ssm_parameter" "backend_jwt_refresh_secret" {
  name        = "/texas/backend/JWT_REFRESH_SECRET"
  description = "JWT refresh secret for Backend"
  type        = "SecureString"
  value       = var.backend_jwt_refresh_secret
}

resource "aws_ssm_parameter" "backend_jwt_email_secret" {
  name        = "/texas/backend/JWT_EMAIL_SECRET"
  description = "JWT email secret for Backend"
  type        = "SecureString"
  value       = var.backend_jwt_email_secret
}

# Backend JWT Expiration Times
resource "aws_ssm_parameter" "backend_jwt_expiration_time" {
  name        = "/texas/backend/JWT_EXPIRATION_TIME"
  description = "JWT expiration time in seconds"
  type        = "String"
  value       = "3600"
}

resource "aws_ssm_parameter" "backend_jwt_refresh_expiration_time" {
  name        = "/texas/backend/JWT_REFRESH_EXPIRATION_TIME"
  description = "JWT refresh expiration time in seconds"
  type        = "String"
  value       = "18000"
}

resource "aws_ssm_parameter" "backend_jwt_email_expiration_time" {
  name        = "/texas/backend/JWT_EMAIL_EXPIRATION_TIME"
  description = "JWT email expiration time in seconds"
  type        = "String"
  value       = "1800"
}

# Backend Email Configuration
resource "aws_ssm_parameter" "backend_email_service" {
  name        = "/texas/backend/EMAIL_SERVICE"
  description = "Email service for Backend"
  type        = "String"
  value       = "SES"
}

resource "aws_ssm_parameter" "backend_email_user" {
  name        = "/texas/backend/EMAIL_USER"
  description = "Email user for Backend"
  type        = "String"
  value       = var.aws_ses_smtp_username
}

resource "aws_ssm_parameter" "backend_email_password" {
  name        = "/texas/backend/EMAIL_PASSWORD"
  description = "Email password for Backend"
  type        = "SecureString"
  value       = var.aws_ses_smtp_password
}

# Backend Application Configuration
resource "aws_ssm_parameter" "backend_domain" {
  name        = "/texas/backend/DOMAIN"
  description = "Domain for Backend"
  type        = "String"
  value       = ".allinrange.com"
}

resource "aws_ssm_parameter" "backend_ui_url" {
  name        = "/texas/backend/UI_URL"
  description = "UI URL for Backend"
  type        = "String"
  value       = "https://www.allinrange.com"
}

resource "aws_ssm_parameter" "backend_aws_public_bucket_name" {
  name        = "/texas/backend/AWS_PUBLIC_BUCKET_NAME"
  description = "AWS public bucket name for Backend"
  type        = "String"
  value       = "files.allinrange.com"
}

# AWS SES SMTP credentials
resource "aws_ssm_parameter" "aws_ses_smtp_username" {
  name        = "/texas/backend/AWS_SES_SMTP_USERNAME"
  description = "AWS SES SMTP username"
  type        = "SecureString"
  value       = var.aws_ses_smtp_username
}

resource "aws_ssm_parameter" "aws_ses_smtp_password" {
  name        = "/texas/backend/AWS_SES_SMTP_PASSWORD"
  description = "AWS SES SMTP password"
  type        = "SecureString"
  value       = var.aws_ses_smtp_password
}

# Domain email for SSL certificates
resource "aws_ssm_parameter" "domain_email" {
  name        = "/texas/backend/DOMAIN_EMAIL"
  description = "Domain email for SSL certificates"
  type        = "String"
  value       = var.domain_email
}

output "ssm_parameters" {
  description = "SSM parameter ARNs"
  value = {
    backend_jwt_secret         = aws_ssm_parameter.backend_jwt_secret.arn
    backend_jwt_refresh_secret = aws_ssm_parameter.backend_jwt_refresh_secret.arn
    backend_jwt_email_secret   = aws_ssm_parameter.backend_jwt_email_secret.arn
    backend_postgres_user      = aws_ssm_parameter.backend_postgres_user.arn
    backend_postgres_password  = aws_ssm_parameter.backend_postgres_password.arn
    backend_postgres_host      = aws_ssm_parameter.backend_postgres_host.arn
    backend_mongodb_uri        = aws_ssm_parameter.backend_mongodb_uri.arn
    aws_ses_smtp_username      = aws_ssm_parameter.aws_ses_smtp_username.arn
    aws_ses_smtp_password      = aws_ssm_parameter.aws_ses_smtp_password.arn
    domain_email               = aws_ssm_parameter.domain_email.arn
  }
}
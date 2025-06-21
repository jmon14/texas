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
          "arn:aws:ssm:${var.aws_region}:*:parameter/vision/*",
          "arn:aws:ssm:${var.aws_region}:*:parameter/ultron/*"
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

# Databases Configuration

resource "aws_ssm_parameter" "vision_mongodb_user" {
  name        = "/vision/mongodb/MONGO_USER"
  description = "MongoDB user for Vision"
  type        = "String"
  value       = var.mongodb_user
}

resource "aws_ssm_parameter" "vision_mongodb_password" {
  name        = "/vision/mongodb/MONGO_PASSWORD"
  description = "MongoDB password for Vision"
  type        = "SecureString"
  value       = var.mongodb_password
}

resource "aws_ssm_parameter" "ultron_postgres_user" {
  name        = "/texas/ultron/POSTGRES_USER"
  description = "PostgreSQL user for Ultron"
  type        = "String"
  value       = var.ultron_postgres_user
}

resource "aws_ssm_parameter" "ultron_postgres_password" {
  name        = "/texas/ultron/POSTGRES_PASSWORD"
  description = "PostgreSQL password for Ultron"
  type        = "SecureString"
  value       = var.ultron_postgres_password
}

# Ultron JWT Configuration
resource "aws_ssm_parameter" "ultron_jwt_secret" {
  name        = "/ultron/jwt/JWT_SECRET"
  description = "JWT secret for Ultron"
  type        = "SecureString"
  value       = var.ultron_jwt_secret
}

resource "aws_ssm_parameter" "ultron_jwt_refresh_secret" {
  name        = "/ultron/jwt/JWT_REFRESH_SECRET"
  description = "JWT refresh secret for Ultron"
  type        = "SecureString"
  value       = var.ultron_jwt_refresh_secret
}

resource "aws_ssm_parameter" "ultron_jwt_email_secret" {
  name        = "/ultron/jwt/JWT_EMAIL_SECRET"
  description = "JWT email secret for Ultron"
  type        = "SecureString"
  value       = var.ultron_jwt_email_secret
}

# Ultron JWT Expiration Times
resource "aws_ssm_parameter" "ultron_jwt_expiration_time" {
  name        = "/ultron/jwt/JWT_EXPIRATION_TIME"
  description = "JWT expiration time in seconds"
  type        = "String"
  value       = "3600"
}

resource "aws_ssm_parameter" "ultron_jwt_refresh_expiration_time" {
  name        = "/texas/ultron/JWT_REFRESH_EXPIRATION_TIME"
  description = "JWT refresh expiration time in seconds"
  type        = "String"
  value       = "18000"
}

resource "aws_ssm_parameter" "ultron_jwt_email_expiration_time" {
  name        = "/texas/ultron/JWT_EMAIL_EXPIRATION_TIME"
  description = "JWT email expiration time in seconds"
  type        = "String"
  value       = "1800"
}

# Ultron Email Configuration
resource "aws_ssm_parameter" "ultron_email_service" {
  name        = "/texas/ultron/EMAIL_SERVICE"
  description = "Email service for Ultron"
  type        = "String"
  value       = "SES"
}

resource "aws_ssm_parameter" "ultron_email_user" {
  name        = "/texas/ultron/EMAIL_USER"
  description = "Email user for Ultron"
  type        = "String"
  value       = var.aws_ses_smtp_username
}

resource "aws_ssm_parameter" "ultron_email_password" {
  name        = "/texas/ultron/EMAIL_PASSWORD"
  description = "Email password for Ultron"
  type        = "SecureString"
  value       = var.aws_ses_smtp_password
}

# Ultron Application Configuration
resource "aws_ssm_parameter" "ultron_domain" {
  name        = "/texas/ultron/DOMAIN"
  description = "Domain for Ultron"
  type        = "String"
  value       = ".allinrange.com"
}

resource "aws_ssm_parameter" "ultron_ui_url" {
  name        = "/texas/ultron/UI_URL"
  description = "UI URL for Ultron"
  type        = "String"
  value       = "https://allinrange.com"
}

resource "aws_ssm_parameter" "ultron_aws_public_bucket_name" {
  name        = "/texas/ultron/AWS_PUBLIC_BUCKET_NAME"
  description = "AWS public bucket name for Ultron"
  type        = "String"
  value       = "files.allinrange.com"
}

# AWS SES SMTP credentials
resource "aws_ssm_parameter" "aws_ses_smtp_username" {
  name        = "/texas/ultron/AWS_SES_SMTP_USERNAME"
  description = "AWS SES SMTP username"
  type        = "SecureString"
  value       = var.aws_ses_smtp_username
}

resource "aws_ssm_parameter" "aws_ses_smtp_password" {
  name        = "/texas/ultron/AWS_SES_SMTP_PASSWORD"
  description = "AWS SES SMTP password"
  type        = "SecureString"
  value       = var.aws_ses_smtp_password
}

output "ssm_parameters" {
  description = "SSM parameter ARNs"
  value = {
    vision_mongodb_user       = aws_ssm_parameter.vision_mongodb_user.arn
    vision_mongodb_password   = aws_ssm_parameter.vision_mongodb_password.arn
    ultron_jwt_secret         = aws_ssm_parameter.ultron_jwt_secret.arn
    ultron_jwt_refresh_secret = aws_ssm_parameter.ultron_jwt_refresh_secret.arn
    ultron_jwt_email_secret   = aws_ssm_parameter.ultron_jwt_email_secret.arn
    ultron_postgres_user      = aws_ssm_parameter.ultron_postgres_user.arn
    ultron_postgres_password  = aws_ssm_parameter.ultron_postgres_password.arn
    aws_ses_smtp_username     = aws_ssm_parameter.aws_ses_smtp_username.arn
    aws_ses_smtp_password     = aws_ssm_parameter.aws_ses_smtp_password.arn
  }
}
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

# Store SSH public key in SSM Parameter Store
resource "aws_ssm_parameter" "ssh_public_key" {
  name        = "/texas/ssh/public_key"
  description = "SSH public key for Texas project"
  type        = "SecureString"
  value       = file("${var.ssh_public_key_path}")
}

# SSH key pair
resource "aws_key_pair" "texas_key" {
  key_name   = "texas-key"
  public_key = aws_ssm_parameter.ssh_public_key.value
}

resource "aws_ssm_parameter" "vision_mongodb_uri" {
  name        = "/vision/mongodb/uri"
  description = "MongoDB connection URI for Vision"
  type        = "SecureString"
  value       = var.vision_mongodb_uri
}

resource "aws_ssm_parameter" "ultron_jwt_secret" {
  name        = "/ultron/jwt/secret"
  description = "JWT secret for Ultron"
  type        = "SecureString"
  value       = var.ultron_jwt_secret
}

resource "aws_ssm_parameter" "ultron_jwt_refresh_secret" {
  name        = "/ultron/jwt/refresh-secret"
  description = "JWT refresh secret for Ultron"
  type        = "SecureString"
  value       = var.ultron_jwt_refresh_secret
}

resource "aws_ssm_parameter" "ultron_jwt_email_secret" {
  name        = "/ultron/jwt/email-secret"
  description = "JWT email secret for Ultron"
  type        = "SecureString"
  value       = var.ultron_jwt_email_secret
}

resource "aws_ssm_parameter" "ultron_postgres_url" {
  name        = "/ultron/postgres/url"
  description = "PostgreSQL connection URL for Ultron"
  type        = "SecureString"
  value       = var.ultron_postgres_url
}

resource "aws_ssm_parameter" "ultron_postgres_password" {
  name        = "/ultron/postgres/password"
  description = "PostgreSQL password for Ultron"
  type        = "SecureString"
  value       = var.ultron_postgres_password
}

# AWS SES SMTP credentials
resource "aws_ssm_parameter" "aws_ses_smtp_username" {
  name        = "/ultron/aws/ses/smtp/username"
  description = "AWS SES SMTP username"
  type        = "SecureString"
  value       = var.aws_ses_smtp_username
}

resource "aws_ssm_parameter" "aws_ses_smtp_password" {
  name        = "/ultron/aws/ses/smtp/password"
  description = "AWS SES SMTP password"
  type        = "SecureString"
  value       = var.aws_ses_smtp_password
}

output "ssm_parameters" {
  description = "SSM parameter ARNs"
  value = {
    vision_mongodb_uri        = aws_ssm_parameter.vision_mongodb_uri.arn
    ultron_jwt_secret         = aws_ssm_parameter.ultron_jwt_secret.arn
    ultron_jwt_refresh_secret = aws_ssm_parameter.ultron_jwt_refresh_secret.arn
    ultron_jwt_email_secret   = aws_ssm_parameter.ultron_jwt_email_secret.arn
    ultron_postgres_url       = aws_ssm_parameter.ultron_postgres_url.arn
    ultron_postgres_password  = aws_ssm_parameter.ultron_postgres_password.arn
    aws_ses_smtp_username     = aws_ssm_parameter.aws_ses_smtp_username.arn
    aws_ses_smtp_password     = aws_ssm_parameter.aws_ses_smtp_password.arn
  }
}
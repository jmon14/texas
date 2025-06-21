# IAM role for EC2 to access AWS services
resource "aws_iam_role" "ec2_service_role" {
  name = "texas-ec2-service-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

# IAM instance profile
resource "aws_iam_instance_profile" "ec2_service_profile" {
  name = "texas-ec2-service-profile"
  role = aws_iam_role.ec2_service_role.name
} 
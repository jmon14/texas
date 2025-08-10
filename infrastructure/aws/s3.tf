# IAM policy for S3 access
resource "aws_iam_policy" "s3_access" {
  name        = "TexasS3Access"
  description = "Policy to allow access to S3 bucket"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          "arn:aws:s3:::${var.aws_public_bucket_name}",
          "arn:aws:s3:::${var.aws_public_bucket_name}/*"
        ]
      }
    ]
  })
}

# Attach the S3 policy to the instance role
resource "aws_iam_role_policy_attachment" "s3_access" {
  role       = aws_iam_role.ec2_service_role.name
  policy_arn = aws_iam_policy.s3_access.arn
}

resource "aws_s3_bucket" "files" {
  bucket = var.aws_public_bucket_name

  tags = {
    Name      = "texas-files"
    Project   = "texas"
    ManagedBy = "terraform"
  }
}

# S3 bucket public access block
resource "aws_s3_bucket_public_access_block" "files" {
  bucket = aws_s3_bucket.files.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# S3 bucket CORS configuration
resource "aws_s3_bucket_cors_configuration" "files" {
  bucket = aws_s3_bucket.files.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "DELETE"]
    allowed_origins = ["https://allinrange.com", "https://www.allinrange.com"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

# S3 bucket policy
resource "aws_s3_bucket_policy" "files" {
  bucket     = aws_s3_bucket.files.id
  depends_on = [aws_s3_bucket_public_access_block.files]

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.files.arn}/*"
      }
    ]
  })
}
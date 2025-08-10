# ECR Repositories for Docker images
resource "aws_ecr_repository" "ultron" {
  name = "texas-ultron"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name        = "texas-ultron"
    Environment = "production"
    Project     = "texas"
    ManagedBy   = "terraform"
  }
}

resource "aws_ecr_repository" "vision" {
  name = "texas-vision"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name        = "texas-vision"
    Environment = "production"
    Project     = "texas"
    ManagedBy   = "terraform"
  }
}

resource "aws_ecr_repository" "quickview" {
  name = "texas-quickview"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name        = "texas-quickview"
    Environment = "production"
    Project     = "texas"
    ManagedBy   = "terraform"
  }
} 
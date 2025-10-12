# ECR Repositories for Docker images
resource "aws_ecr_repository" "backend" {
  name = "texas-backend"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name        = "texas-backend"
    Environment = "production"
    Project     = "texas"
    ManagedBy   = "terraform"
  }
}

resource "aws_ecr_repository" "frontend" {
  name = "texas-frontend"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name        = "texas-frontend"
    Environment = "production"
    Project     = "texas"
    ManagedBy   = "terraform"
  }
} 
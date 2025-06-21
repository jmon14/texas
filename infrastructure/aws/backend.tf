terraform {
  backend "s3" {
    bucket         = "texas-terraform-state"
    key            = "terraform.tfstate"
    region         = var.aws_region
    encrypt        = true
  }
} 
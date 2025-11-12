terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.19.0" # Use a recent version
    }
  }
}

provider "aws" {
  region = var.aws_region
}
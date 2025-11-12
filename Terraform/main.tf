##############################################
# AWS INFRASTRUCTURE - VARTA PROJECT
# EC2 + RDS + S3
##############################################

# -------------------------
# EC2: App Server (React/Node)
# -------------------------
resource "aws_instance" "app_server" {
  ami               = var.app_server_ami
  instance_type     = var.instance_type
  key_name          = var.key_name
  security_groups   = [aws_security_group.app_server_sg.name]

  tags = {
    Name = "App-Server (React-Node)"
  }
}

# -------------------------
# EC2: Management Server (Puppet/Nagios)
# -------------------------
resource "aws_instance" "mgmt_server" {
  ami               = var.mgmt_server_ami
  instance_type     = var.instance_type
  key_name          = var.key_name
  security_groups   = [aws_security_group.mgmt_server_sg.name]

  tags = {
    Name = "Mgmt-Server (Puppet-Nagios)"
  }
}

# -------------------------
# RDS: MySQL Database
# -------------------------
resource "aws_db_instance" "varta_db" {
  identifier             = "varta-mysql-db"
  allocated_storage      = 20
  engine                 = "mysql"
  engine_version         = "8.0"
  instance_class         = "db.t3.micro"
  db_name                = "varta_db"
  username               = var.db_username
  password               = var.db_password
  vpc_security_group_ids = [aws_security_group.rds_database_sg.id]

  skip_final_snapshot    = true 
  publicly_accessible    = true

  tags = {
    Name = "Varta-MySQL-DB"
  }
}

# -------------------------
# S3: Storage Bucket for Images
# -------------------------
resource "aws_s3_bucket" "varta_bucket" {
  bucket = "varta-testing-db-bucket"
  force_destroy = false  # Prevent accidental deletion with data loss

  tags = {
    Name = "Varta-Image-Bucket"
  }
}

# Public Access Settings (allow read access to uploaded files)
resource "aws_s3_bucket_public_access_block" "varta_bucket_public_access" {
  bucket                  = aws_s3_bucket.varta_bucket.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# Bucket Policy for Public Read (optional for image links)
resource "aws_s3_bucket_policy" "varta_bucket_policy" {
  bucket = aws_s3_bucket.varta_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.varta_bucket.arn}/*"
      }
    ]
  })
}

# -------------------------
# OUTPUTS
# -------------------------
output "app_server_public_ip" {
  description = "Public IP of the App Server"
  value       = aws_instance.app_server.public_ip
}

output "mgmt_server_public_ip" {
  description = "Public IP of the Management Server"
  value       = aws_instance.mgmt_server.public_ip
}

output "rds_endpoint" {
  description = "RDS Endpoint"
  value       = aws_db_instance.varta_db.address
}

output "s3_bucket_name" {
  description = "S3 Bucket Name"
  value       = aws_s3_bucket.varta_bucket.bucket
}

output "s3_bucket_url" {
  description = "Public URL base for uploaded images"
  value       = "https://${aws_s3_bucket.varta_bucket.bucket}.s3.${var.aws_region}.amazonaws.com"
}
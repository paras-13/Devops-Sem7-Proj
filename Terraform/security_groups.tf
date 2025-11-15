###############################################
# APP SERVER SECURITY GROUP (Fully Open)
###############################################

resource "aws_security_group" "app_server_sg" {
  name = "app-server-sg"

  # Prevent Terraform from destroying it (EC2 uses it)
  lifecycle {
    prevent_destroy = true
  }

  # Allow ALL inbound traffic (for your project/demo)
  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow ALL outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { 
    Name = "App-Server-SG" 
  }
}

###############################################
# MGMT SERVER (Nagios) SECURITY GROUP
###############################################

resource "aws_security_group" "mgmt_server_sg" {
  name = "mgmt-server-sg"

  # Prevent Terraform from destroying it (EC2 uses it)
  lifecycle {
    prevent_destroy = true
  }

  # Allow ALL inbound traffic
  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow ALL outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { 
    Name = "Mgmt-Server-SG" 
  }
}

###############################################
# RDS DATABASE SECURITY GROUP
###############################################

resource "aws_security_group" "rds_database_sg" {
  name = "rds-database-sg"

  # Allow Terraform to replace it safely if needed
  lifecycle {
    create_before_destroy = true
  }

  # Allow MySQL traffic only from App Server
  ingress {
    description     = "Allow MySQL from App Server"
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.app_server_sg.id]
  }

  # Allow outbound
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { 
    Name = "RDS-Database-SG" 
  }
}

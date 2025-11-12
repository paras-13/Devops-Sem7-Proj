data "http" "myip" {
  url = "http://ipv4.icanhazip.com"
}
resource "aws_security_group" "app_server_sg" {
  name        = "app-server-sg"
  description = "Allows traffic for the main application"

  ingress {
    description = "HTTP access for users"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "SSH access for you and Ansible"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["${chomp(data.http.myip.response_body)}/32"]
  }

  # Puppet + Nagios allowed from mgmt server's private IP range (10.0.0.0/16)
  ingress {
    description = "Puppet + Nagios access from management subnet"
    from_port   = 5666
    to_port     = 8140
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "App-Server-SG" }
}


resource "aws_security_group" "mgmt_server_sg" {
  name        = "mgmt-server-sg"
  description = "Allows traffic for management tools"

  ingress {
    description = "SSH access for you"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["${chomp(data.http.myip.response_body)}/32"]
  }

  ingress {
    description = "Nagios Web UI"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["${chomp(data.http.myip.response_body)}/32"]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "Mgmt-Server-SG" }
}

resource "aws_security_group" "rds_database_sg" {
  name        = "rds-database-sg"
  description = "Allows MySQL traffic only from the App Server"

  ingress {
    description = "Allow MySQL from App Server"
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    security_groups = [aws_security_group.app_server_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "RDS-Database-SG" }
}


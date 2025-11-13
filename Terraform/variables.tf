variable "aws_region" {
  description = "The AWS region to deploy in."
  type        = string
  default     = "ap-south-1"
}

variable "app_server_ami" {
  description = "AMI for the App Server"
  type        = string
  default     = "ami-087d1c9a513324697"
}

variable "mgmt_server_ami" {
  description = "AMI for the Management Server"
  type        = string
  default     = "ami-087d1c9a513324697" 
}

variable "instance_type" {
  description = "EC2 instance type for servers"
  type        = string
  default     = "t3.micro"
}

variable "key_name" {
  description = "Name of your AWS EC2 Key Pair for SSH"
  type        = string
}

variable "db_password" {
  description = "Password for the RDS database"
  type        = string
  sensitive   = true
}

variable "db_username" {
  description = "Username for the RDS database"
  type        = string
  default     = "admin"
}
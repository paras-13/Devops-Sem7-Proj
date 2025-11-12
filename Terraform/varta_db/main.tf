provider "aws" {
    region = "ap-south-1"
}

resource "aws_db_instance" "varta_db" {
    identifier = "varta-mysql-db"
    allocated_storage = 20
    engine = "mysql"
    engine_version = "8.0"
    instance_class = "db.t3.micro"
    username = "admin"
    password = "admin123"
    db_name = "varta_db"
    publicly_accessible = true
    skip_final_snapshot = true
    tags = {
        Name = "VARTA-MYSQL-RDS"
    }
}

output "rds_endpoint" {
    value = aws_db_instance.varta_db.address
}
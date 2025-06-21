output "instance_id" {
  value       = aws_instance.texas_server.id
  description = "The ID of the EC2 instance"
}

// ... existing outputs ... 
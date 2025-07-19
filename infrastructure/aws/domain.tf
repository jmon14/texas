# Route53 Hosted Zone for allinrange.com
resource "aws_route53_zone" "main" {
  name = "allinrange.com"
}

# A record for the root domain pointing to your EC2 instance
resource "aws_route53_record" "root" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "allinrange.com"
  type    = "A"
  ttl     = "300"
  records = [aws_eip.texas_eip.public_ip]
}

# A record for www subdomain
resource "aws_route53_record" "www" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "www.allinrange.com"
  type    = "A"
  ttl     = "300"
  records = [aws_eip.texas_eip.public_ip]
}

# Output the nameservers
output "nameservers" {
  description = "Nameservers for the domain"
  value       = aws_route53_zone.main.name_servers
} 
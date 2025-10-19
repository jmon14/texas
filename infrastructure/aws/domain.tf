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

# ImprovMX Email Forwarding Configuration
# MX records for email forwarding via ImprovMX
resource "aws_route53_record" "mx1" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "allinrange.com"
  type    = "MX"
  ttl     = "3600"
  records = [
    "10 mx1.improvmx.com",
    "20 mx2.improvmx.com"
  ]
}

# SPF record to allow ImprovMX to send emails on behalf of the domain
resource "aws_route53_record" "spf" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "allinrange.com"
  type    = "TXT"
  ttl     = "3600"
  records = ["v=spf1 include:spf.improvmx.com ~all"]
}

# Output the nameservers
output "nameservers" {
  description = "Nameservers for the domain"
  value       = aws_route53_zone.main.name_servers
} 
output "api_endpoint" {
  description = "The URI of the API"
  value       = aws_apigatewayv2_api.this.api_endpoint
}

output "api_id" {
  description = "The API ID"
  value       = aws_apigatewayv2_api.this.id
}

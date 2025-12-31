output "s3_bucket_name" {
  description = "Name of the S3 bucket"
  value       = module.s3.bucket_name
}

output "sqs_queue_url" {
  description = "URL of the SQS queue"
  value       = module.sqs.queue_url
}

output "sqs_queue_arn" {
  description = "ARN of the SQS queue"
  value       = module.sqs.queue_arn
}

output "event_rule_arn" {
  description = "ARN of the EventBridge rule"
  value       = module.eventbridge.rule_arn
}

output "translate_function_name" {
  description = "Name of the Translate Lambda function"
  value       = module.lambda_translate.function_name
}

output "ivs_channel_arn" {
  description = "ARN of the IVS channel"
  value       = module.ivs.channel_arn
}

output "ivs_channel_playback_url" {
  description = "Playback URL of the IVS channel"
  value       = module.ivs.channel_playback_url
}

output "ivs_ingest_endpoint" {
  description = "Ingest endpoint of the IVS channel"
  value       = module.ivs.channel_ingest_endpoint
}

output "ses_api_endpoint" {
  description = "URL of the SES Email API"
  value       = module.api_gateway.api_endpoint
}

variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "env" {
  description = "Deployment environment"
  type        = string
  default     = "dev"
}

# variable "ami_id" {
#   description = "AMI ID for the EC2 instance"
#   type        = string
# }

variable "twillio_api_key" {
  description = "Twillio API Key"
  type        = string
  sensitive   = true
  default     = "this_default_key_twillio_test_123"
}

variable "s3_bucket_name" {
  description = "Base name for the S3 bucket (lowercase, globally unique when combined with env)"
  type        = string
  default     = "myapp-bucket"
}

variable "sqs_queue_name" {
  description = "Base name for the SQS queue"
  type        = string
  default     = "myapp-events"
}

variable "event_rule_name" {
  description = "Base name for the EventBridge rule"
  type        = string
  default     = "myapp-events-rule"
}

variable "event_bus_name" {
  description = "EventBridge bus name"
  type        = string
  default     = "default"
}

variable "event_pattern" {
  description = "EventBridge event pattern (object will be jsonencoded)"
  type        = any
  default = {
    source = ["myapp"]
  }
}

variable "ses_email" {
  description = "Email address to verify in SES and send emails from. You must have access to this email to click the verification link."
  type        = string
  default     = "yogawicaksono20@gmail.com"
}


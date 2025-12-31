variable "env" {
  description = "Deployment environment"
  type        = string
}

variable "ses_email" {
  description = "Email address to verify in SES and send emails from"
  type        = string
}

variable "function_name" {
  description = "Name of the Lambda function"
  type        = string
  default     = "ses-email-sender"
}

variable "notification_email" {
  description = "Email address to receive SES notifications (Bounce, Complaint, Delivery)"
  type        = string
  default     = null
}

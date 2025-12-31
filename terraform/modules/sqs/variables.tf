variable "queue_name" {
  description = "SQS queue name"
  type        = string
}

variable "env" {
  description = "Environment tag"
  type        = string
}

variable "attach_eventbridge_policy" {
  description = "Attach least-privilege policy to allow EventBridge to send messages"
  type        = bool
  default     = false
}

variable "rule_name" {
  description = "EventBridge rule name to permit sending messages"
  type        = string
  default     = null
}

variable "source_account_id" {
  description = "AWS account ID for source policy condition"
  type        = string
  default     = null
}

variable "event_bus_name" {
  description = "EventBridge bus name"
  type        = string
  default     = "default"
}

variable "eventbridge_rule_arn" {
  description = "EventBridge rule ARN allowed to send messages"
  type        = string
  default     = null
}

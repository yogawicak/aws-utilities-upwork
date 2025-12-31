variable "rule_name" {
  description = "EventBridge rule name"
  type        = string
}

variable "event_bus_name" {
  description = "EventBridge bus name"
  type        = string
  default     = "default"
}

variable "event_pattern" {
  description = "EventBridge event pattern"
  type        = any
}

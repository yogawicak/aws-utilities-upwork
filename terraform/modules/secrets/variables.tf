variable "secret_name" {
  description = "The name of the secret"
  type        = string
}

variable "secret_value" {
  description = "The value of the secret"
  type        = string
  sensitive   = true
}

variable "env" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

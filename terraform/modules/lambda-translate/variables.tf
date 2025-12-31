variable "function_name" {
  description = "Name of the Lambda function"
  type        = string
}

variable "env" {
  description = "Deployment environment"
  type        = string
}

variable "environment_variables" {
  description = "Environment variables for the Lambda function"
  type        = map(string)
  default     = {}
}

variable "env" {
  description = "Deployment environment"
  type        = string
}

variable "lambda_arn" {
  description = "ARN of the Lambda function to integrate with"
  type        = string
}

variable "lambda_function_name" {
  description = "Name of the Lambda function to integrate with"
  type        = string
}

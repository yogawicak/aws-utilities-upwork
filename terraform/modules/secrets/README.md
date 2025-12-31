# Secrets Module

This module creates a secret in AWS Secrets Manager.

## Inputs
| Name | Description | Type | Default |
|------|-------------|------|---------|
| secret_name | Name of the secret | string | - |
| secret_value | Value of the secret | string | - |
| env | Environment | string | dev |

## Outputs
| Name | Description |
|------|-------------|
| secret_arn | ARN of the secret |
| secret_name | Name of the secret |

# Terraform Infrastructure Project

## 1. Overview & Purpose
This project defines best practices and standards for structuring, maintaining, and deploying Terraform infrastructure as code across development, staging, and production environments.

## 2. Directory Structure
```bash
project/
├── modules/               # Reusable modules (e.g., VPC, EC2)
├── environments/          # Separate envs (optional)
├── main.tf                # Entry point
├── variables.tf           # Input variables
├── outputs.tf             # Output variables
├── provider.tf            # Provider setup
├── terraform.tfvars       # Variable values (DO NOT COMMIT)
├── backend.tf             # Remote state
├── versions.tf            # Version constraints
└── README.md              # Project description
```

## 3. Usage
Initialize Terraform:
```bash
terraform init
```

Plan infrastructure:
```bash
terraform plan
```

Apply changes:
```bash
terraform apply
```

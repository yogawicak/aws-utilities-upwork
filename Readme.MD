# AWS Utilities Upwork

This repository contains a collection of AWS utilities and infrastructure configurations, organized into Terraform modules and a Node.js codebase for testing and interaction.

## Directory Structure

- `terraform/`: Infrastructure as Code (IaC) to provision AWS resources.
- `codebase/`: Node.js scripts and tests to interact with the deployed AWS services.

## Infrastructure (Terraform)

The `terraform/` directory defines the AWS infrastructure using modules. Key resources include:

- **VPC**: Networking foundation.
- **Secrets Manager**: Stores sensitive configuration (e.g., Twilio API keys).
- **S3**: Scalable storage buckets.
- **EventBridge & SQS**: Event-driven architecture setup with Event Bus and Queues.
- **IVS (Interactive Video Service)**: Live streaming channel setup.
- **Lambda Functions**:
  - `lambda-translate`: Wraps AWS Translate for text translation.
  - `ses-api`: Sends emails via Amazon SES.
- **API Gateway**: Exposes the SES email function as an HTTP API.

### Prerequisites
- [Terraform](https://www.terraform.io/) installed.
- AWS Credentials configured.

### Usage
1. Navigate to the `terraform/` directory:
   ```sh
   cd terraform
   ```
2. Initialize Terraform:
   ```sh
   terraform init
   ```
3. Plan and Apply:
   ```sh
   terraform plan
   terraform apply
   ```

## Codebase

The `codebase/` directory contains Node.js scripts, primarily used for testing and verifying the deployed infrastructure.

### Dependencies
- AWS SDK for JavaScript (v3)
- `dotenv` for environment variables
- `adm-zip` for zip operations

### Setup
1. Navigate to the `codebase/` directory:
   ```sh
   cd codebase
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the `codebase/` directory. You can use the following template:
   ```env
   AWS_REGION=us-east-1
   AWS_PROFILE=myapp-dev
   AWS_ACCESS_KEY_ID=your_access_key_id
   AWS_SECRET_ACCESS_KEY=your_secret_access_key
   SES_EMAIL=your_ses_email
   ```
4. Run tests/scripts (located in `test/` directory).

resource "aws_ses_email_identity" "this" {
  email = var.ses_email
}

# SNS Topic for SES Notifications
resource "aws_sns_topic" "ses_notifications" {
  name = "ses-notifications-${var.env}"
}

# Subscribe email to SNS Topic
resource "aws_sns_topic_subscription" "email_subscription" {
  count     = var.notification_email != null ? 1 : 0
  topic_arn = aws_sns_topic.ses_notifications.arn
  protocol  = "email"
  endpoint  = var.notification_email
}

# Configure SES to send notifications to SNS
resource "aws_ses_identity_notification_topic" "bounce" {
  topic_arn                = aws_sns_topic.ses_notifications.arn
  notification_type        = "Bounce"
  identity                 = aws_ses_email_identity.this.email
  include_original_headers = true
}

resource "aws_ses_identity_notification_topic" "complaint" {
  topic_arn                = aws_sns_topic.ses_notifications.arn
  notification_type        = "Complaint"
  identity                 = aws_ses_email_identity.this.email
  include_original_headers = true
}

resource "aws_ses_identity_notification_topic" "delivery" {
  topic_arn                = aws_sns_topic.ses_notifications.arn
  notification_type        = "Delivery"
  identity                 = aws_ses_email_identity.this.email
  include_original_headers = true
}

data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/src"
  output_path = "${path.module}/lambda_function.zip"
}

resource "aws_lambda_function" "this" {
  filename         = data.archive_file.lambda_zip.output_path
  function_name    = "${var.function_name}-${var.env}"
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.handler"
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  runtime          = "nodejs18.x"
  timeout          = 10

  environment {
    variables = {
      SES_EMAIL = var.ses_email
    }
  }
}

resource "aws_iam_role" "lambda_role" {
  name = "${var.function_name}-${var.env}-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "ses_policy" {
  name = "${var.function_name}-${var.env}-policy"
  role = aws_iam_role.lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ses:SendEmail",
          "ses:SendRawEmail"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

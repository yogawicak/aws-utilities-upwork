resource "aws_sqs_queue" "this" {
  name                    = var.queue_name
  sqs_managed_sse_enabled = true

  tags = {
    Name        = var.queue_name
    Environment = var.env
  }
}

data "aws_iam_policy_document" "from_eventbridge" {
  count = var.attach_eventbridge_policy ? 1 : 0

  statement {
    sid    = "AllowEventBridgeSendMessage"
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["events.amazonaws.com"]
    }

    actions   = ["sqs:SendMessage"]
    resources = [aws_sqs_queue.this.arn]

    condition {
      test     = "StringEquals"
      variable = "aws:SourceAccount"
      values   = [var.source_account_id]
    }

    condition {
      test     = "ArnEquals"
      variable = "aws:SourceArn"
      values   = [var.eventbridge_rule_arn]
    }
  }
}

resource "aws_sqs_queue_policy" "this" {
  count     = var.attach_eventbridge_policy ? 1 : 0
  queue_url = aws_sqs_queue.this.id
  policy    = data.aws_iam_policy_document.from_eventbridge[0].json
}

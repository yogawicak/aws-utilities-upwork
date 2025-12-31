module "vpc" {
  source         = "./modules/vpc"
  vpc_cidr_block = "10.0.0.0/16"
}

module "twillio_secret" {
  source       = "./modules/secrets"
  secret_value = var.twillio_api_key
  secret_name  = "myapp-dev/stage/express/twillio"
}

data "aws_caller_identity" "current" {}

module "s3" {
  source      = "./modules/s3"
  bucket_name = "${var.s3_bucket_name}-${var.env}-${data.aws_caller_identity.current.account_id}-${var.aws_region}"
  env         = var.env
}

module "eventbridge" {
  source         = "./modules/eventbridge"
  rule_name      = "${var.event_rule_name}-${var.env}"
  event_bus_name = var.event_bus_name
  event_pattern  = var.event_pattern
}

module "sqs" {
  source                    = "./modules/sqs"
  queue_name                = "${var.sqs_queue_name}-${var.env}"
  env                       = var.env
  attach_eventbridge_policy = true
  eventbridge_rule_arn      = module.eventbridge.rule_arn
  source_account_id         = data.aws_caller_identity.current.account_id
}

resource "aws_cloudwatch_event_target" "sqs" {
  rule           = module.eventbridge.rule_name
  event_bus_name = var.event_bus_name
  arn            = module.sqs.queue_arn
}

module "ivs" {
  source       = "./modules/ivs"
  channel_name = "myapp-ivs-${var.env}"
  env          = var.env
}

module "lambda_translate" {
  source        = "./modules/lambda-translate"
  function_name = "myapp-translate-function-${var.env}"
  env           = var.env
  environment_variables = {
    ENV = var.env
  }
}

module "ses_api" {
  source             = "./modules/ses-api"
  env                = var.env
  ses_email          = var.ses_email
  notification_email = var.ses_email
}

module "api_gateway" {
  source               = "./modules/api-gateway"
  env                  = var.env
  lambda_arn           = module.ses_api.lambda_arn
  lambda_function_name = module.ses_api.lambda_function_name
}

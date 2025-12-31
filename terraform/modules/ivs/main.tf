resource "aws_ivs_channel" "this" {
  name = var.channel_name
  type = var.type

  tags = {
    Environment = var.env
  }
}

resource "aws_ivs_recording_configuration" "this" {
  count = var.create_recording_config ? 1 : 0

  name = "${var.channel_name}-recording-config"
  destination_configuration {
    s3 {
      bucket_name = var.recording_bucket_name
    }
  }

  tags = {
    Environment = var.env
  }
}

output "channel_arn" {
  description = "ARN of the IVS channel"
  value       = aws_ivs_channel.this.arn
}

output "channel_playback_url" {
  description = "Playback URL of the IVS channel"
  value       = aws_ivs_channel.this.playback_url
}

output "channel_ingest_endpoint" {
  description = "Ingest endpoint of the IVS channel"
  value       = aws_ivs_channel.this.ingest_endpoint
}

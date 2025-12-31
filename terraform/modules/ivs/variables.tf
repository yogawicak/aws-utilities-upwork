variable "channel_name" {
  description = "Name of the IVS channel"
  type        = string
}

variable "type" {
  description = "Channel type, which determines the allowable resolution and bitrate (STANDARD or BASIC)"
  type        = string
  default     = "STANDARD"
}

variable "env" {
  description = "Deployment environment"
  type        = string
}

variable "create_recording_config" {
  description = "Whether to create a recording configuration"
  type        = bool
  default     = false
}

variable "recording_bucket_name" {
  description = "S3 bucket name for recording configuration (required if create_recording_config is true)"
  type        = string
  default     = ""
}

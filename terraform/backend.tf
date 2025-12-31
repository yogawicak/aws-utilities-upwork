terraform {
  backend "s3" {
    bucket         = "mycompany-my-state-tf"
    key            = "terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    use_lockfile   = false
  }
}

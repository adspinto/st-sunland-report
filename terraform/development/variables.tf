#variables file is only for declaration, for actual value use tfvars

variable "bucket_name" {
  type = string
}

variable "aws_region" {
  type = string
}

variable "get_guild_history_role" {
  type = string
}

variable "create_guild_backup_role" {
  type = string
}


variable "st_report_api" {
  type = string
}

variable "environment" {
  type = string
}


variable "guilds" {
  type        = list(string)
  description = "List of guild ids"
}

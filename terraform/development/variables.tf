variable "guild_id" {
  type    = string
  default = "60d09216ce4acb13323a1109" // change this field to create a table with this name
}

variable "guild_name" {
  type    = string
  default = "phoenix" // change this field to have the table name in the tag
}

variable "bucket_name" {
  type    = string
  default = "history-st" // change this field to have the table name in the tag
}

variable "reports_bucket_tag" {
  type    = string
  default = "history-st" // change this field to have the table name in the tag
}


variable "aws_region" {
  type    = string
  default = "us-east-2" // change this field to have the table name in the tag
}

variable "env" {
  type    = string
  default = "Production" // change this field to have the table name in the tag
}


variable "get_guild_history_role" {
  type    = string
  default = "arn:aws:iam::410741923613:role/service-role/GetGuildHistory-role-by14d7c1" // change this field to have the table name in the tag
   
                    
}

variable "create_guild_backup_role" {
  type    = string
  default = "arn:aws:iam::410741923613:role/service-role/CreateWeeklyBackup-role-h59b5hyr" // change this field to have the table name in the tag
}


variable "st_report_api" {
  type    = string
  default = "st-report-api"
}

variable "environment" {
  type    = string
  default = "dev"
}


variable "guilds" {
  type        = list(string)
  description = "List of guild ids"
  default = [
    "6282e355ddc01812f52e04f3",
    "60d09216ce4acb13323a1109"
  ]
}
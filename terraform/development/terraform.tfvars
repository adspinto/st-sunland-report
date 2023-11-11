

bucket_name              = "history-st"
aws_region               = "us-east-2"
get_guild_history_role   = "arn:aws:iam::410741923613:role/service-role/GetGuildHistory-role-by14d7c1"
create_guild_backup_role = "arn:aws:iam::410741923613:role/service-role/CreateWeeklyBackup-role-h59b5hyr"
update_weekly_report     = "arn:aws:iam::410741923613:role/service-role/UpdateWeeklyReport-role-v4got3oq"
st_report_api            = "st-report-api"
environment              = "dev"
guilds = [
  "6282e355ddc01812f52e04f3",
  "60d09216ce4acb13323a1109"
]

lambdas = [
  {
    name = "UpdateWeeklyReport"
    action = [
      "s3:PutObject",
      "s3:GetObject",
      "s3:ListBucket",
      "s3:DeleteObject"
    ]
  },
  {
    name = "GetGuild"
    action = [
      "s3:GetObject",
      "s3:ListBucket",
    ]
  },

]

# "GetGuild",
#   "GetGuildHistory",
#   "GetGuildHistoryObject"

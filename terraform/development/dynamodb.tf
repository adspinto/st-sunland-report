resource "aws_dynamodb_table" "create-guild-table" {
  lifecycle {
    prevent_destroy = true
  }

  name           = var.guild_id
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "playerId"
  range_key      = "playerName"

  attribute {
    name = "playerId"
    type = "S"
  }

  attribute {
    name = "playerName"
    type = "S"
  }

  tags = {
    guildName    = var.guild_name
  }
}
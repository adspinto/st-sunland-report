resource "aws_dynamodb_table" "create_guild_table" {

  lifecycle {
    prevent_destroy = true
  }
  for_each       = toset(var.guilds) 
  name           = "${var.environment}-${each.value}"
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
    guildName = "${var.environment}-${each.value}"
  }
}

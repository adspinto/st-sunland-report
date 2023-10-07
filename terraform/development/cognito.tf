resource "aws_cognito_user_pool" "st_report_users" {
  name = "${var.environment}-st-users"

  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]
  deletion_protection      = "ACTIVE"

  password_policy {
    minimum_length    = 6
    require_lowercase = true
    require_uppercase = true
    require_symbols   = false
    require_numbers   = false
  }

  #    verification_message_template {
  #     default_email_option = "CONFIRM_WITH_CODE"
  #     email_subject        = "Account Confirmation"
  #     email_message        = file("../code/templates/code_verification_email.html")
  #   }

  #   email_configuration {
  #     email_sending_account  = "DEVELOPER"
  #     reply_to_email_address = var.email_domain
  #     source_arn             = var.src_arn
  #   }
  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    name                     = "email"
    required                 = true

    string_attribute_constraints {
      min_length = 1
      max_length = 256
    }
  }

  schema {
    name                     = "guildId"
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    required                 = false
    string_attribute_constraints {}
  }

  schema {
    name                     = "guildName"
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    required                 = false
    string_attribute_constraints {}
  }

  lifecycle {
    prevent_destroy = true
  }

}

resource "aws_cognito_user_pool_client" "client" {
  name = "${var.environment}-cognito-client"

  user_pool_id                  = aws_cognito_user_pool.st_report_users.id
  generate_secret               = false
  refresh_token_validity        = 90
  prevent_user_existence_errors = "ENABLED"
  explicit_auth_flows = [
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_ADMIN_USER_PASSWORD_AUTH"
  ]
  allowed_oauth_flows_user_pool_client = true
  callback_urls                        = ["http://localhost:3000/"]
  logout_urls                          = ["http://localhost:3000/"]
  allowed_oauth_flows                  = ["code", "implicit"] #, "client_credentials"]
  allowed_oauth_scopes                 = ["email", "openid", "profile"]
  supported_identity_providers         = ["COGNITO"]
}

resource "aws_cognito_user_pool_domain" "cognito-domain" {
  domain       = "${var.environment}-report-st"
  user_pool_id = aws_cognito_user_pool.st_report_users.id
}

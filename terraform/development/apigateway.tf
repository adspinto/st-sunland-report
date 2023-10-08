resource "aws_api_gateway_rest_api" "st_report_api" {
  name        = "${var.environment}-st-report-api"
  description = "A reports shoptitans API"
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

output "st_report_api_id" {
  value = aws_api_gateway_rest_api.st_report_api.id
}

data "aws_api_gateway_rest_api" "st_report_api" {
  name = "${var.environment}-st-report-api"
}


resource "random_string" "deploy_value" {
  keepers = {
    first = "${timestamp()}"
  }
  length = 8
}

resource "aws_api_gateway_deployment" "st_report_api" {
  rest_api_id       = aws_api_gateway_rest_api.st_report_api.id
  stage_description = random_string.deploy_value.result

  depends_on = [
    random_string.deploy_value
  ]

  lifecycle {
    create_before_destroy = true
  }
}


resource "aws_api_gateway_stage" "st_report_api" {
  deployment_id        = aws_api_gateway_deployment.st_report_api.id
  rest_api_id          = aws_api_gateway_rest_api.st_report_api.id
  stage_name           = "${var.environment}-st-report-api"
  xray_tracing_enabled = true
}

##########################################
#   Authorizer                           #
##########################################

resource "aws_api_gateway_authorizer" "st_report_api_authorizer" {
  name          = "${var.environment}-st-report-api-authorizer"
  rest_api_id   = aws_api_gateway_rest_api.st_report_api.id
  type          = "COGNITO_USER_POOLS"
  provider_arns = ["${aws_cognito_user_pool.st_report_users.arn}"]
}

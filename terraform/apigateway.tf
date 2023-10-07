resource "aws_api_gateway_rest_api" "st_report_api" {
  name        = var.st_report_api
  description = "A reports shoptitans API"
}
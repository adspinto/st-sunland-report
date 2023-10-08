
data "archive_file" "update_weekly_report" {
  type        = "zip"
  source_dir  = "../../code/lambda/UpdateWeeklyReport"
  output_path = ".archive/UpdateWeeklyReport.zip"
}

resource "aws_iam_role" "create_available_lambdas" {
  for_each = toset(var.lambdas)
  name     = each.value
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_policy" "create_lambda_policies" {
  for_each = toset(var.lambdas)
  name     = each.name

  policy = <<EOF
  {
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ${jsonencode(each.action)}
      Resource = ["*"]
    }]
  }
  EOF
}


resource "aws_lambda_function" "example" {
  function_name    = "UpdateWeeklyReport"
  filename         = ".archive/UpdateWeeklyReport.zip"
  source_code_hash = filebase64sha256(".archive/UpdateWeeklyReport.zip")
  handler          = "index.handler"
  role             = var.update_weekly_report
  runtime          = "nodejs18.x"
}


data "archive_file" "zip_lambda" {
  for_each = {
    for index, lambda in var.lambdas :
    lambda.name => lambda # Perfect, since VM names also need to be unique
    # OR: index => vm (unique but not perfect, since index will change frequently)
    # OR: uuid() => vm (do NOT do this! gets recreated everytime)
  }
  type        = "zip"
  source_dir  = "../../code/lambda/${each.value.name}"
  output_path = ".archive/${each.value.name}.zip"
}

resource "aws_iam_role" "create_available_lambdas_role" {
  for_each = {
    for index, lambda in var.lambdas :
    lambda.name => lambda # Perfect, since VM names also need to be unique
    # OR: index => vm (unique but not perfect, since index will change frequently)
    # OR: uuid() => vm (do NOT do this! gets recreated everytime)
  }
  name = "${var.environment}-${each.value.name}"
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
  for_each = {
    for index, lambda in var.lambdas :
    lambda.name => lambda # Perfect, since VM names also need to be unique
    # OR: index => vm (unique but not perfect, since index will change frequently)
    # OR: uuid() => vm (do NOT do this! gets recreated everytime)
  }
  name = "${var.environment}-${each.value.name}"

  policy = jsonencode(
    {
      Version = "2012-10-17"
      Statement = [{
        Effect   = "Allow"
        Action   = jsonencode(each.value.action)
        Resource = ["*"]
      }]
    }
  )
}


resource "aws_lambda_function" "example" {
  for_each = {
    for index, lambda in var.lambdas :
    lambda.name => lambda # Perfect, since VM names also need to be unique
    # OR: index => vm (unique but not perfect, since index will change frequently)
    # OR: uuid() => vm (do NOT do this! gets recreated everytime)
  }
  function_name    = "${var.environment}-${each.value.name}"
  filename         = ".archive/${each.value.name}.zip"
  source_code_hash = filebase64sha256(".archive/${each.value.name}.zip")
  handler          = "index.handler"
  role             = var.update_weekly_report
  runtime          = "nodejs18.x"
}

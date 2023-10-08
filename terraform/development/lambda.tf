
data "archive_file" "layerzip" {
  type        = "zip"
  source_dir  = "../../code/lambda/layer/nodejs"
  output_path = ".archive/nodejs.zip"
}

resource "aws_lambda_layer_version" "lambda_layer" {
  filename                  = ".archive/nodejs.zip"
  layer_name                = "nodejsLayer"
  source_code_hash          = filebase64sha256(".archive/nodejs.zip")
  compatible_runtimes       = ["nodejs14.x", "nodejs16.x", "nodejs18.x"]
}

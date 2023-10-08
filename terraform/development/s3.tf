
resource "aws_s3_bucket" "history_bucket" {
  bucket = "${var.environment}-${var.bucket_name}"
  lifecycle {
    prevent_destroy = true
  }
  tags = {
    Name        = "${var.environment}-${var.reports_bucket_tag}"
    Environment = var.env
  }
}

resource "aws_s3_object" "directory_structure" {

  for_each     = toset(var.guilds) // to set is used because regular array is not planned
  bucket       = aws_s3_bucket.history_bucket.id
  key          = "${each.value}/"
  content_type = "application/x-directory"
}


# Declare a template file that contains your S3 policy
data "template_file" "s3_policy" {
  template = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowRoleAccess",
            "Effect": "Allow",
            "Principal": {
                "AWS": [
                    "${var.get_guild_history_role}",
                    "${var.create_guild_backup_role}"
                ]
            },
            "Action": [
                "s3:ListBucket",
                "s3:PutObject",
                "s3:GetObject"
            ],
            "Resource": [
                "arn:aws:s3:::${aws_s3_bucket.history_bucket.id}",
                "arn:aws:s3:::${aws_s3_bucket.history_bucket.id}/*"
            ]
        }
    ]
}

EOF
}

resource "aws_s3_bucket_policy" "add_s3_bucket_policy" {
  bucket = aws_s3_bucket.history_bucket.id
  policy = data.template_file.s3_policy.rendered
}

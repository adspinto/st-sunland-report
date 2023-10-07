{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowLambdaAccess",
            "Effect": "Allow",
            "Principal": {
                "AWS": [
                    "arn:aws:iam::410741923613:role/service-role/GetGuildHistory-role-by14d7c1",
                    "arn:aws:iam::410741923613:role/service-role/CreateWeeklyBackup-role-h59b5hyr"
                ]
            },
            "Action": [
                "s3:ListBucket",
                "s3:PutObject",
                "s3:GetObject"
            ],
            "Resource": [
                "arn:aws:s3:::history-st",
                "arn:aws:s3:::history-st/*"
            ]
        }
    ]
}

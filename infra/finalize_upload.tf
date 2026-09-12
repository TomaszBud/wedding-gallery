data "aws_caller_identity" "current" {}


data "archive_file" "finalize_upload" {
  type = "zip"

  source_dir = "${path.module}/../backend/functions/finalize_upload/build"

  output_path = "${path.module}/finalize_upload.zip"
}


resource "aws_iam_role" "finalize_upload_lambda" {
  name = "wedding-gallery-finalize-upload-lambda"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"

    Statement = [{
      Effect = "Allow"

      Principal = {
        Service = "lambda.amazonaws.com"
      }

      Action = "sts:AssumeRole"
    }]
  })
}


resource "aws_iam_role_policy_attachment" "finalize_lambda_basic" {
  role = aws_iam_role.finalize_upload_lambda.name

  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}


resource "aws_iam_role_policy" "finalize_dynamodb" {
  name = "finalize-photo-metadata"
  role = aws_iam_role.finalize_upload_lambda.id

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [{
      Effect = "Allow"

      Action = [
        "dynamodb:UpdateItem"
      ]

      Resource = aws_dynamodb_table.photos.arn
    }]
  })
}


resource "aws_lambda_function" "finalize_upload" {
  function_name = "wedding-gallery-finalize-upload"

  filename = data.archive_file.finalize_upload.output_path

  source_code_hash = data.archive_file.finalize_upload.output_base64sha256

  role = aws_iam_role.finalize_upload_lambda.arn

  handler = "lambda_function.handler"
  runtime = "python3.13"

  architectures = [
    "x86_64"
  ]

  memory_size = 1536
  timeout     = 30

  environment {
    variables = {
      PHOTOS_TABLE  = aws_dynamodb_table.photos.name
      PHOTOS_BUCKET = aws_s3_bucket.photos.bucket
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.finalize_lambda_basic,
    aws_iam_role_policy.finalize_dynamodb,
    aws_iam_role_policy.finalize_s3
  ]
}

resource "aws_s3_bucket_notification" "photos" {
  bucket = aws_s3_bucket.photos.id

  lambda_function {
    lambda_function_arn = aws_lambda_function.finalize_upload.arn

    events = [
      "s3:ObjectCreated:*"
    ]

    filter_prefix = "uploads/"
  }

  depends_on = [
    aws_lambda_permission.allow_s3_finalize
  ]
}

resource "aws_iam_role_policy" "finalize_s3" {
  name = "process-wedding-images"

  role = aws_iam_role.finalize_upload_lambda.id

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Action = [
          "s3:GetObject"
        ]

        Resource = "${aws_s3_bucket.photos.arn}/uploads/*"
      },
      {
        Effect = "Allow"

        Action = [
          "s3:PutObject"
        ]

        Resource = [
          "${aws_s3_bucket.photos.arn}/processed/*",
          "${aws_s3_bucket.photos.arn}/thumbnails/*"
        ]
      }
    ]
  })
}
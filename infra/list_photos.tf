data "archive_file" "list_photos" {
  type = "zip"

  source_file = "${path.module}/../backend/functions/list_photos/lambda_function.py"

  output_path = "${path.module}/list_photos.zip"
}


resource "aws_iam_role" "list_photos_lambda" {
  name = "wedding-gallery-list-photos-lambda"

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


resource "aws_iam_role_policy_attachment" "list_photos_lambda_basic" {
  role = aws_iam_role.list_photos_lambda.name

  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}


resource "aws_iam_role_policy" "list_photos_dynamodb" {
  name = "list-photo-metadata"
  role = aws_iam_role.list_photos_lambda.id

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [{
      Effect = "Allow"

      Action = [
        "dynamodb:Query"
      ]

      Resource = [
        aws_dynamodb_table.photos.arn,
        "${aws_dynamodb_table.photos.arn}/index/status-created-at-index"
      ]
    }]
  })
}


resource "aws_iam_role_policy" "list_photos_s3" {
  name = "read-photos-from-s3"
  role = aws_iam_role.list_photos_lambda.id

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [{
      Effect = "Allow"

      Action = [
        "s3:GetObject"
      ]

      Resource = [
        "${aws_s3_bucket.photos.arn}/uploads/*",
        "${aws_s3_bucket.photos.arn}/processed/*",
        "${aws_s3_bucket.photos.arn}/thumbnails/*"
      ]
    }]
  })
}


resource "aws_lambda_function" "list_photos" {
  function_name = "wedding-gallery-list-photos"

  filename = data.archive_file.list_photos.output_path

  source_code_hash = data.archive_file.list_photos.output_base64sha256

  role = aws_iam_role.list_photos_lambda.arn

  handler = "lambda_function.handler"
  runtime = "python3.13"

  timeout = 5

  environment {
    variables = {
      PHOTOS_BUCKET = aws_s3_bucket.photos.bucket
      PHOTOS_TABLE  = aws_dynamodb_table.photos.name
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.list_photos_lambda_basic,
    aws_iam_role_policy.list_photos_dynamodb,
    aws_iam_role_policy.list_photos_s3
  ]
}
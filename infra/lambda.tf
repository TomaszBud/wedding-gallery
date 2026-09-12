data "archive_file" "create_upload_url" {
  type        = "zip"
  source_file = "${path.module}/../backend/functions/create_upload_url/lambda_function.py"
  output_path = "${path.module}/create_upload_url.zip"
}


resource "aws_iam_role" "upload_lambda" {
  name = "wedding-gallery-upload-lambda"

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


resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.upload_lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}


resource "aws_iam_role_policy" "upload_to_s3" {
  name = "upload-photos-to-s3"
  role = aws_iam_role.upload_lambda.id

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [{
      Effect = "Allow"

      Action = [
        "s3:PutObject"
      ]

      Resource = "${aws_s3_bucket.photos.arn}/uploads/*"
    }]
  })
}

resource "aws_iam_role_policy" "create_photo_metadata" {
  name = "create-photo-metadata"
  role = aws_iam_role.upload_lambda.id

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [{
      Effect = "Allow"

      Action = [
        "dynamodb:PutItem"
      ]

      Resource = aws_dynamodb_table.photos.arn
    }]
  })
}

resource "aws_lambda_function" "create_upload_url" {
  function_name = "wedding-gallery-create-upload"

  filename         = data.archive_file.create_upload_url.output_path
  source_code_hash = data.archive_file.create_upload_url.output_base64sha256

  role    = aws_iam_role.upload_lambda.arn
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
    aws_iam_role_policy_attachment.lambda_basic,
    aws_iam_role_policy.upload_to_s3,
    aws_iam_role_policy.create_photo_metadata
  ]
}
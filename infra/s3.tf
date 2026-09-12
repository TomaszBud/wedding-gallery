resource "random_id" "bucket_suffix" {
  byte_length = 4
}

resource "aws_s3_bucket" "photos" {
  bucket = "wedding-gallery-photos-${random_id.bucket_suffix.hex}"
}

resource "aws_s3_bucket_public_access_block" "photos" {
  bucket = aws_s3_bucket.photos.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "photos" {
  bucket = aws_s3_bucket.photos.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_cors_configuration" "photos" {
  bucket = aws_s3_bucket.photos.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = [
      "GET",
      "HEAD",
      "POST"
    ]

    # dev only, put gh pages later.
    allowed_origins = [
      "http://localhost:8000"
    ]

    expose_headers  = ["ETag"]
    max_age_seconds = 3600
  }
}

resource "aws_lambda_permission" "allow_s3_finalize" {
  statement_id = "AllowS3Invoke"

  action = "lambda:InvokeFunction"

  function_name = aws_lambda_function.finalize_upload.function_name

  principal = "s3.amazonaws.com"

  source_arn = aws_s3_bucket.photos.arn

  source_account = data.aws_caller_identity.current.account_id
}

output "photos_bucket_name" {
  value = aws_s3_bucket.photos.bucket
}
resource "aws_dynamodb_table" "photos" {
  name         = "wedding-gallery-photos"
  billing_mode = "PAY_PER_REQUEST"

  hash_key = "photo_id"

  attribute {
    name = "photo_id"
    type = "S"
  }

  attribute {
    name = "status"
    type = "S"
  }

  attribute {
    name = "created_at"
    type = "S"
  }

  global_secondary_index {
    name            = "status-created-at-index"
    hash_key        = "status"
    range_key       = "created_at"
    projection_type = "ALL"
  }

  ttl {
    attribute_name = "expires_at"
    enabled        = true
  }
}

output "photos_table_name" {
  value = aws_dynamodb_table.photos.name
}
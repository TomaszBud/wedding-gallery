resource "aws_apigatewayv2_api" "wedding" {
  name          = "wedding-gallery-api"
  protocol_type = "HTTP"

  cors_configuration {
    # dev only
    allow_origins = [
      "http://localhost:8000"
    ]

    allow_methods = [
      "GET",
      "POST",
      "OPTIONS"
    ]

    allow_headers = [
      "content-type"
    ]

    max_age = 3600
  }
}


resource "aws_apigatewayv2_integration" "create_upload_url" {
  api_id = aws_apigatewayv2_api.wedding.id

  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.create_upload_url.invoke_arn
  integration_method = "POST"

  payload_format_version = "2.0"
}


resource "aws_apigatewayv2_route" "create_upload_url" {
  api_id = aws_apigatewayv2_api.wedding.id

  route_key = "POST /uploads"

  target = "integrations/${aws_apigatewayv2_integration.create_upload_url.id}"
}


resource "aws_apigatewayv2_stage" "default" {
  api_id = aws_apigatewayv2_api.wedding.id

  name        = "$default"
  auto_deploy = true
}


resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowApiGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.create_upload_url.function_name

  principal = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.wedding.execution_arn}/*/*"
}

resource "aws_apigatewayv2_integration" "list_photos" {
  api_id = aws_apigatewayv2_api.wedding.id

  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.list_photos.invoke_arn
  integration_method = "POST"

  payload_format_version = "2.0"
}


resource "aws_apigatewayv2_route" "list_photos" {
  api_id = aws_apigatewayv2_api.wedding.id

  route_key = "GET /photos"

  target = "integrations/${aws_apigatewayv2_integration.list_photos.id}"
}


resource "aws_lambda_permission" "api_gateway_list_photos" {
  statement_id = "AllowApiGatewayListPhotos"

  action = "lambda:InvokeFunction"

  function_name = aws_lambda_function.list_photos.function_name

  principal = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.wedding.execution_arn}/*/*"
}

output "api_url" {
  value = aws_apigatewayv2_api.wedding.api_endpoint
}

import json
import os
from decimal import Decimal

import boto3
from boto3.dynamodb.conditions import Key
from botocore.config import Config


BUCKET_NAME = os.environ["PHOTOS_BUCKET"]
TABLE_NAME = os.environ["PHOTOS_TABLE"]

dynamodb = boto3.resource("dynamodb")
photos_table = dynamodb.Table(TABLE_NAME)

s3 = boto3.client(
    "s3",
    region_name=os.environ.get("AWS_REGION", "eu-central-1"),
    config=Config(
        signature_version="s3v4",
        s3={
            "addressing_style": "virtual",
        },
    ),
)

def json_default(value):
    if isinstance(value, Decimal):
        if value % 1 == 0:
            return int(value)

        return float(value)

    raise TypeError(
        f"Object of type {type(value).__name__} "
        f"is not JSON serializable"
    )

def response(status_code, body):
    return {
        "statusCode": status_code,
        "body": json.dumps(
            body,
            ensure_ascii=False,
            default=json_default,
        ),
    }


def handler(event, context):

    result = photos_table.query(
        IndexName="status-created-at-index",

        KeyConditionExpression=(
            Key("status").eq("READY")
        ),

        ScanIndexForward=False,

        Limit=50,
    )

    photos = []

    for item in result.get("Items", []):

        display_url = s3.generate_presigned_url(
            "get_object",
            Params={
                "Bucket": BUCKET_NAME,
                "Key": item["display_key"],
            },
            ExpiresIn=900,
        )

        thumbnail_url = s3.generate_presigned_url(
            "get_object",
            Params={
                "Bucket": BUCKET_NAME,
                "Key": item["thumbnail_key"],
            },
            ExpiresIn=900,
        )

        original_url = s3.generate_presigned_url(
            "get_object",
            Params={
                "Bucket": BUCKET_NAME,
                "Key": item["object_key"],
            },
            ExpiresIn=900,
        )

        photos.append({
            "photoId": item["photo_id"],
            "authorName": item.get(
                "author_name",
                "",
            ),
            "uploadedAt": item.get(
                "uploaded_at",
            ),
            "width": item.get(
                "width",
            ),
            "height": item.get(
                "height",
            ),
            "thumbnailUrl": thumbnail_url,
            "displayUrl": display_url,
            "originalUrl": original_url,
        })

    return response(
        200,
        {
            "photos": photos,
        },
    )
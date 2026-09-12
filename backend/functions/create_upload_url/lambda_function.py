import json
import os
import time
import uuid
from datetime import datetime, timezone

import boto3
from botocore.config import Config


BUCKET_NAME = os.environ["PHOTOS_BUCKET"]
TABLE_NAME = os.environ["PHOTOS_TABLE"]

MAX_FILE_SIZE = 20 * 1024 * 1024

ALLOWED_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/heic": ".heic",
    "image/heif": ".heif",
}


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

dynamodb = boto3.resource("dynamodb")
photos_table = dynamodb.Table(TABLE_NAME)


def response(status_code, body):
    return {
        "statusCode": status_code,
        "body": json.dumps(
            body,
            ensure_ascii=False,
        ),
    }


def handler(event, context):

    try:
        body = json.loads(event.get("body") or "{}")

    except json.JSONDecodeError:
        return response(
            400,
            {"error": "Invalid JSON"},
        )

    content_type = body.get("contentType")
    file_size = body.get("fileSize")

    original_filename = str(
        body.get("originalFilename") or ""
    ).strip()[:255]

    author_name = str(
        body.get("authorName") or ""
    ).strip()[:80]

    if content_type not in ALLOWED_TYPES:
        return response(
            400,
            {
                "error": "Unsupported file type",
                "allowedTypes": list(ALLOWED_TYPES.keys()),
            },
        )

    if not isinstance(file_size, int):
        return response(
            400,
            {"error": "fileSize is required"},
        )

    if file_size <= 0 or file_size > MAX_FILE_SIZE:
        return response(
            400,
            {"error": "Invalid file size"},
        )

    photo_id = uuid.uuid4().hex

    extension = ALLOWED_TYPES[content_type]

    object_key = f"uploads/{photo_id}{extension}"

    now = datetime.now(timezone.utc)

    created_at = now.isoformat()

    # Niedokończony upload zniknie po 24h.
    expires_at = int(time.time()) + 86400

    upload = s3.generate_presigned_post(
        Bucket=BUCKET_NAME,
        Key=object_key,
        Fields={
            "Content-Type": content_type,
        },
        Conditions=[
            {
                "Content-Type": content_type
            },
            [
                "content-length-range",
                1,
                MAX_FILE_SIZE,
            ],
        ],
        ExpiresIn=300,
    )

    photos_table.put_item(
        Item={
            "photo_id": photo_id,
            "object_key": object_key,
            "original_filename": original_filename,
            "author_name": author_name,
            "content_type": content_type,
            "declared_size": file_size,
            "status": "PENDING",
            "created_at": created_at,
            "expires_at": expires_at,
        }
    )

    return response(
        200,
        {
            "photoId": photo_id,
            "objectKey": object_key,
            "upload": upload,
        },
    )
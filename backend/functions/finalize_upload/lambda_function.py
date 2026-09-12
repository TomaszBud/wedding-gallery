import io
import os
from datetime import datetime, timezone
from urllib.parse import unquote_plus

import boto3
from botocore.exceptions import ClientError
from PIL import Image, ImageOps, UnidentifiedImageError
from pillow_heif import register_heif_opener


TABLE_NAME = os.environ["PHOTOS_TABLE"]
BUCKET_NAME = os.environ["PHOTOS_BUCKET"]

DISPLAY_MAX_SIZE = 1920
THUMBNAIL_MAX_SIZE = 480

DISPLAY_QUALITY = 82
THUMBNAIL_QUALITY = 72

MAX_PIXELS = 60_000_000


# HEIC/HEIF as recognised format.
register_heif_opener(
    thumbnails=False,
    decode_threads=2,
)


s3 = boto3.client("s3")

dynamodb = boto3.resource("dynamodb")
photos_table = dynamodb.Table(TABLE_NAME)


def handler(event, context):

    for record in event.get("Records", []):

        object_key = unquote_plus(
            record["s3"]["object"]["key"]
        )

        original_size = record["s3"]["object"]["size"]

        if not object_key.startswith("uploads/"):
            continue

        filename = object_key.removeprefix("uploads/")
        photo_id = filename.split(".", 1)[0]

        try:
            process_photo(
                photo_id=photo_id,
                object_key=object_key,
                original_size=original_size,
            )

        except Exception as error:

            print(
                f"Przetwarzanie się nie powiodło {object_key}: "
                f"{type(error).__name__}: {error}"
            )

            mark_failed(
                photo_id,
                object_key,
                type(error).__name__,
            )

            raise


def process_photo(
    photo_id,
    object_key,
    original_size,
):

    print(f"Przetwarzamy {object_key}")

    response = s3.get_object(
        Bucket=BUCKET_NAME,
        Key=object_key,
    )

    original_bytes = response["Body"].read()

    try:
        image = Image.open(
            io.BytesIO(original_bytes)
        )

    except UnidentifiedImageError:
        raise ValueError(
            "Ten typ obrazu nie jest wspierany"
        )

    width, height = image.size

    if width * height > MAX_PIXELS:
        raise ValueError(
            f"Obraz jest zbyt duży: {width}x{height}"
        )

    #
    # Rotate
    #
    image = ImageOps.exif_transpose(image)

    image.load()

    #
    # WebP does not neet full 48 MP
    #
    image.thumbnail(
        (
            DISPLAY_MAX_SIZE,
            DISPLAY_MAX_SIZE,
        ),
        Image.Resampling.LANCZOS,
    )

    image = convert_to_rgb(image)

    display_width, display_height = image.size

    display_bytes = encode_webp(
        image,
        quality=DISPLAY_QUALITY,
    )

    #
    # Thumbnail out of a smaller img not from the huge og,
    #
    thumbnail = image.copy()

    thumbnail.thumbnail(
        (
            THUMBNAIL_MAX_SIZE,
            THUMBNAIL_MAX_SIZE,
        ),
        Image.Resampling.LANCZOS,
    )

    thumbnail_bytes = encode_webp(
        thumbnail,
        quality=THUMBNAIL_QUALITY,
    )

    display_key = (
        f"processed/{photo_id}.webp"
    )

    thumbnail_key = (
        f"thumbnails/{photo_id}.webp"
    )

    s3.put_object(
        Bucket=BUCKET_NAME,
        Key=display_key,
        Body=display_bytes,
        ContentType="image/webp",
        CacheControl=(
            "public, max-age=31536000, immutable"
        ),
    )

    s3.put_object(
        Bucket=BUCKET_NAME,
        Key=thumbnail_key,
        Body=thumbnail_bytes,
        ContentType="image/webp",
        CacheControl=(
            "public, max-age=31536000, immutable"
        ),
    )

    now = datetime.now(
        timezone.utc
    ).isoformat()

    photos_table.update_item(
        Key={
            "photo_id": photo_id,
        },

        UpdateExpression=(
            "SET "
            "#status = :ready, "
            "uploaded_at = if_not_exists("
            "uploaded_at, :now"
            "), "
            "processed_at = :now, "
            "display_key = :display_key, "
            "thumbnail_key = :thumbnail_key, "
            "width = :width, "
            "height = :height, "
            "original_size_bytes = :original_size, "
            "display_size_bytes = :display_size, "
            "thumbnail_size_bytes = :thumbnail_size "
            "REMOVE expires_at"
        ),

        ConditionExpression=(
            "attribute_exists(photo_id) "
            "AND object_key = :object_key"
        ),

        ExpressionAttributeNames={
            "#status": "status",
        },

        ExpressionAttributeValues={
            ":ready": "READY",
            ":now": now,
            ":display_key": display_key,
            ":thumbnail_key": thumbnail_key,
            ":width": display_width,
            ":height": display_height,
            ":original_size": original_size,
            ":display_size": len(display_bytes),
            ":thumbnail_size": len(thumbnail_bytes),
            ":object_key": object_key,
        },
    )

    print(
        f"Photo {photo_id} READY "
        f"({display_width}x{display_height})"
    )


def convert_to_rgb(image):

    if image.mode == "RGB":
        return image

    #
    # PNG/WebP transparency to have white background
    #
    if image.mode in ("RGBA", "LA"):

        rgba = image.convert("RGBA")

        background = Image.new(
            "RGB",
            rgba.size,
            "white",
        )

        background.paste(
            rgba,
            mask=rgba.getchannel("A"),
        )

        return background

    return image.convert("RGB")


def encode_webp(image, quality):

    buffer = io.BytesIO()

    image.save(
        buffer,
        format="WEBP",
        quality=quality,
        method=4,
    )

    return buffer.getvalue()


def mark_failed(
    photo_id,
    object_key,
    error_type,
):

    try:
        photos_table.update_item(
            Key={
                "photo_id": photo_id,
            },

            UpdateExpression=(
                "SET #status = :failed, "
                "processing_error = :error"
            ),

            ConditionExpression=(
                "attribute_exists(photo_id) "
                "AND object_key = :object_key"
            ),

            ExpressionAttributeNames={
                "#status": "status",
            },

            ExpressionAttributeValues={
                ":failed": "PROCESSING_FAILED",
                ":error": error_type,
                ":object_key": object_key,
            },
        )

    except ClientError as error:

        if (
            error.response["Error"]["Code"]
            != "ConditionalCheckFailedException"
        ):
            raise
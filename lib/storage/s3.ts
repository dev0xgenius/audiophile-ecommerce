import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function getConfig() {
    const endpoint = process.env.S3_ENDPOINT;
    const region = process.env.S3_REGION ?? "auto";
    const accessKeyId = process.env.S3_ACCESS_KEY;
    const secretAccessKey = process.env.S3_SECRET_KEY;
    const bucket = process.env.S3_BUCKET;

    if (!endpoint || !accessKeyId || !secretAccessKey || !bucket) {
        throw new Error(
            "S3 configuration missing. Set S3_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY, and S3_BUCKET environment variables."
        );
    }

    return { endpoint, region, accessKeyId, secretAccessKey, bucket };
}

function createClient(): S3Client {
    const { endpoint, region, accessKeyId, secretAccessKey } = getConfig();
    return new S3Client({
        endpoint,
        region,
        credentials: { accessKeyId, secretAccessKey },
        forcePathStyle: true,
    });
}

export async function uploadFile(
    buffer: Buffer,
    key: string,
    mimeType: string,
): Promise<{ url: string; key: string }> {
    const { bucket, endpoint } = getConfig();
    const client = createClient();

    await client.send(
        new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: buffer,
            ContentType: mimeType,
        })
    );

    const url = `${endpoint}/${bucket}/${key}`;
    return { url, key };
}

export async function deleteFile(key: string): Promise<void> {
    const { bucket } = getConfig();
    const client = createClient();

    await client.send(
        new DeleteObjectCommand({
            Bucket: bucket,
            Key: key,
        })
    );
}

export async function getSignedDownloadUrl(key: string, expiresIn = 3600): Promise<string> {
    const { bucket } = getConfig();
    const client = createClient();

    const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
    });

    return getSignedUrl(client, command, { expiresIn });
}

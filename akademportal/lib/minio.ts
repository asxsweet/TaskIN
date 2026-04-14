import { Client } from "minio";
import { randomUUID } from "crypto";

const bucket = process.env.MINIO_BUCKET || "academic-works";

function getClient() {
  const end = process.env.MINIO_ENDPOINT || "localhost";
  const port = Number(process.env.MINIO_PORT || 9000);
  const useSSL = process.env.MINIO_USE_SSL === "true";
  return new Client({
    endPoint: end,
    port,
    useSSL,
    accessKey: process.env.MINIO_ACCESS_KEY || "minio",
    secretKey: process.env.MINIO_SECRET_KEY || "minio123",
  });
}

export async function ensureBucket() {
  const client = getClient();
  const exists = await client.bucketExists(bucket).catch(() => false);
  if (!exists) {
    await client.makeBucket(bucket, "us-east-1");
  }
}

export async function uploadWorkFile(
  buffer: Buffer,
  originalName: string,
  mime: string
): Promise<{ path: string; size: number }> {
  await ensureBucket();
  const client = getClient();
  const ext = originalName.includes(".") ? originalName.slice(originalName.lastIndexOf(".")) : "";
  const objectName = `works/${randomUUID()}${ext}`;
  await client.putObject(bucket, objectName, buffer, buffer.length, {
    "Content-Type": mime || "application/octet-stream",
  });
  return { path: objectName, size: buffer.length };
}

export async function getSignedDownloadUrl(objectPath: string, expirySeconds = 900) {
  await ensureBucket();
  const client = getClient();
  return client.presignedGetObject(bucket, objectPath, expirySeconds);
}

export { bucket as minioBucket };

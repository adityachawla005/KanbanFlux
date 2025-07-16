// /app/api/upload/route.ts
import { NextResponse } from "next/server";
import {
  BlobSASPermissions,
  generateBlobSASQueryParameters,
  StorageSharedKeyCredential,
  SASProtocol,
} from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME!;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY!;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME!;

const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

export async function POST(req: Request) {
  try {
    const { fileName } = await req.json();
    if (!fileName) {
      return NextResponse.json({ error: "Filename is required" }, { status: 400 });
    }

    const blobName = `${uuidv4()}-${fileName}`;
    
    // Upload SAS token (5 minutes for uploading)
    const uploadExpiresOn = new Date(Date.now() + 5 * 60 * 1000);
    const uploadSasToken = generateBlobSASQueryParameters(
      {
        containerName,
        blobName,
        permissions: BlobSASPermissions.parse("cw"), // create + write
        expiresOn: uploadExpiresOn,
        protocol: SASProtocol.Https,
      },
      sharedKeyCredential
    ).toString();

    // Read SAS token (1 hour for reading)
    const readExpiresOn = new Date(Date.now() + 60 * 60 * 1000);
    const readSasToken = generateBlobSASQueryParameters(
      {
        containerName,
        blobName,
        permissions: BlobSASPermissions.parse("r"), // read only
        expiresOn: readExpiresOn,
        protocol: SASProtocol.Https,
      },
      sharedKeyCredential
    ).toString();

    const uploadUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?${uploadSasToken}`;
    const mediaUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?${readSasToken}`;

    return NextResponse.json({ uploadUrl, mediaUrl, blobName });
  } catch (err) {
    console.error("[UPLOAD_SAS_ERROR]", err);
    return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
  }
}
import {
  BlobSASPermissions,
  generateBlobSASQueryParameters,
  StorageSharedKeyCredential,
  SASProtocol,
} from "@azure/storage-blob";

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME!;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY!;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME!;

const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

export const generateReadSasUrl = (blobName: string): string => {
  const expiresOn = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName,
      blobName, // full path including folders if any
      permissions: BlobSASPermissions.parse("r"),
      expiresOn,
      protocol: SASProtocol.Https,
    },
    sharedKeyCredential
  ).toString();

  return `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;
};

export const extractBlobNameFromUrl = (fullUrl: string): string => {
  // Get everything after the container name
  const url = new URL(fullUrl);
  const pathParts = url.pathname.split("/");

  // Remove empty first element (from leading slash)
  // and container name (second element)
  const blobParts = pathParts.slice(2);

  // Decode each component in case of URL-encoded characters
  return decodeURIComponent(blobParts.join("/"));
};

export const isBlobUrl = (url: string): boolean => {
  return url.includes(".blob.core.windows.net");
};

import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
type ACLType = "public-read" | "private";
const connection = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: `https://s3-${process.env.AWS_REGION}.amazonaws.com`,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const checkfileExist = async (path: string) => {
  try {
    const command = new HeadObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: path,
    });
    await connection.send(command);
    return true;
  } catch (error) {
    return false;
  }
};

export const downloadObject = async (path: string, expiry: number = 60) => {
  const option = {
    Bucket: process.env.S3_BUCKET,
    Key: path,
  };
  const downloadObject = new GetObjectCommand(option);
  const url = await getSignedUrl(connection, downloadObject, {
    expiresIn: expiry,
  });
  return url;
};

export const uploadObject = async ( path: string, type: string, acl:ACLType ="private"  ) => {
  const uploadObject = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: path,
    ContentType: type,
    ACL: acl
  });
  const url = await getSignedUrl(connection, uploadObject,{expiresIn: 60});
  return url;
};

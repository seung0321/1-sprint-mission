import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import util from 'util';

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

function generateFileKey(file: Express.Multer.File): string {
  const fileExt = path.extname(file.originalname).slice(1);
  return `${uuidv4()}.${fileExt}`;
}

export async function uploadImages(file: Express.Multer.File): Promise<string> {
  const key = generateFileKey(file);

  if (process.env.NODE_ENV === 'development') {
    const uploadDir = path.join(__dirname, '..', 'uploads');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, key);
    const writeFile = util.promisify(fs.writeFile);
    await writeFile(filePath, file.buffer);

    return `/uploads/${key}`;
  } else {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype || 'application/octet-stream',
    });
    await s3.send(command);
    return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  }
}

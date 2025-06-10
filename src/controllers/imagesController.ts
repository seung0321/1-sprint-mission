import { Request, Response } from 'express';
import { uploadImageToS3 } from '../services/imageService';

export async function uploadImage(req: Request, res: Response) {
  if (!req.file) {
    return res.status(400).send({ message: 'No file uploaded' });
  }

  try {
    const url = await uploadImageToS3(req.file);
    return res.status(201).send({ url });
  } catch (err) {
    console.error('S3 업로드 에러', err);
    return res.status(500).send({ message: '업로드 실패' });
  }
}

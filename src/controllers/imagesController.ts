import { Request, Response } from 'express';
import { uploadImages } from '../services/imageService';

export async function uploadImage(req: Request, res: Response) {
  if (!req.file) {
    return res.status(400).send({ message: 'No file uploaded' });
  }

  try {
    const url = await uploadImages(req.file);
    return res.status(201).send({ url });
  } catch {
    return res.status(500).send({ message: '업로드 실패' });
  }
}

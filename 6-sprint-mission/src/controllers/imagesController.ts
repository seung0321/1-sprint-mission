import { Request, Response } from 'express';
import { generateImageUrl } from '../services/imageService';

export async function uploadImage(req: Request, res: Response) {
  const host = req.get('host');
  if (!host) {
    return res.status(400).send({ message: 'Host header is missing' });
  }
  if (!req.file) {
    return res.status(400).send({ message: 'No file uploaded' });
  }

  const url = generateImageUrl(host, req.file.filename);
  return res.send({ url });
}

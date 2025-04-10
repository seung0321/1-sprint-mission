import express, { Request, Response } from 'express';
import { withAsync } from '../lib/withAsync';
import { upload } from '../repositories/imageReposotory';
import { generateImageUrl } from '../services/imageService';

async function uploadImage(req: Request, res: Response) {
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

const imagesRouter = express.Router();
imagesRouter.post('/upload', upload.single('image'), withAsync(uploadImage));

export default imagesRouter;

import path from 'path';
import { STATIC_PATH } from '../lib/constants';

export function generateImageUrl(host: string, filename: string): string {
  return `http://${path.join(host, STATIC_PATH, filename)}`;
}

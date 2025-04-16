import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import { PUBLIC_PATH } from '../lib/constants';
import BadRequestError from '../lib/errors/BadRequestError';

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
const FILE_SIZE_LIMIT = 5 * 1024 * 1024;

export const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, PUBLIC_PATH);
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      const filename = `${uuidv4()}${ext}`;
      cb(null, filename);
    },
  }),
  limits: {
    fileSize: FILE_SIZE_LIMIT,
  },
  fileFilter(req, file, cb) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(new BadRequestError('Only png, jpeg, and jpg are allowed'));
    }
    cb(null, true);
  },
});

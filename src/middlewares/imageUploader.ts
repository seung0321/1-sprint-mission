import multer from 'multer';
import BadRequestError from '../lib/errors/BadRequestError';

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
const FILE_SIZE_LIMIT = 5 * 1024 * 1024;

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: FILE_SIZE_LIMIT },
  fileFilter(req, file, cb) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(new BadRequestError('파일 형태는 png, jpg, jpeg 형태만 가능합니다.'));
    }
    cb(null, true);
  },
});

import { FileFilterCallback } from 'multer';

export const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const limits = {
  fileSize: 5 * 1024 * 1024, // 5 MB file size limit
  files: 1, // Maximum 1 file at a time
};

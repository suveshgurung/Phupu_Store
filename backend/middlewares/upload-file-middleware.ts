import multer from 'multer';
import { Request } from 'express';

const storage = multer.diskStorage({
  destination: function (
    req: Request, 
    file: Express.Multer.File, 
    cb: (error: Error | null, destination: string) => void
  ) {
    cb(null, './uploads/');
  },
  filename: function (
    req: Request, 
    file: Express.Multer.File, 
    cb: (error: Error | null, filename: string) => void
  ) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    }
    else {
      cb(new Error('Only images allowed'));
    }
  },
});

export default upload;

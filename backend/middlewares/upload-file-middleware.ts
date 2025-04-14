import multer from 'multer';
import createError from '../utilities/create-error';
import ErrorCodes from '../types/error-codes';

// TODO: add firebase api for uploading into firebase.
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },  // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    }
    else {
      cb(createError(400, "File should be an image.", ErrorCodes.ER_FILE_NOT_IMAGE));
    }
  },
});

export default upload;

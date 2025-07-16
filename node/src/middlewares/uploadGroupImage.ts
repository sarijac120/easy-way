import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../public/uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    let ext = '';
    if (file.mimetype === 'image/jpeg') ext = '.jpg';
    else if (file.mimetype === 'image/png') ext = '.png';
    else ext = path.extname(file.originalname) || '';
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, '_').replace(/\.[^.]+$/, '') + ext);
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Only .png and .jpg images are allowed!'));
  }
};

export const uploadGroupImage = multer({ storage, fileFilter });

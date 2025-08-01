import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../helpers/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'productos_pasteleria',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [
      { width: 800, height: 800, crop: 'limit' }
    ],
    format: 'webp', // 👈 Fuerza a que Cloudinary convierta al formato webp
  },
});

const upload = multer({ storage });

export default upload;

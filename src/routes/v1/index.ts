import express, { Router, Request, Response } from 'express';
import appRoutes from './app';
import adminRoutes from './admin';
import UserService from '../../services/general/user.service';
import validateDTO from '../../dto/middlewares';
import RegisterDTO from '../../dto/classes/Register.dto';
import multer, { FileFilterCallback } from "multer";
import CommonService from '../../services/general/common.service';

const router: Router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/");
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const fileFilter = (
  _req: Request,
  _file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  cb(null, true); 
};

const upload = multer({ storage, fileFilter });

// Routes
router.use('/app', appRoutes);
router.use('/admin', adminRoutes);
//auth routes
router.post('/admin/auth/login', UserService.adminLogin);
router.post('/admin/auth/register', validateDTO(RegisterDTO), UserService.adminRegister);
router.post('/auth/login', UserService.revieweroperatorLogin);
router.post('/auth/logout', UserService.logout);
router.post('/verify-email', UserService.verifyEmail);
router.post('/verification', UserService.verification);

// General routes
router.post('/uploads', upload.any(), CommonService.uploadFiles);
router.get('/', (_req: Request, res: Response) => res.send("Welcome to SGLP API"));

export default router;

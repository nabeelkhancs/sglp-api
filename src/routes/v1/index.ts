import express, { Router } from 'express';
import appRoutes from './app';
import adminRoutes from './admin';
import UserService from '../../services/general/user.service';
import validateDTO from '../../dto/middlewares';
import RegisterDTO from '../../dto/classes/Register.dto';

const router: Router = express.Router();

router.use('/app', appRoutes);
router.use('/admin', adminRoutes);
router.post('/admin/auth/login', UserService.adminLogin)
router.post('/admin/auth/register', validateDTO(RegisterDTO), UserService.adminRegister)
router.post('/auth/login', UserService.revieweroperatorLogin)
router.post('/auth/logout', UserService.logout)
router.get('/', (req, res) => res.send("Welcome to SGLP API"));
router.post('/verify-email', UserService.verifyEmail)

export default router;
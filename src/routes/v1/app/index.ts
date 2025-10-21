import express, { Router } from "express";
import UserService from "../../../services/general/user.service";

import validateDTO from '../../../dto/middlewares';
import LoginDTO from '../../../dto/classes/Login.dto';
import VerifyOtpDTO from "../../../dto/classes/VerifyOtp.dto";
import ForgetPasswordDTO from "../../../dto/classes/ForgetPassword.dto";
import ChangePassDTO from "../../../dto/classes/ChangePass.dto";
import RegisterDTO from "../../../dto/classes/Register.dto";

const router: Router = express.Router();

router.post("/register", validateDTO(RegisterDTO), UserService.vistorRegister)
router.post('/login', validateDTO(LoginDTO), UserService.visitorLogin);
router.post('/logout', UserService.logout);
router.post('/forgot-password', validateDTO(ForgetPasswordDTO), UserService.forgotPassword);
router.post('/verifyOtp', validateDTO(VerifyOtpDTO), UserService.verifyOtp);
router.post('/changePassword', validateDTO(ChangePassDTO), UserService.changePassword);

export default router;
import express, { Router } from "express";
import UserService from "../../../services/general/user.service";
import AuthMiddleware from "../../../auth/jwt";
import RegisterDTO from "../../../dto/classes/Register.dto";
import validateDTO from "../../../dto/middlewares";

const router: Router = express.Router();


router.post("/login", UserService.adminLogin)
router.post("/change-password", UserService.changePassword)
router.post("/register", validateDTO(RegisterDTO), UserService.adminRegister)
router.get("/permissions", AuthMiddleware.auth, UserService.getMyPermissions)
router.get("/", (req, res) => {
  res.send("Welcome to SGLP Admin Auth API");
});


export default router;
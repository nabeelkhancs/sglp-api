import express, { Router } from "express";
import UserService from "../../../services/general/user.service";


const router: Router = express.Router();

router.post("/", UserService.createUser)
router.delete("/:id", UserService.deleteUser)
router.put("/", UserService.updateUser)
router.get("/:id", UserService.getUserById)
router.get("/", UserService.getUser)

export default router;
import express, { Router } from "express";
import RoleService from "../../../services/rbac/roles.service";
import validateDTO from "../../../dto/middlewares";
import { RoleAddDTO, RoleUpdateDTO } from "../../../dto/classes/Role.dto";


const router: Router = express.Router();

router.post("/", validateDTO(RoleAddDTO), RoleService.createRole)
router.delete("/:id", RoleService.deleteRole)
router.put("/", validateDTO(RoleUpdateDTO), RoleService.updateRole)
router.get("/:id", RoleService.getRoleById)
router.get("/", RoleService.getRole)

export default router;
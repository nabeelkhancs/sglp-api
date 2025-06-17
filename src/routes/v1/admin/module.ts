import express, { Router } from "express";
import ModuleService from "../../../services/rbac/modules.service";
import ModuleDTO from "../../../dto/classes/Module.dto";
import validateDTO from "../../../dto/middlewares";


const router: Router = express.Router();

router.post("/", validateDTO(ModuleDTO), ModuleService.createModule)
router.delete("/:id", ModuleService.deleteModule)
router.put("/", ModuleService.updateModule)
router.get('/all', ModuleService.getAllModule)
// router.get('/permissions', ModuleService.getMyPermissions)//no use 
router.get("/:id", ModuleService.getModuleById)
router.get("/", ModuleService.getModule)

export default router;
import express, { Router } from "express";
import ActionService from "../../../services/rbac/actions.service";
import ActionDTO from "../../../dto/classes/Action.dto";
import validateDTO from "../../../dto/middlewares";


const router: Router = express.Router();

router.post("/", validateDTO(ActionDTO), ActionService.createAction)
router.delete("/:id", ActionService.deleteAction)
router.put("/", ActionService.updateAction)
router.get("/:id", ActionService.getActionById)
router.get("/", ActionService.getAction)

export default router;
import express, { Router } from "express";
import CommitteeService from "../../../services/general/committee.service";
import CommitteeDTO from "../../../dto/classes/Committee.dto";
import validateDTO from "../../../dto/middlewares";

const router: Router = express.Router();

router.post("/", validateDTO(CommitteeDTO), CommitteeService.create);
router.put("/:id", CommitteeService.update);
router.get("/:id", CommitteeService.get);
router.get("/", CommitteeService.getAll);
router.delete("/:id", CommitteeService.delete);

export default router;
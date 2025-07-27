import express, { Router } from "express";
import CaseService from "../../../services/general/case.service";
import CaseDTO from "../../../dto/classes/Case.dto";
import validateDTO from "../../../dto/middlewares";

const router: Router = express.Router();

router.post("/",CaseService.createCase)
router.get("/courts", CaseService.getCourtsCount)
// router.delete("/:id", CaseService.deleteAction)
router.put("/:id", CaseService.updateCase)
router.get("/:id", CaseService.getCase)
router.get("/", CaseService.getAllCases)

export default router;
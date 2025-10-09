import express, { Router } from "express";
import CaseService from "../../../services/general/case.service";

const router: Router = express.Router();

router.post("/",CaseService.createCase)
router.get("/search", CaseService.searchCases)
router.get("/courts", CaseService.getCourtsCount)
router.get("/logs", CaseService.getLogs)
// router.delete("/:id", CaseService.deleteAction)
router.put("/:id", CaseService.updateCase)
router.get("/:id", CaseService.getCase)
router.get("/", CaseService.getAllCases)

export default router;
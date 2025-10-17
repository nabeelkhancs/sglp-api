import express, { Router } from "express";
import CaseService from "../../../services/general/case.service";

const router: Router = express.Router();

router.post("/",CaseService.createCase)
router.get("/search", CaseService.searchCases)
router.get("/calendar", CaseService.calendarViewCases)
router.get("/courts", CaseService.getCourtsCount)
router.get("/logs", CaseService.getLogs)
router.delete("/image/:id", CaseService.deleteCaseImage)
router.put("/:id", CaseService.updateCase)
router.get("/:id", CaseService.getCase)
router.get("/", CaseService.getAllCases)

export default router;
import express, { Router } from "express";
import ReportService from "../../../services/general/reports.service";

const router: Router = express.Router();

router.post("/generate", ReportService.generateReport);

export default router;
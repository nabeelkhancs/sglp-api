import express, { Router } from "express";
import PageService from "../../../services/rbac/pages.service";
import validateDTO from "../../../dto/middlewares";
import PageDTO from "../../../dto/classes/Page.dto";


const router: Router = express.Router();

router.post("/", validateDTO(PageDTO), PageService.createpage)
router.delete("/:id", PageService.deletepage)
router.put("/", PageService.updatepage)
router.get("/:id", PageService.getpageById)
router.get("/", PageService.getpage)

export default router;
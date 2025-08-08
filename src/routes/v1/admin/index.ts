import express, { Router } from "express";

import authRoute from "./auth";
import userRoute from "./user";
import caseRoutes from "./case";
import pageRoutes from "./page";
import roleRoutes from "./role";
import actionRoute from "./action";
import moduleRoutes from "./module";
import generalRoute from "./general";
import reportsRoutes from "./reports";
import committeeRoutes from "./committee";
import AuthMiddleware from "../../../auth/jwt";
import notificationsRoutes from "./notifications";
import CommonService from "../../../services/general/common.service";


const router: Router = express.Router();

router.use('/auth', authRoute)
router.use("/modules", AuthMiddleware.auth, moduleRoutes)
router.use("/pages", pageRoutes)
router.use("/roles", AuthMiddleware.auth, roleRoutes)
router.use("/actions", AuthMiddleware.auth, actionRoute)
router.use("/", AuthMiddleware.auth, generalRoute)
router.use("/users", AuthMiddleware.auth, userRoute)
router.use("/cases", AuthMiddleware.auth,  caseRoutes)
router.use("/committees", AuthMiddleware.auth,  committeeRoutes)
router.use("/dashboard", AuthMiddleware.auth, CommonService.getDashboardCases)
router.use("/notifications", AuthMiddleware.auth, notificationsRoutes)
router.use("/reports", AuthMiddleware.auth, reportsRoutes)

export default router;
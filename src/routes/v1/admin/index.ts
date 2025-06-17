import express, { Router } from "express";
import moduleRoutes from "./module";
import pageRoutes from "./page";
import roleRoutes from "./role";
import actionRoute from "./action";
import generalRoute from "./general";
import authRoute from "./auth";
import userRoute from "./user";
import caseRoutes from "./case";
// import clusterRoutes from "./cluster";
// import areaRoutes from "./area";
// import branchRoutes from "./branch";
import AuthMiddleware from "../../../auth/jwt";


const router: Router = express.Router();

router.use('/auth', authRoute)
router.use("/modules", AuthMiddleware.auth, moduleRoutes)
router.use("/pages", AuthMiddleware.auth, pageRoutes)
router.use("/roles", AuthMiddleware.auth, roleRoutes)
router.use("/actions", AuthMiddleware.auth, actionRoute)
router.use("/", AuthMiddleware.auth, generalRoute)
router.use("/users", AuthMiddleware.auth, userRoute)
router.use("/cases", AuthMiddleware.auth,  caseRoutes)
// router.use('/cluster', AuthMiddleware.auth, clusterRoutes)
// router.use('/area', AuthMiddleware.auth, areaRoutes)
// router.use('/branch', AuthMiddleware.auth, branchRoutes)

export default router;
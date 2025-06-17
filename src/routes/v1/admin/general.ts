import express, { Router } from "express";
import multer from "multer";
import TypeData from "../../../services/general/type-data.service"; 
import uploadsService from "../../../services/general/uploads.service";

const router: Router = express.Router();
const upload = multer();

router.post("/typedata", TypeData.getTypeData);

// Single file upload (field name: 'file')
router.post("/uploads", upload.single('file'), async (req, res) => {
  try {
    console.log("File upload request received");
    const fileHash = await uploadsService.uploadSingleFile(req);
    res.json({ fileHash });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Multiple file upload (field name: 'files')
router.post("/uploads/multiple", upload.array('files'), async (req, res) => {
  try {
    const fileHashes = await uploadsService.uploadMultipleFiles(req);
    res.json({ fileHashes });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
import express, { Router } from 'express';
import asyncHandler from '../../common/asyncHandler';
import fs from 'fs'
import getImagePath from '../../../ext';

const router: Router = express.Router();


router.get('/', (req, res) => res.send("Welcome to ERP-PRODUCT"));

router.get('/:name', asyncHandler(async (req, res) => {
  const imagePath = getImagePath(req.params.name)

  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.status(404).send('Resource not found');
  }

}));


export default router;
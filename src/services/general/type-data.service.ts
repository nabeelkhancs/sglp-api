import asyncHandler from '../../common/asyncHandler';
import { Request, Response } from 'express';
import TypeDataRepository from '../../repositories/general/typeData';

class TypeData {

  static getTypeData = asyncHandler(async (req: Request, res: Response) => {
    const modelNames: string[] = req.body.models;
    const responseData: any[] = [];

    for (let i = 0; i < modelNames.length; i++) {
        const model = modelNames[i];
        const data: any = await TypeDataRepository.typeData(model);
        responseData.push(data);
    }
    
    res.generalResponse("TypeData Records", responseData)
  });

}

export default TypeData;

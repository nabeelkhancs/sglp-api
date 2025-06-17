import ModulesRepository from '../../repositories/rbac/modules.repository';
import { IModules } from '../../models/interfaces';
import { Request, Response } from 'express';
import asyncHandler from '../../common/asyncHandler';

class ModulesService {

  static createModule = asyncHandler(async (req: Request, res: Response) => {
    const moduleData: IModules = req.body;
    const result: any = await ModulesRepository.createModule({ ...moduleData, order: Number(moduleData.order) })
    res.generalResponse("Module add successfuly!!", result);
  });

  static getModule = asyncHandler(async (req: Request, res: Response) => {
    const parsedQuery = req.query;
    const result = await ModulesRepository.getModule(parsedQuery);
    res.generalResponse("Data fetch successfuly!!", result);
  })


  static getAllModule = asyncHandler(async (req: Request, res: Response) => {
    const result = await ModulesRepository.getAllModule({});
    res.generalResponse("Data fetch successfuly!!", result);
  })


  static getMyPermissions = asyncHandler(async (req: Request, res: Response) => {
    const result = await ModulesRepository.getMyPermissions(req.user.roleId);
    res.generalResponse("Data fetch successfuly!!", result);
  })

  static getModuleById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ModulesRepository.getModuleById(Number(id));
    res.generalResponse("Data fetch successfuly!!", result);
  })

  static updateModule = asyncHandler(async (req: Request, res: Response) => {
    const { id, data } = req.body
    const result = await ModulesRepository.updateModule(id, data);
    res.generalResponse("Module updated successfuly!!", result);
  })

  static deleteModule = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await ModulesRepository.updateModule(Number(id), { isDeleted: true });
    res.generalResponse("Module deleted successfuly!!");
  })

}

export default ModulesService;

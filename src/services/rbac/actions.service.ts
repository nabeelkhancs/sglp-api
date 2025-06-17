import ActionsRepository from '../../repositories/rbac/actions.repository';
import { IActions } from '../../models/interfaces';
import { Request, Response } from 'express';
import asyncHandler from '../../common/asyncHandler';

class ActionsService {

  static createAction = asyncHandler(async (req: Request, res: Response) => {
    const actionData: IActions = req.body;
    const result: any = await ActionsRepository.createAction(actionData)
    res.generalResponse("Action add successfuly!!", result);
  });

  static getAction = asyncHandler(async (req: Request, res: Response) => {
    const parsedQuery = req.query;

    const result = await ActionsRepository.getAction(parsedQuery);
    res.generalResponse("Data fetch successfuly!!", result);
  })

  static getActionById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ActionsRepository.getActionById(Number(id));
    res.generalResponse("Data fetch successfuly!!", result);
  })

  static updateAction = asyncHandler(async (req: Request, res: Response) => {
    const { id, data } = req.body
    const result = await ActionsRepository.updateAction(id, data);
    res.generalResponse("Action updated successfuly!!", result);
  })

  static deleteAction = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await ActionsRepository.updateAction(Number(id), { isDeleted: true });
    res.generalResponse("Action deleted successfuly!!");
  })

}

export default ActionsService;

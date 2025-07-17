import { Request, Response } from 'express';
import asyncHandler from '../../common/asyncHandler';
import { ICommittee } from '../../models/interfaces';
import CommitteeRepository from '../../repositories/general/CommitteeRepository';
import CommonService from './common.service';
import AuditLogsRepository from '../../repositories/general/AuditLogsRepository';

class CommitteeService {
  static create = asyncHandler(async (req: Request, res: Response) => {
    const committeeData: ICommittee = req.body;
    const otherCommitteeData = {
      createdBy: req.user.id,
    };
    const result: any = await CommitteeRepository.createCommittee({ ...committeeData, ...otherCommitteeData });
    await AuditLogsRepository.logAction(req.body, req, result.cpNumber || result.id, 'CREATE COMMITTEE');
    res.generalResponse("Committee created successfully!", { ...result.toJSON() });
  });

  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const { pageNumber, pageSize, ...filters } = req.query;

    const page = pageNumber ? parseInt(pageNumber as string) : 1;
    const size = pageSize ? parseInt(pageSize as string) : 10;

    const result = await CommitteeRepository.getCommittees(page, size, filters);

    const actions = await CommonService.getPageActionsByRole(
      req?.user?.roleId,
      req?.user?.roleId == 1 || req?.user?.roleId == 3 ? "Committees" : "Submitted Committee"
    );

    res.generalResponse("Committees fetched successfully!", { result, actions });
  });

  static get = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    let result = null;
    if (id) {
      result = await CommitteeRepository.getCommitteeById(Number(id));
    } else {
      return res.status(400).json({ error: 'Please provide id as a route parameter' });
    }
    if (!result) {
      return res.status(404).json({ error: 'Committee not found' });
    }
    res.generalResponse('Committee fetched successfully!', result);
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userType = req.user?.type;
    const committeeData: Partial<ICommittee> = req.body;
    if (!id) {
      return res.status(400).json({ error: 'Please provide id as a route parameter' });
    }

    if ('cpNumber' in committeeData) {
      delete committeeData.cpNumber;
    }

    const updatedCommittee: any = await CommitteeRepository.updateCommittee(Number(id), committeeData);
    if (!updatedCommittee) {
      return res.status(404).json({ error: 'Committee not found' });
    }
    await AuditLogsRepository.logAction(req.body, req, updatedCommittee.cpNumber || updatedCommittee.id, 'UPDATE COMMITTEE');
    res.generalResponse('Committee updated successfully!', updatedCommittee);
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Please provide id as a route parameter' });
    }
    await CommitteeRepository.deleteCommittee(Number(id));
    res.generalResponse('Committee deleted successfully!');
  });
}

export default CommitteeService;
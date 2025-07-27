import { Request, Response } from 'express';
import asyncHandler from '../../common/asyncHandler';
import { ICases } from '../../models/interfaces';
import CaseRepository from '../../repositories/general/CaseRepository';
import PermissionsService from '../rbac/permissions.service';
import CommonService from './common.service';

class CaseService {
  static createCase = asyncHandler(async (req: Request, res: Response) => {
    const caseData: ICases = req.body;
    const otherCaseData = {
      createdBy: req.user.id,
    };
    const result: any = await CaseRepository.createCase({ ...caseData, ...otherCaseData });
    if (!result.caseNumber || result.caseNumber === "") {
      const date = new Date();
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      const caseNumber = `CASE-${yyyy}${mm}${dd}-${String(result.id).padStart(4, '0')}`;
      await CaseRepository.updateCase(result.id, { caseNumber });
      result.caseNumber = caseNumber;
    }
    res.generalResponse("Case created successfully!", { ...result.toJSON() });
  });

  static getAllCases = asyncHandler(async (req: Request, res: Response) => {
    const { pageNumber, pageSize, courts, subjectOfApplication,  ...filters } = req.query;

    const page = pageNumber ? parseInt(pageNumber as string) : 1;
    const size = pageSize ? parseInt(pageSize as string) : 10;
    let caseStatus = filters.caseStatus || undefined;
    // Handle courts and subjectOfApplication filters
    if (courts) {
      filters.court = courts;
    }
    if (subjectOfApplication) {
      filters.subjectOfApplication = subjectOfApplication;
    }

    const result = await CaseRepository.getCases(page, size, filters, caseStatus);

    const actions = await CommonService.getPageActionsByRole(
      req?.user?.roleId,
      req?.user?.roleId == 1 || req?.user?.roleId == 3 ? "Cases" : "Submitted Case"
    );

    res.generalResponse("Cases fetched successfully!", { result, actions });
  });

  static getCase = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    let result = null;
    if (id) {
      result = await CaseRepository.getCaseById(Number(id));
    } else {
      return res.status(400).json({ error: 'Please provide either id or caseNumber' });
    }
    if (!result) {
      return res.status(404).json({ error: 'Case not found' });
    }
    res.generalResponse('Case fetched successfully!', result);
  });

  static updateCase = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userType = req.user?.type;
    const caseData: Partial<ICases> = req.body;
    if (!id) {
      return res.status(400).json({ error: 'Please provide id as a route parameter' });
    }

    if ('caseNumber' in caseData) {
      delete caseData.caseNumber;
    }

    // if (userType === 'REVIEWER') {
    //   const allowedFields = ['court', 'region', 'relativeDepartment', 'caseStatus', 'isUrgent', 'isCallToAttention', 'isCsCalledInPerson'];
    //   const invalid = Object.keys(caseData).some(key => !allowedFields.includes(key));
    //   if (invalid) {
    //     return res.status(403).json({ error: 'you are not allowed to do this' });
    //   }
    // }

    // if (userType === 'OPERATOR') {
    //   if ('isUrgent' in caseData || 'isCallToAttention' in caseData || 'isCsCalledInPerson' in caseData) {
    //     return res.status(403).json({ error: 'you are not allowed to do this' });
    //   }
    // }
    const updatedCase = await CaseRepository.updateCase(Number(id), caseData);
    if (!updatedCase) {
      return res.status(404).json({ error: 'Case not found' });
    }
    res.generalResponse('Case updated successfully!', updatedCase);
  });

  static getCourtsCount = asyncHandler(async (req: Request, res: Response) => {
    const filters: any = req.query;
    
    const result = await CaseRepository.getCourtsCount(filters);
    res.generalResponse('Courts count fetched successfully!', result);
  });

  async deleteCase(id: string) {
    // Logic to delete a case
  }
}

export default CaseService;
import { Request, Response } from 'express';
import asyncHandler from '../../common/asyncHandler';
import ReportRepository from '../../repositories/general/ReportRepository';
import { Op, fn, literal, where as seqWhere } from 'sequelize';

class ReportService {

  static generateReport = asyncHandler(async (req: Request, res: Response) => {
    console.log("Generating report with data:", req.body);
    
    const { caseType, year, months, isDirectionCase, isCsCalledInPerson } = req.body;
    
    // Prepare filters object for raw query
    const filters: any = {};
    
    if (caseType) {
      filters.caseType = caseType;
    }

    
    // Build statusesToCheck array for caseStatus overlap check
    const statusesToCheck = [];
    if (isDirectionCase === true) {
      statusesToCheck.push('direction');
    }
    if (isCsCalledInPerson === true) {
      statusesToCheck.push('csCalledInPerson');
    }
    
    if (statusesToCheck.length > 0) {
      filters.statusesToCheck = statusesToCheck;
    }
    
    // Handle date/month filtering
    if (year || (months && months.length > 0)) {
      if (months && months.length > 0 && year) {
        // Both year and months - create multiple date ranges
        const monthNumbers = months.map((month: string) => {
          const monthIndex = new Date(Date.parse(month + " 1, 2000")).getMonth() + 1;
          return monthIndex;
        });
        
        const monthYearConditions = monthNumbers.map((monthNum: number) => {
          const startDate = new Date(`${year}-${monthNum.toString().padStart(2, '0')}-01`);
          const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0, 23, 59, 59);
          return { startDate, endDate };
        });
        
        filters.monthYearConditions = monthYearConditions;
      } else if (year) {
        // Only year
        filters.startDate = new Date(`${year}-01-01`);
        filters.endDate = new Date(`${year}-12-31 23:59:59`);
      } else if (months && months.length > 0) {
        // Only months
        const monthNumbers = months.map((month: string) => {
          const monthIndex = new Date(Date.parse(month + " 1, 2000")).getMonth() + 1;
          return monthIndex;
        });
        filters.monthNumbers = monthNumbers;
      }
    }
    
    const cases = await ReportRepository.getCasesByFilters(filters);
    
    const reportData = {
      totalCases: cases.length,
      filters: {
        caseType: caseType || 'All',
        year: year || 'All',
        months: months || 'All',
        isDirectionCase: isDirectionCase !== undefined ? isDirectionCase : 'All',
        isCsCalledInPerson: isCsCalledInPerson !== undefined ? isCsCalledInPerson : 'All'
      },
      cases: cases
    };
    
    res.generalResponse('Report generated successfully!', reportData);
  });

}

export default ReportService;
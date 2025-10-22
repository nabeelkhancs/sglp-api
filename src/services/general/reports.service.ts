import { Request, Response } from 'express';
import asyncHandler from '../../common/asyncHandler';
import ReportRepository from '../../repositories/general/ReportRepository';
import { Op, fn, literal, where as seqWhere } from 'sequelize';

class ReportService {

  static generateReport = asyncHandler(async (req: Request, res: Response) => {
    console.log("Generating report with data:", req.body);
    
    const { caseTypes, year, months, reportSections, isDirectionCase, isCsCalledInPerson } = req.body;
    
    // Prepare filters object for raw query
    const filters: any = {};
    
    // Handle multiple case types
    if (caseTypes && Array.isArray(caseTypes) && caseTypes.length > 0) {
      filters.caseTypes = caseTypes;
    }

    // Handle report sections filtering
    if (reportSections) {
      const subjectFilters: string[] = [];
      const statusFilters: string[] = [];
      
      // Process each report section
      Object.entries(reportSections).forEach(([sectionKey, sectionConfig]: [string, any]) => {
        if (sectionConfig.enabled) {
          if (sectionConfig.filterType === 'subjectData') {
            // Map section keys to subjectOfApplication values (using exact database values)
            switch (sectionKey) {
              case 'contemptApplication':
                subjectFilters.push('contemptApplication');
                break;
              case 'committee':
                subjectFilters.push('committee');
                break;
              case 'inquiryReport':
                subjectFilters.push('inquiryReport');
                break;
            }
          } else if (sectionConfig.filterType === 'statusData') {
            // Map section keys to caseStatus values (using exact database values)
            switch (sectionKey) {
              case 'underCompliance':
                statusFilters.push('underCompliance');
                break;
              case 'csCalledInPerson':
                statusFilters.push('csCalledInPerson');
                break;
              case 'direction':
                statusFilters.push('direction');
                break;
            }
          }
        }
      });
      
      // Add subject filters if any
      if (subjectFilters.length > 0) {
        filters.subjectOfApplication = subjectFilters;
        console.log("Applied subject filters:", subjectFilters);
      }
      
      // Add status filters if any
      if (statusFilters.length > 0) {
        filters.statusesToCheck = statusFilters;
        console.log("Applied status filters:", statusFilters);
      }
    }
    
    // Legacy support for isDirectionCase and isCsCalledInPerson
    if (!reportSections) {
      const statusesToCheck = [];
      if (isDirectionCase === true) {
        statusesToCheck.push('Direction');
      }
      if (isCsCalledInPerson === true) {
        statusesToCheck.push('CS Called in Person');
      }
      
      if (statusesToCheck.length > 0) {
        filters.statusesToCheck = statusesToCheck;
      }
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
        caseTypes: caseTypes || 'All',
        year: year || 'All',
        months: months || 'All',
        reportSections: reportSections || 'All',
        isDirectionCase: isDirectionCase !== undefined ? isDirectionCase : 'All',
        isCsCalledInPerson: isCsCalledInPerson !== undefined ? isCsCalledInPerson : 'All'
      },
      cases: cases
    };
    
    res.generalResponse('Report generated successfully!', reportData);
  });

}

export default ReportService;
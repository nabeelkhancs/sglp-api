import Cases from '../../models/Case';
import { QueryTypes } from 'sequelize';
import SequelizeClass from '../../../database/sequelize';

class ReportRepository {
  static async getCasesByFilters(filters: any) {
    try {
      const sequelize = SequelizeClass.getInstance().sequelize;
      
      let query = `
        SELECT * FROM cases 
        WHERE "isDeleted" = false
      `;
      
      const replacements: any = {};
      
      // Add filters dynamically
      if (filters.caseType) {
        query += ` AND "caseType" = :caseType`;
        replacements.caseType = filters.caseType;
      }
      
      // Check if caseStatus array contains specific statuses
      if (filters.statusesToCheck && filters.statusesToCheck.length > 0) {
        query += ` AND "caseStatus" && :statusesToCheck`;
        replacements.statusesToCheck = filters.statusesToCheck;
      }
      
      // Date filters
      if (filters.startDate && filters.endDate) {
        query += ` AND "createdAt" BETWEEN :startDate AND :endDate`;
        replacements.startDate = filters.startDate;
        replacements.endDate = filters.endDate;
      }
      
      // Month filters (for months only without year)
      if (filters.monthNumbers && filters.monthNumbers.length > 0) {
        query += ` AND EXTRACT(MONTH FROM "createdAt") = ANY(:monthNumbers)`;
        replacements.monthNumbers = filters.monthNumbers;
      }
      
      // Multiple month-year combinations
      if (filters.monthYearConditions && filters.monthYearConditions.length > 0) {
        const monthYearParts = filters.monthYearConditions.map((_: any, index: number) => 
          `("createdAt" BETWEEN :startDate${index} AND :endDate${index})`
        ).join(' OR ');
        query += ` AND (${monthYearParts})`;
        
        filters.monthYearConditions.forEach((condition: any, index: number) => {
          replacements[`startDate${index}`] = condition.startDate;
          replacements[`endDate${index}`] = condition.endDate;
        });
      }
      
      query += ` ORDER BY "createdAt" DESC`;
      
      console.log('Raw Query:', query);
      console.log('Replacements:', replacements);
      
      return await sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements
      });
    } catch (error) {
      console.error('Error in ReportRepository.getCasesByFilters:', error);
      throw error;
    }
  }

  static async getCasesCount(whereConditions: any) {
    try {
      return await Cases.count({
        where: whereConditions
      });
    } catch (error) {
      console.error('Error in ReportRepository.getCasesCount:', error);
      throw error;
    }
  }
}

export default ReportRepository;
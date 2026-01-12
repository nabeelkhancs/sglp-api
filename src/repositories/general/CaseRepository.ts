import Cases from "../../models/Case";
import { Op } from "sequelize";
import { ICases } from "../../models/interfaces";
import { AuditLogs } from "../../models";

class CaseRepository {

  async findByCaseNumber(caseNumber: string): Promise<Cases | null> {
    try {
      const caseRecord = await Cases.findOne({
        where: { caseNumber, isDeleted: false },
      });
      return caseRecord;
    } catch (error) {
      console.error("Error finding case by number:", error);
      throw new Error("Could not find case by number");
    }
  }

  static async findByCpNumber(cpNumber: string): Promise<Cases | null> {
    try {
      const caseRecord = await Cases.findOne({
        where: { cpNumber, isDeleted: false },
      });
      return caseRecord;
    } catch (error) {
      console.error("Error finding case by CP number:", error);
      throw new Error("Could not find case by CP number");
    }
  }

  static async createCase(caseData: Omit<ICases, 'id'>): Promise<Cases> {
    try {
      // Optionally, validate required fields here
      const newCase = await Cases.create(caseData);
      return newCase;
    } catch (error) {
      console.error("Error creating case:", error);
      throw new Error("Could not create case");
    }
  }

  static async updateCase(id: number, caseData: Partial<ICases>): Promise<Cases | null> {
    try {
      const caseRecord = await Cases.findByPk(id);

      if (!caseRecord) {
        throw new Error("Case not found");
      }

      if (caseData.uploadedFiles && Array.isArray(caseData.uploadedFiles)) {
        const existingFiles = (caseRecord as any).uploadedFiles || [];
        const newFiles = caseData.uploadedFiles;

        const mergedFiles = [...new Set([...existingFiles, ...newFiles])];
        caseData.uploadedFiles = mergedFiles;
      }

      const updatedCase = await caseRecord.update(caseData);
      return updatedCase;
    } catch (error) {
      console.error("Error updating case:", error);
      throw new Error("Could not update case");
    }
  }

  static async deleteCase(id: number): Promise<void> {
    try {
      const caseRecord = await Cases.findByPk(id);
      if (!caseRecord) {
        throw new Error("Case not found");
      }
      await caseRecord.update({ isDeleted: true });
    } catch (error) {
      console.error("Error deleting case:", error);
      throw new Error("Could not delete case");
    }
  }

  static async getCaseById(id: number): Promise<Cases | null> {
    try {
      const caseRecord = await Cases.findOne({
        where: { id, isDeleted: false }
      });
      if (!caseRecord) {
        throw new Error("Case not found");
      }
      return caseRecord;
    } catch (error) {
      console.error("Error fetching case by ID:", error);
      throw new Error("Could not fetch case by ID");
    }
  }

  static async getCases(
    pageNumber: number = 1,
    pageSize: number = 10,
    filters = {},
  ): Promise<{ rows: Cases[]; count: number }> {
    try {
      const offset = (pageNumber - 1) * pageSize;
      const whereFilters: any = { ...filters, isDeleted: false };

      if ('caseStatus' in filters && filters.caseStatus !== undefined) {
        if (typeof filters.caseStatus === 'string' && filters.caseStatus.trim() !== '') {
          whereFilters.caseStatus = { [Op.contains]: [filters.caseStatus] };
        } else if (Array.isArray(filters.caseStatus)) {
          whereFilters.caseStatus = { [Op.contains]: filters.caseStatus };
        } else {
          delete whereFilters.caseStatus;
        }
      }
      // console.log("Where Filters:", whereFilters);
      const { count, rows } = await Cases.findAndCountAll({
        where: whereFilters,
        limit: pageSize,
        offset: offset,
        order: [['updatedAt', 'DESC']],
      });
      return { rows, count };
    } catch (error) {
      console.error("Error fetching cases:", error);
      throw new Error("Could not fetch cases");
    }
  }

  static async getCaseByNumber(caseNumber: string): Promise<Cases | null> {
    try {
      const caseRecord = await Cases.findOne({
        where: { caseNumber },
      });
      return caseRecord;
    } catch (error) {
      console.error("Error fetching case by number:", error);
      throw new Error("Could not fetch case by number");
    }
  }

  static async getDashboardCases() {
    try {
      const cases = await Cases.findAll({
        attributes: [
          'subjectOfApplication',
          'caseStatus',
          'court',
          'region',
          'createdAt',
          'dateOfHearing'
        ],
        where: { isDeleted: false },
        order: [['createdAt', 'DESC']]
      });
      return cases;
    } catch (error) {
      console.error('Error fetching dashboard cases:', error);
      throw new Error('Could not fetch dashboard cases');
    }
  }

  static async getCourtsCount(filters: any): Promise<any> {
    try {
      const whereClause: any = { isDeleted: false };

      let groupFields = ['court'];

      if (filters.court === "registry") {
        groupFields = ['registry'];
      }
      else if (filters.court && filters.court.toLowerCase().includes("highcourt")) {
        const highCourts = [
          'sindhHighCourtKarachi',
          'sindhHighCourtHyderabad',
          'sindhHighCourtSukkur',
          'sindhHighCourtLarkana',
          'sindhHighCourtMirpurkhas'
        ];
        whereClause.court = { [Op.in]: highCourts };
      }
      else if (filters.court === "districtcourt") {
        groupFields = ['region'];
        whereClause.court = 'districtCourts';
      }
      else if (filters.court === "othercourts") {
        // Exclude supreme, high, and district courts
        const excludeCourts = [
          'supremeCourtOfPakistan',
          'sindhHighCourtKarachi',
          'sindhHighCourtHyderabad',
          'sindhHighCourtSukkur',
          'sindhHighCourtLarkana',
          'sindhHighCourtMirpurkhas',
          'districtCourts'
        ];
        whereClause.court = { [Op.notIn]: excludeCourts };
      }
      else if (filters.court && filters.court !== "registry") {
        whereClause.court = filters.court;
      }

      const attributes = [
        ...groupFields,
        [Cases.sequelize!.fn('COUNT', Cases.sequelize!.col('id')), 'count'] as [any, string]
      ];
      const result = await Cases.findAll({
        attributes,
        where: whereClause,
        group: groupFields,
      });
      return result;
    } catch (error) {
      console.error("Error fetching courts count:", error);
      throw new Error("Could not fetch courts count");
    }
  }

  static async searchCases(queryString: string, pageNumber: number = 1, pageSize: number = 10): Promise<{ rows: Cases[]; count: number }> {
    try {

      const whereClause: any = { isDeleted: false };
      if (queryString) {
        whereClause[Op.or] = [
          { cpNumber: { [Op.like]: `%${queryString}%` } },
          { caseTitle: { [Op.like]: `%${queryString}%` } },
          { fileNumber: { [Op.like]: `%${queryString}%` } },
        ];
      }

      const { count, rows } = await Cases.findAndCountAll({
        where: whereClause,
        attributes: [
          'cpNumber',
          'caseNumber',
          'fileNumber',
          'caseTitle',
          'dateOfHearing',
          'dateReceived',
          'createdAt'
        ],
        // limit: pageSize,
        // offset: (pageNumber - 1) * pageSize,
        order: [['updatedAt', 'DESC']],
      });
      return { rows, count };
    } catch (error) {
      console.error("Error searching cases:", error);
      throw new Error("Could not search cases");
    }
  }

  static async getLogs(pageNumber: number = 1, pageSize: number = 10, cpNumber?: string): Promise<{ rows: any[]; count: number }> {
    try {
      const offset = (pageNumber - 1) * pageSize;
      const whereClause: any = { isDeleted: false };
      if (cpNumber) {
        whereClause.cpNumber = cpNumber;
      }

      // Import User model
      const User = (await import('../../models/Users')).default;
      const { count, rows } = await AuditLogs.findAndCountAll({
        where: whereClause,
        limit: pageSize,
        offset,
        order: [['createdAt', 'DESC']],
        attributes: [
          'id',
          'action',
          'cpNumber',
          'payload',
          'createdAt',
          'userId'
        ],
        include: [
          {
            model: User,
            attributes: ['name', 'govtID', 'roleType'],
            required: false,
            as: 'user'
          }
        ]
      });
      // Map results to flatten user info
      const mappedRows = rows.map((row: any) => {
        const json = row.toJSON();
        return {
          ...json,
          userName: json.user?.name || null,
          userGovtID: json.user?.govtID || null
        };
      });
      return { rows: mappedRows, count };
    } catch (error) {
      console.error("Error fetching logs:", error);
      throw new Error("Could not fetch logs");
    }
  }

  static async deleteCaseImage(id: any, imageIds: string[]) {
    try {
      const caseRecord = await Cases.findByPk(id);
      if (!caseRecord) {
        throw new Error("Case not found");
      }
      let uploadedFiles: string[] = Array.isArray((caseRecord as any).uploadedFiles)
        ? (caseRecord as any).uploadedFiles
        : [];
      uploadedFiles = uploadedFiles.filter((file: string) => !imageIds.includes(file));
      const res = await caseRecord.update({ uploadedFiles });
      return res;
    } catch (error) {
      console.error("Error deleting case image:", error);
      throw new Error("Could not delete case image");
    }
  }

  static async calendarViewCases(startDate: string, endDate: string) {
    try {
      const cases = await Cases.findAll({
        where: {
          dateOfHearing: {
            [Op.between]: [startDate, endDate]
          }
        },
        attributes: [
          'id',
          'caseTitle',
          'dateOfHearing',
          'cpNumber',
          'caseStatus',
          'caseType',
          'subjectOfApplication'
        ]
      });
      return cases;
    } catch (error) {
      console.error("Error fetching calendar view cases:", error);
      throw new Error("Could not fetch calendar view cases");
    }
  }

  static async noticeBoardCases() {
    try {
      const today = new Date();
      const fifteenDaysLater = new Date();
      fifteenDaysLater.setDate(today.getDate() + 15);

      const cases = await Cases.findAll({
        where: {
          isDeleted: false,
          [Op.or]: [
            {
              dateOfHearing: {
                [Op.between]: [today, fifteenDaysLater]
              }
            }
          ]
        },
        attributes: [
          'id',
          'caseTitle',
          'dateOfHearing',
          'dateReceived',
          'createdAt',
          'cpNumber',
          'caseStatus',
          'caseType',
          'subjectOfApplication'
        ]
      });

      // Add highlighting logic for each case
      const highlightedCases = cases.map((caseItem: any) => {
        const caseJson = caseItem.toJSON();
        const currentDate = new Date();
        const hearingDate = new Date(caseJson.dateOfHearing);
        const daysDiff = Math.ceil((hearingDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
        
        // Determine highlight reasons
        const highlightReasons = [];
        let priorityLevel = 'normal'; // normal, medium, high, critical
        
        if (caseJson.isUrgent) {
          highlightReasons.push('urgent');
          priorityLevel = 'critical';
        }
        
        if (caseJson.isCsCalledInPerson) {
          highlightReasons.push('csCalledInPerson');
          if (priorityLevel === 'normal') priorityLevel = 'high';
        }
        
        if (caseJson.dateOfHearing && daysDiff <= 15 && daysDiff >= 0) {
          highlightReasons.push('upcomingHearing');
          if (daysDiff <= 7) {
            highlightReasons.push('urgentHearing');
            if (priorityLevel === 'normal') priorityLevel = 'medium';
          }
          if (daysDiff <= 3) {
            priorityLevel = 'high';
          }
        }
        
        return {
          ...caseJson,
          isHighlighted: highlightReasons.length > 0,
          highlightReasons,
          priorityLevel,
          daysUntilHearing: caseJson.dateOfHearing ? daysDiff : null
        };
      });

      return highlightedCases;
    } catch (error) {
      console.error("Error fetching notice board cases:", error);
      throw new Error("Could not fetch notice board cases");
    }
  }

  static async reportCases(filters: any): Promise<any> {
    try {
      const whereClause: any = { isDeleted: false };
      if (filters.startDate) {
        whereClause.dateReceived = { [Op.gte]: new Date(filters.startDate) };
      }
      if (filters.endDate) {
        whereClause.dateReceived = whereClause.dateReceived || {};
        whereClause.dateReceived[Op.lte] = new Date(filters.endDate);
      }
      if (filters.caseStatus) {
        whereClause.caseStatus = filters.caseStatus;
      }
      if (filters.court) {
        whereClause.court = filters.court;
      }
      if (filters.region) {
        whereClause.region = filters.region;
      }

      const { literal } = require('sequelize');
      const cases = await Cases.findAll({
        where: whereClause,
        attributes: [
          'id',
          'cpNumber',
          'fileNumber',
          'caseTitle',
          'caseType',
          'court',
          'region',
          'dateReceived',
          'dateOfHearing',
          'caseStatus',
          'relativeDepartment',
          'subjectOfApplication',
          'caseRemarks'
        ]
      });

      return cases;
    } catch (error) {
      console.error("Error fetching report cases:", error);
      throw new Error("Could not fetch report cases");
    }
  }
}

export default CaseRepository;
import Cases from "../../models/Case";
import { Op } from "sequelize";
import { ICases } from "../../models/interfaces";

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
            console.log("Where Filters:", whereFilters);
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
}

export default CaseRepository;
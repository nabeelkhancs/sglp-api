import Committee from "../../models/Committee";
import { ICommittee } from "../../models/interfaces";

class CommitteeRepository {
  async findByCpNumber(cpNumber: string): Promise<Committee | null> {
    try {
      const committeeRecord = await Committee.findOne({
        where: { cpNumber, isDeleted: false },
      });
      return committeeRecord;
    } catch (error) {
      console.error("Error finding committee by cpNumber:", error);
      throw new Error("Could not find committee by cpNumber");
    }
  }

  static async createCommittee(committeeData: Omit<ICommittee, 'id'>): Promise<Committee> {
    try {
      const newCommittee = await Committee.create(committeeData);
      return newCommittee;
    } catch (error) {
      console.error("Error creating committee:", error);
      throw new Error("Could not create committee");
    }
  }

  static async updateCommittee(id: number, committeeData: Partial<ICommittee>): Promise<Committee | null> {
    try {
      const committeeRecord = await Committee.findByPk(id);
      if (!committeeRecord) {
        throw new Error("Committee not found");
      }
      const updatedCommittee = await committeeRecord.update(committeeData);
      return updatedCommittee;
    } catch (error) {
      console.error("Error updating committee:", error);
      throw new Error("Could not update committee");
    }
  }

  static async deleteCommittee(id: number): Promise<void> {
    try {
      const committeeRecord = await Committee.findByPk(id);
      if (!committeeRecord) {
        throw new Error("Committee not found");
      }
      await committeeRecord.update({ isDeleted: true });
    } catch (error) {
      console.error("Error deleting committee:", error);
      throw new Error("Could not delete committee");
    }
  }

  static async getCommitteeById(id: number): Promise<Committee | null> {
    try {
      const committeeRecord = await Committee.findOne({
        where: { id, isDeleted: false }
      });
      if (!committeeRecord) {
        throw new Error("Committee not found");
      }
      return committeeRecord;
    } catch (error) {
      console.error("Error fetching committee by ID:", error);
      throw new Error("Could not fetch committee by ID");
    }
  }

  static async getCommittees(pageNumber: number = 1, pageSize: number = 10, filters = {}): Promise<{ rows: Committee[]; count: number }> {
    try {
      const offset = (pageNumber - 1) * pageSize;
      const { count, rows } = await Committee.findAndCountAll({
        where: {
          ...filters,
          isDeleted: false
        },
        limit: pageSize,
        offset: offset,
        order: [['updatedAt', 'DESC']],
      });
      return { rows, count };
    } catch (error) {
      console.error("Error fetching committees:", error);
      throw new Error("Could not fetch committees");
    }
  }

  static async getCommitteeByCpNumber(cpNumber: string): Promise<Committee | null> {
    try {
      const committeeRecord = await Committee.findOne({
        where: { cpNumber },
      });
      return committeeRecord;
    } catch (error) {
      console.error("Error fetching committee by cpNumber:", error);
      throw new Error("Could not fetch committee by cpNumber");
    }
  }

  static async deleteCommitteeImage(id: any, imageIds: string[]) {
    try {
      const committeeRecord: any = await Committee.findByPk(id);
      console.log("Committee record fetched for image deletion:", committeeRecord);
      if (!committeeRecord) {
        throw new Error("Committee not found");
      }
      let uploadedFiles: string[] = Array.isArray((committeeRecord as any).uploadedFiles)
        ? (committeeRecord as any).uploadedFiles
        : [];
      uploadedFiles = uploadedFiles.filter((file: string) => !imageIds.includes(file));
      console.log("Updated uploadedFiles after deletion:", uploadedFiles);
      committeeRecord.uploadedFiles = uploadedFiles;

      const res = await committeeRecord.save();
      // const res = await committeeRecord.update({ uploadedFiles });
      console.log("Committee record after image deletion:", res);
      return res;
    } catch (error) {
      console.error("Error deleting committee image:", error);
      throw new Error("Could not delete committee image");
    }
  }
}

export default CommitteeRepository;
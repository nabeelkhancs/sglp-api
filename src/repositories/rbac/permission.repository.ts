import Paginate from '../../common/paginate';
import { ErrorResponse } from '../../middlewares/errorHandler';
import { Permissions } from '../../models';
import { IPermissions, IRolePage, PageParams } from '../../models/interfaces';
import RolePageRepository from './rolePage.repository';

class PermissionsRepository {
  static async createPermission(data: IPermissions): Promise<any> {
    return Permissions.create(data);
  }

  static async bulkCreatePermission(data: IPermissions[]): Promise<any> {
    return Permissions.bulkCreate(data);
  }

  static async getPermissionById(id: number): Promise<any | null> {
    return Permissions.findByPk(id);
  }


  static async getPermission(obj: Partial<IPermissions> & PageParams): Promise<any> {
    const { pageNumber, pageSize, ...otherParams } = obj
    return Paginate(Permissions, pageNumber, pageSize, otherParams)
  }

  static async updatePermission(id: number, data: Partial<IPermissions>): Promise<any | null> {
    const module = await Permissions.findByPk(id);

    if (!module) {
      throw new ErrorResponse('Permission not found');
    }

    return module.update(data);
  }


  static async deletePermissionsByRoleId(roleIdToDelete: number) {
    // Find RolePages records with the roleId to delete
    const rolePages = await RolePageRepository.getRolePage({
      roleId: roleIdToDelete
    });

    // Extract rolePageIds from the found RolePages records
    const rolePageIds = rolePages.records.map((rolePage: IRolePage) => rolePage.id);

    // Delete Permissions records based on roleId and associated rolePageIds
    return Permissions.destroy({
      where: {
        rolePageId: rolePageIds
      }
    })
  }

  static async deletePermission(obj: Partial<IPermissions>): Promise<void> {
    await Permissions.destroy({
      where: { ...obj }
    });
  }
}

export default PermissionsRepository;

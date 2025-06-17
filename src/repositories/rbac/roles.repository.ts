import { ErrorResponse } from '../../middlewares/errorHandler';
import { Roles } from '../../models';
import { IRoles, PageParams } from '../../models/interfaces';
import Paginate from '../../common/paginate';
import RolePages from '../../models/RolePage';

class RoleRepository {
  static async createRole(data: IRoles) {
    return Roles.create(data)
  }

  static async getRoleById(roleId: number): Promise<any | null> {
    return Roles.findByPk(roleId);
  }

  static async getRole(obj: Partial<IRoles> & PageParams): Promise<any> {
    const { pageNumber, pageSize, ...otherParams } = obj
    let attributes = ['id', 'name', 'type', 'description', 'createdAt', 'updatedAt']
    const include = [
      {
        model: RolePages,
      }
    ]

    return Paginate(Roles, pageNumber, pageSize, otherParams, include, attributes)
  }

  static async updateRole(roleId: number, data: Partial<IRoles>): Promise<any | null> {
    const role = await Roles.findByPk(roleId);
    if (!role) {
      throw new ErrorResponse('role not found');
    }
    if (role.dataValues.isDeleted) {
      throw new ErrorResponse('role already deleted');
    }
    return role.update(data);
  }

  static async deletePage(roleId: number): Promise<void> {
    const role = await Roles.findByPk(roleId);
    if (role) {
      await role.destroy();
    }
  }
}

export default RoleRepository;
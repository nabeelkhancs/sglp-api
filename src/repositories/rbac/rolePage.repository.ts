import { ErrorResponse } from '../../middlewares/errorHandler';
import { IRolePage, PageParams } from '../../models/interfaces';
import Paginate from '../../common/paginate';
import RolePages from '../../models/RolePage';
import { Pages, Permissions } from '../../models';

class RolePageRepository {
  static async createRolePage(data: IRolePage): Promise<any> {
    return RolePages.create(data)
  }

  static async bulkCreateRolePage(data: IRolePage[]): Promise<any> {
    return RolePages.bulkCreate(data)
  }

  static async getRolePageById(roleId: number): Promise<any | null> {
    return RolePages.findByPk(roleId);
  }

  static async getRolePage(obj: Partial<IRolePage> & PageParams): Promise<any> {
    const { pageNumber, pageSize, ...otherParams } = obj
    const include = [
      {
        model: Pages,
        attributes: ['moduleId']
      },
      {
        model: Permissions,
        attributes: ["actionId"]
      }
    ]
    return Paginate(RolePages, pageNumber, pageSize, otherParams, include, [], false, true)
  }


  static async updateRolePage(roleId: number, data: Partial<IRolePage>): Promise<any | null> {
    const role = await RolePages.findByPk(roleId);
    if (!role) {
      throw new ErrorResponse('role page not found');
    }

    return role.update(data);
  }

  static async deleteRolePage(obj: Partial<IRolePage>) {
    return RolePages.destroy({
      where: { ...obj }
    })
  }
}

export default RolePageRepository;
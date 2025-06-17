import { Actions, Pages, Permissions } from '../../models';
import RolePages from '../../models/RolePage';

class PermissionsService {
  static async getPermissionsByRole(roleId: number): Promise<any> {
    try {
      const permissions = await RolePages.findAll({
        where: { roleId },
        include: [
          {
            model: Pages
          },
          {
            model: Permissions,
            include: [
              {
                model: Actions
              }
            ]
          },
        ]
      });
      return permissions;
    } catch (error) {
      console.error("Error fetching permissions:", error);
      throw new Error('Failed to fetch permissions');
    }
  }

  static async createPermission(rolePageId: number, userId: number, actionId: number): Promise<any> {
    try {
      const permission = await Permissions.create({ rolePageId, userId, actionId });
      return permission;
    } catch (error) {
      console.error("Error creating permission:", error);
      throw new Error('Failed to create permission');
    }
  }

  static async deletePermission(permissionId: number): Promise<any> {
    try {
      // const deletedRows = await Permissions.destroy({ where: { id: permissionId } });
      // if (deletedRows === 0) {
      //     throw new Error('Permission not found');
      // }
      return { success: true };
    } catch (error) {
      console.error("Error deleting permission:", error);
      throw new Error('Failed to delete permission');
    }
  }
}

export default PermissionsService;

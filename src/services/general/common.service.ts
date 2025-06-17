import PermissionsService from '../rbac/permissions.service';

class CommonService {
  static async getPageActionsByRole(roleId: number, pageLabel: string) {
    const permissions = await PermissionsService.getPermissionsByRole(roleId);
    const pagePermission = permissions.find(
      (perm: any) => perm.Page && perm.Page.label === pageLabel
    );
    let actions: string[] = [];
    if (pagePermission && Array.isArray(pagePermission.Permissions)) {
      actions = pagePermission.Permissions.map((p: any) => p.Action?.name).filter(Boolean);
    }
    return actions;
  }
}

export default CommonService;

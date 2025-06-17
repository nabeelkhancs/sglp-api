import { Request, Response } from 'express';
import asyncHandler from '../../common/asyncHandler';
import RolesRepository from '../../repositories/rbac/roles.repository';
import PagesRepository from '../../repositories/rbac/pages.repository';
import { IRolePage } from '../../models/interfaces';
import { ErrorResponse } from '../../middlewares/errorHandler';
import ActionsRepository from '../../repositories/rbac/actions.repository';
import RolePageRepository from '../../repositories/rbac/rolePage.repository';
import PermissionsRepository from '../../repositories/rbac/permission.repository';

interface IPermission {
  pageId: number;
  actionId: number
}


class RolesService {

  static createRole = asyncHandler(async (req: Request, res: Response) => {
    const { permissions, ...roleData } = req.body;

    let pageIds: number[] = permissions.map((elem: IPermission) => elem.pageId)
    pageIds = [...new Set(pageIds)];

    let actionIds = permissions.map((elem: IPermission) => elem.actionId)
    actionIds = [...new Set(actionIds)]

    const pages = await PagesRepository.getPagesByIds(pageIds)
    console.log("pages ===>", pages.length)
    console.log("pageIds ===>", pageIds)
    if (pages.length !== pageIds.length) {
      throw new ErrorResponse('Page Ids are not correct !!')
    }

    const actions = await ActionsRepository.getAction({ id: actionIds })


    if (actions.totalRecords < actionIds.length) {
      throw new ErrorResponse('Action Ids are not correct')
    }

    const role = await RolesRepository.createRole(roleData)

    const rolePagePayload = pageIds.map(elem => ({ pageId: elem, roleId: Number(role.dataValues.id) }))

    const rolePage = await RolePageRepository.bulkCreateRolePage(rolePagePayload);


    const permissionPayload = rolePage.map((elem: IRolePage) => {
      const find = permissions.find((item: IPermission) => elem.pageId == item.pageId)

      return {
        rolePageId: elem.id,
        actionId: find?.actionId
      }
    })


    await PermissionsRepository.bulkCreatePermission(permissionPayload)

    res.generalResponse("Role created successfuly");
  });

  static getRole = asyncHandler(async (req: Request, res: Response) => {
    const parsedQuery = req.query;

    let result = await RolesRepository.getRole(parsedQuery);


    const results = result.records.map((elem: any) => {
      const data = { ...elem.dataValues }
      delete data.RolePages

      // const pages = elem.RolePages.map((obj: any) => obj.Page)

      return {
        ...data,
        // pages: pages
      }

    })


    res.generalResponse("Data fetch successfuly!!", results);
  })

  static getRoleById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    let result = await RolesRepository.getRoleById(Number(id));
    let rolePages = await RolePageRepository.getRolePage({ roleId: result?.id })
    rolePages = rolePages?.records?.map((rp: any) => {
      let data = {
        ...rp,
        moduleId: rp["Page.moduleId"],
        actionId: rp["Permissions.actionId"]
      }
      delete data["Page.moduleId"]
      delete data["Permissions.actionId"]
      delete data?.createdAt
      delete data?.updatedAt
      return data
    })

    rolePages = rolePages.map((checked: any) => {
      return checked?.moduleId + "_" + checked?.pageId + "_" + checked?.actionId
    })

    let finalData = {
      id: result?.dataValues?.id,
      name: result?.dataValues?.name,
      description: result?.dataValues?.description,
      permissions: rolePages
    }
    res.generalResponse("Data fetch successfuly!!", finalData);
  })

  static updateRole = asyncHandler(async (req: Request, res: Response) => {
    const { id, data } = req.body;
    const { permissions, ...roleData } = data


    const isRole = await RolesRepository.getRoleById(id)

    if (!isRole) {
      throw new ErrorResponse('Role not found')
    }


    let pageIds: number[] = permissions.map((elem: IPermission) => elem.pageId)

    let actionIds = permissions.map((elem: IPermission) => elem.actionId)
    actionIds = [...new Set(actionIds)]
    pageIds = [...new Set(pageIds)]


    const pages = await PagesRepository.getPage({ id: pageIds })


    if (pages.totalRecords < pageIds.length) {
      throw new ErrorResponse('Page Ids are not correct')
    }

    const actions = await ActionsRepository.getAction({ id: actionIds })

    if (actions.totalRecords < actionIds.length) {
      throw new ErrorResponse('Action Ids are not correct')
    }

    // deleting role page
    await PermissionsRepository.deletePermissionsByRoleId(id)

    // deleting permissions
    await RolePageRepository.deleteRolePage({ roleId: id })

    // updating role table
    const role = await RolesRepository.updateRole(id, roleData)

    const rolePagePayload = pageIds.map(elem => ({ pageId: elem, roleId: Number(role.dataValues.id) }))

    // creating role page 
    const rolePage = await RolePageRepository.bulkCreateRolePage(rolePagePayload);

    const permissionPayload = permissions.map((elem: IPermission) => {
      const find = rolePage.find((item: IRolePage) => elem.pageId == item.pageId)

      return {
        rolePageId: find.id,
        actionId: elem?.actionId
      }
    })

    const permission = await PermissionsRepository.bulkCreatePermission(permissionPayload)

    res.generalResponse("Role updated successfuly", permission);
  })

  static deleteRole = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    await RolesRepository.updateRole(Number(id), { isDeleted: true });
    res.generalResponse("Role deleted successfuly!!");
  })

}

export default RolesService;

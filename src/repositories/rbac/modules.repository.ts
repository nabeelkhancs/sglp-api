import Paginate from '../../common/paginate';
import { ErrorResponse } from '../../middlewares/errorHandler';
import { Actions, Modules, Pages, Permissions } from '../../models';
import RolePages from '../../models/RolePage';
import { IModules, PageParams } from '../../models/interfaces';

class ModulesRepository {
  static async createModule(moduleData: IModules): Promise<any> {
    return Modules.create(moduleData);
  }

  static async getModuleById(moduleId: number): Promise<any | null> {
    return Modules.findByPk(moduleId);
  }

  static async getModule(obj: Partial<IModules> & PageParams): Promise<any> {
    const { pageNumber = 1, pageSize = 10, ...otherParams } = obj

    return Paginate(Modules, Number(pageNumber), Number(pageSize), otherParams,)
  }

  static async getAllModule(obj: Partial<IModules> & PageParams): Promise<any> {
    const { pageNumber = 1, pageSize = 10, ...otherParams } = obj

    const include = [
      {
        model: Pages,
        attributes: ['id', 'label', 'icon',],
        where: { isDeleted: false }
      }
    ]

    let attributes = ['id', 'label', 'icon', 'hasChild']
    let result: any = await Paginate(Modules, Number(pageNumber), Number(pageSize), otherParams, include, attributes)

    let actions = await this.getActions();

    return { records: result?.records, actions }
  }


  static async getMyPermissions(roleId: Number): Promise<any> {
    const pageNumber = 1, pageSize = 10


    const include = [
      {
        model: Pages,
        attributes: ['label', 'icon', 'url'],
        include: [
          {
            model: RolePages,
            where: {
              roleId
            },
            include: [
              {
                model: Permissions,
                include: [
                  {
                    model: Actions,
                    attributes: ['name', 'id'],
                  }
                ]
              }
            ]
          }
        ]
      }
    ]


    let attributes = ['id', 'label', 'icon', 'hasChild', 'url', 'order']
    let result: any = await Paginate(Modules, Number(pageNumber), Number(pageSize), {}, include, attributes)

    const data: any = []

    result.records.forEach((module: any) => {
      const { Pages, ...other } = module
      const obj = { ...other.dataValues, pages: [] }

      Pages.forEach((page: any) => {
        const action = page.dataValues.RolePages[0].dataValues.Permissions[0].dataValues.Action.dataValues

        delete page.dataValues.RolePages
        obj.pages.push({
          ...page.dataValues,
          action
        })
      })

      delete obj.Pages
      data.push(obj)

    })

    return { records: data }
  }


  static async updateModule(moduleId: number, moduleData: Partial<IModules>): Promise<any | null> {
    const module = await Modules.findByPk(moduleId);

    if (!module) {
      throw new ErrorResponse('Module not found');
    }
    if (module.dataValues.isDeleted) {
      throw new ErrorResponse('Module already deleted');
    }
    return module.update(moduleData);
  }

  static async deleteModule(moduleId: number): Promise<void> {
    const module = await Modules.findByPk(moduleId);
    if (module) {
      await module.destroy();
    }
  }

  static async getActions(): Promise<any> {
    const actions = await Actions.findAll({
      attributes: ['id', 'name']
    });
    return actions;
  }
}

export default ModulesRepository;

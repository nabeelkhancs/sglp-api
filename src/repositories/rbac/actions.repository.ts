import Paginate from '../../common/paginate';
import { ErrorResponse } from '../../middlewares/errorHandler';
import { Actions } from '../../models';
import { IActions, PageParams } from '../../models/interfaces';

class ActionsRepository {
  static async createAction(data: IActions): Promise<any> {
    return Actions.create(data);
  }

  static async getActionById(id: number): Promise<any | null> {
    return Actions.findByPk(id);
  }


  static async getAction(obj: Partial<IActions> & PageParams): Promise<any> {
    const { pageNumber, pageSize, ...otherParams } = obj
    return Paginate(Actions, pageNumber, pageSize, otherParams)
  }

  static async updateAction(id: number, data: Partial<IActions>): Promise<any | null> {
    const module = await Actions.findByPk(id);

    if (!module) {
      throw new ErrorResponse('Action not found');
    }
    if (module.dataValues.isDeleted) {
      throw new ErrorResponse('Action already deleted');
    }
    return module.update(data);
  }

  static async deleteAction(id: number): Promise<void> {
    const module = await Actions.findByPk(id);
    await module?.destroy();
  }
}

export default ActionsRepository;

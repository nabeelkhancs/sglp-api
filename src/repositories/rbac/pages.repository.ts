import { Op } from 'sequelize';
import Paginate from '../../common/paginate';
import { ErrorResponse } from '../../middlewares/errorHandler';
import { Pages } from '../../models';
import { IPages, PageParams } from '../../models/interfaces';

class PagesRepository {
  static async createPage(pageData: IPages): Promise<any> {
    return Pages.create(pageData);
  }

  static async getPageById(moduleId: number): Promise<any | null> {
    return Pages.findByPk(moduleId);
  }

  static async getPage(obj: Partial<IPages> & PageParams): Promise<any> {
    const { pageNumber = 1, pageSize = 10, ...otherParams } = obj
    return Paginate(Pages, pageNumber, pageSize, otherParams)
  }
  
  static async getPagesByIds(ids: number[]): Promise<any> {
    // console.log("ids in pag", ids)
    return Pages.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    })
  }

  static async updatePage(pageId: number, pageData: Partial<IPages>): Promise<any | null> {
    const page = await Pages.findByPk(pageId);
    if (!page) {
      throw new ErrorResponse('Page not found');
    }
    if (page.dataValues.isDeleted) {
      throw new ErrorResponse('Page already deleted');
    }
    return page.update(pageData);
  }

  static async deletePage(pageId: number): Promise<void> {
    const page = await Pages.findByPk(pageId);
    if (!page) {
      throw new ErrorResponse('Page not found');
    }

    return await page.destroy();

  }
}

export default PagesRepository;
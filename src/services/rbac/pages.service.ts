import PagesRepository from '../../repositories/rbac/pages.repository';
import { IPages } from '../../models/interfaces';
import { Request, Response } from 'express';
import asyncHandler from '../../common/asyncHandler';
class PagesService {

  static createpage = asyncHandler(async (req: Request, res: Response) => {
    const pageData: IPages = req.body;
    const result: any = await PagesRepository.createPage({ ...pageData, order: Number(pageData.order) })
    res.generalResponse("Page add successfuly!!", result);
  });

  static getpage = asyncHandler(async (req: Request, res: Response) => {
    const parsedQuery = req.query;

    const result = await PagesRepository.getPage(parsedQuery);
    res.generalResponse("Data fetch successfuly!!", result);
  })

  static getpageById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await PagesRepository.getPageById(Number(id));
    res.generalResponse("Data fetch successfuly!!", result);
  })

  static updatepage = asyncHandler(async (req: Request, res: Response) => {
    const { id, data } = req.body
    const result = await PagesRepository.updatePage(id, data);
    res.generalResponse("Page updated successfuly!!", result);
  })

  static deletepage = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    // const result = await PagesRepository.updatePage(Number(id), { isDeleted: true });
    const result = await PagesRepository.deletePage(Number(id))
    console.log("deletepage", result);
    res.generalResponse("Page deleted successfuly!!", result);
  })

}

export default PagesService;

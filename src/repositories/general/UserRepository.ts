import Paginate from '../../common/paginate';
import { ErrorResponse } from '../../middlewares/errorHandler';
import { Actions, Modules, Pages, Permissions, Roles, User } from '../../models';
import RolePages from '../../models/RolePage';
import { PageParams, UsersAttributes } from '../../models/interfaces';
class UserRepository {

  //admin

  static async createUser(data: any): Promise<any> {
    return await User.create(data);
  }

  static async updateUser(id: number, data: any): Promise<any> {
    const user = await User.findOne({ where: { id } });

    if (!user) {
      throw new Error("User not found!");
    }

    let result = await user.update(data);
    result = await result.save();
    return result;
  }

  static async deleteUser(id: number): Promise<any> {
    const user: any | null = await User.findByPk(id)

    if (!user) {
      throw new ErrorResponse("User not found!");
    }
    if (user?.isDeleted) {
      throw new ErrorResponse("User is already deleted")
    }
    let result = await user.update({ isDeleted: true });
    result = await result.save();
    return result;
  }

  static async getUserById(id: number): Promise<any> {
    const user = await User.findOne({ where: { id } });

    if (!user) {
      throw new Error("User not found!");
    }

    return user;
  }

  static async getUsers(obj: Partial<UsersAttributes> & PageParams): Promise<any> {
    const { pageNumber, pageSize, ...otherParams } = obj
    // const include = []

    return Paginate(User, pageNumber, pageSize, otherParams)
  }
  
  static async getUsersWithoutAdmin(obj: Partial<UsersAttributes> & PageParams): Promise<any> {
    const { pageNumber, pageSize, ...otherParams } = obj
    // const include = []

    return Paginate(User, pageNumber, pageSize, otherParams)
  }


  static async findUserByEmail(email: string): Promise<any> {
    try {
      const user = await User.findOne({
        where: {
          email: email,
          isActive: true
        },
        include: [{
          model: Roles,
          attributes: ['type']
        }],
        raw: true
      });
      return user;
    } catch (error: any) {
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  }
  
  static async findUserByKey(key: string, value: string): Promise<any> {
    try {
      const user = await User.findOne({
        where: {
          [key]: value,
          isActive: true
        },
      });
      return user;
    } catch (error: any) {
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  }

  static async updateUserByEmail(email: string, data: any): Promise<any> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return null;
    }
    const expiryDate = new Date();
    const updateOTP = await user.update(
      {
        otp: data,
        otpExpiry: expiryDate
      })
    const updatedUser = await updateOTP.save();

    return updatedUser;
  }

  static async getMyPermissions(roleId: Number): Promise<any> {
    const pageNumber = 1, pageSize = 10


    const include = [
      {
        model: Pages,
        attributes: ['id', 'label', 'icon', 'url', 'order'],
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

    result = result.records.map((record: any) => ({
      id: record.id,
      label: record.label,
      icon: record.icon,
      hasChild: record.hasChild,
      order: record.order,
      link: "#",
      subItems: record.Pages.map((page: any) => ({
        id: page.id,
        label: page.label,
        icon: page.icon,
        order: page.order,
        actions: page.RolePages[0]?.Permissions.map((permission: any) => ({
          name: permission.Action.name,
          id: permission.Action.id
        })),
        link: page.url
      }))
    }));

    result = this.sortItems(result)
    // result.records.forEach((module: any) => {
    //   const { Pages, ...other } = module
    //   const obj = { ...other.dataValues, pages: [] }

    //   Pages.forEach((page: any) => {
    //     const action = page.dataValues.RolePages[0].dataValues.Permissions[0].dataValues.Action.dataValues

    //     delete page.dataValues.RolePages
    //     obj.pages.push({
    //       ...page.dataValues,
    //       action
    //     })
    //   })

    //   delete obj.Pages
    //   data.push(obj)

    // })

    // const sortedData = this.sortByOrder(data);
    // sortedData.forEach(item => {
    //   item.link = item.url == 'null' ? '#' : item.url
    //   if (item.pages && Array.isArray(item.pages)) {
    //     item.subItems = this.sortByOrder(item.pages).map(i => {
    //       i.link = i.url;
    //       delete i.url
    //       return i
    //     });
    //     delete item.pages
    //   }
    //   delete item.url;
    // });

    return { records: result }
  }

  //app
  static async getOtp(email: string): Promise<any> {

    const latestRecord = await User.findOne({
      where: { email },
      order: [['createdAt', 'DESC']]
    });
    return latestRecord;
  }

  private static sortByOrder(array: any[]) {
    return array.sort((a, b) => a.order - b.order);
  };

  private static sortItems(items: any) {
    return items.sort((a: any, b: any) => a.order - b.order).map((item: any) => {
      if (item.subItems && item.subItems.length > 0) {
        item.subItems = this.sortItems(item.subItems);
      }
      return item;
    });
  }
}

export default UserRepository;

import * as models from '../../models';

type Models = {
  [key: string]: any;
};

class TypeDataRepository {

  static async typeData(modelName: string): Promise<any> {

    let modelsData: Models = models;
    let result = await modelsData[modelName].findAll({ where: { isDeleted: false } });

    let response = result.map((r: any) => ({
      label: r?.dataValues?.name || r?.dataValues?.label,
      value: r?.dataValues?.id
    }))

    return { model: modelName, typeData: response }
  }

}

export default TypeDataRepository;

const AppError = require('../utils/appError');

class BaseService {
  async getOne(Model, id, popOptions) {
    let query = Model.findById(id);
    if (popOptions) {
      query = query.populate({
        path: popOptions.path,
        select: popOptions.select
      });
    }

    const doc = await query;

    if (!doc) {
      throw new AppError(`No ${Model.modelName} found with id ${id}`, 404);
    }

    return doc;
  }

  async getAll(Model, params) {
    console.log(params);
    return null;
  }

  async createOne(Model, data) {
    const doc = await Model.create(data);
    return doc;
  }

  async updateOne(Model, id, dataUpdate) {
    const docUpdated = await Model.findByIdAndUpdate(id, dataUpdate, {
      new: true,
      runValidators: true
    });
    return docUpdated;
  }

  async deleteOne(Model, id) {
    await Model.findByIdAndDelete(id);
    return null;
  }
}

module.exports = new BaseService();

const AppError = require('../utils/appError');
const ApiFeatures = require('../utils/apiFeatures');
const { PAGE_LIMIT } = require('../config/constants');

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

    const modelName = Model.modelName.toLowerCase();
    return { doc, modelName };
  }

  async getAll(Model, query) {
    const features = new ApiFeatures(Model.find(), query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const data = await features.query;

    const countDocs = await Model.countDocuments();
    const pageCount = Math.ceil(countDocs / (+query.limit || PAGE_LIMIT));

    const modelName = `${Model.modelName.toLowerCase()}s`;

    return { data, pageCount, currentPage: query.page || 1, modelName };
  }

  async createOne(Model, data) {
    const doc = await Model.create(data);
    const modelName = Model.modelName.toLowerCase();
    return { doc, modelName };
  }

  async updateOne(Model, id, dataUpdate) {
    const docUpdated = await Model.findByIdAndUpdate(id, dataUpdate, {
      new: true,
      runValidators: true
    });

    const modelName = Model.modelName.toLowerCase();
    return { docUpdated, modelName };
  }

  async deleteOne(Model, id) {
    await Model.findByIdAndDelete(id);
    return null;
  }
}

module.exports = new BaseService();

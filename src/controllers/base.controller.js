const baseService = require('../services/base.service');
const { catchAsync, sendSuccess } = require('../utils/index');

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const docs = await baseService.getAll(Model, req.params);
    const modelName = `${Model.modelName.toLowerCase()}s`;

    sendSuccess(res, { [modelName]: docs }, 200);
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    const doc = await baseService.getOne(Model, req.params.id, popOptions);

    const modelName = Model.modelName.toLowerCase();
    sendSuccess(res, { [modelName]: doc }, 200);
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await baseService.createOne(Model, req.body);
    const modelName = Model.modelName.toLowerCase();

    sendSuccess(res, { [modelName]: doc }, 201);
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await baseService.updateOne(Model, req.params.id, req.body);
    const modelName = Model.modelName.toLowerCase();

    sendSuccess(res, { [modelName]: doc }, 200);
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    await baseService.deleteOne(Model, req.params.id);

    sendSuccess(res, null, 204);
  });

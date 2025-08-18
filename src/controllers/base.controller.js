const baseService = require('../services/base.service');
const { catchAsync, sendSuccess } = require('../utils/index');

exports.getAll = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    const { currentPage, data, modelName, pageCount } =
      await baseService.getAll(Model, req.query, popOptions);

    sendSuccess(
      res,
      { [modelName]: data, pagination: { pageCount, currentPage } },
      200
    );
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    const { doc, modelName } = await baseService.getOne(
      Model,
      req.params.id,
      popOptions
    );
    sendSuccess(res, { [modelName]: doc }, 200);
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { doc, modelName } = await baseService.createOne(Model, req.body);
    sendSuccess(res, { [modelName]: doc }, 201);
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { docUpdated, modelName } = await baseService.updateOne(
      Model,
      req.params.id,
      req.body
    );
    sendSuccess(res, { [modelName]: docUpdated }, 200);
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    await baseService.deleteOne(Model, req.params.id);
    sendSuccess(res, null, 204);
  });

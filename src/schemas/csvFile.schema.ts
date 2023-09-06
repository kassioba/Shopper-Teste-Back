import Joi from "joi";

export const csvFileSchema = Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string().valid('text/csv').required(),
    buffer: Joi.binary().required(),
    size: Joi.number().required()
  })
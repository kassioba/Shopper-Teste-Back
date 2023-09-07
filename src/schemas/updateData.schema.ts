import Joi from "joi";

export const updateDataSchema = Joi.array().items({
    product_code: Joi.number().integer().positive().required(),
    new_price: Joi.number().positive().required()
})
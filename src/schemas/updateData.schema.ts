import Joi from "joi";

export const updateDataSchema = Joi.array().items({
    product_code: Joi.number().required(),
    new_price: Joi.number().required()

})
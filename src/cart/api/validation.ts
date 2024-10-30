/*
 * You may use this validator to enforce data integrity in your API.
 */
import Joi from '@hapi/joi';

const itemSchema = Joi.object().keys({
  id: Joi.string().required(),
  item: Joi.string().required(),
  quantity: Joi.number().integer().required(),
  price: Joi.number().required(),
});

function validateItem(obj : object) {
  return itemSchema.validate(obj);
}

export = {
  validateItem,
  itemSchema,
};

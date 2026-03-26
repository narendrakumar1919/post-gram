var Joi = require("joi");
var { messages } = require("../../config/messages");
var validation_errors = messages.validation_errors;

const rating = Joi.number()
  .required()
  .min(1)
  .max(5)
  .messages({
    "number.base": `Rating ${validation_errors.number_base}.`,
    "number.empty": `Rating ${validation_errors.field_empty}.`,
    "number.min": `Rating ${validation_errors.number_min} 1.`,
    "number.max": `Rating ${validation_errors.number_max} 5.`,
    "any.required": `Rating ${validation_errors.field_required}.`,
  });

const description = Joi.string()
  .required()
  .max(500)
  .messages({
    "string.base": `Description ${validation_errors.string_base}`,
    "string.empty": `Description ${validation_errors.field_empty}`,
    "string.max": `Description ${validation_errors.string_max} 500`,
    "any.required": `Description ${validation_errors.field_required}`,
  });

const user_name = Joi.string()
  .max(20)
  .messages({
    "string.base": `User name ${validation_errors.string_base}`,
    "string.empty": `User name ${validation_errors.field_empty}`,
    "string.max": `User name ${validation_errors.string_max} 20`,
    "any.required": `User name ${validation_errors.field_required}`,
  });

exports.addPost = Joi.object()
  .keys({
    description,
    user_name
  }).required()
  .messages({
    "object.base": validation_errors.body,
    "any.required": validation_errors.body,
  });

exports.ratePost = Joi.object()
  .keys({
    rating,
    user_name,
  })
  .messages({
    "object.base": validation_errors.body,
    "any.required": validation_errors.body,
  });

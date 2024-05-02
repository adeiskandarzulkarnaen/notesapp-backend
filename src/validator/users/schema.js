const Joi = require('joi');

const UserPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  fullname: Joi.string().required(),
});

const PatchUserHeaderSchema = Joi.object({
  'content-type': Joi.string()
      .valid(
          'image/avif',
          'image/bmp',
          'image/gif',
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/tiff',
          'image/webp',
      ).required(),
}).unknown();

module.exports = {
  UserPayloadSchema,
  PatchUserHeaderSchema,
};

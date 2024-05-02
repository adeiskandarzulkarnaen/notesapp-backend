const InvariantError = require('../../exceptions/InvariantError');
const { UserPayloadSchema, PatchUserHeaderSchema } = require('./schema');

const UsersValidator = {
  validateUserPayload: (payload) => {
    const validationResult = UserPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validatePatchUserHeader: (headers) => {
    const validationResult = PatchUserHeaderSchema.validate(headers);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = UsersValidator;

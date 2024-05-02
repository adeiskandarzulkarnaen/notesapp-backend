const path = require('path');

class UsersHandler {
  constructor(service, storageService, validator) {
    this._service = service;
    this._storageService = storageService;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
    this.getUsersByUsernameHandler = this.getUsersByUsernameHandler.bind(this);
    this.patchUserImageHandler = this.patchUserImageHandler.bind(this);
    this.getUserImageByIdHandler = this.getUserImageByIdHandler.bind(this);
  }

  async postUserHandler(request, h) {
    this._validator.validateUserPayload(request.payload);
    const { username, password, fullname } = request.payload;

    const userId = await this._service.addUser({ username, password, fullname });

    const response = h.response({
      status: 'success',
      message: 'user berhasil ditambahkan',
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  }

  async getUserByIdHandler(request, h) {
    const { id } = request.params;

    const user = await this._service.getUserById(id);

    return {
      status: 'success',
      message: 'berhasil mendapatkan data user',
      data: {
        user,
      },
    };
  }

  async getUsersByUsernameHandler(request, h) {
    const { username = '' } = request.query;
    const users = await this._service.getUsersByUsername(username);

    return {
      status: 'success',
      message: 'berhasil mencari username',
      data: {
        users,
      },
    };
  }

  async patchUserImageHandler(request, h) {
    const { data } = request.payload;
    const { id: userId } = request.auth.credentials;

    this._validator.validatePatchUserHeader(data.hapi.headers);

    const oldImageFile = await this._service.getUserImageUrlById(userId);

    const filename = await this._storageService.writeFile(data, data.hapi);

    if (oldImageFile) await this._storageService.deleteFile(oldImageFile);
    await this._service.addUserImageUrl(userId, filename);

    const response = h.response({
      status: 'success',
      message: 'berhasil menambahkan image',
      data: {
        fileName: `${filename}`,
      },
    });
    response.code(201);
    return response;
  }

  async getUserImageByIdHandler(request, h) {
    const { id: userId } = request.params;
    const imageFile = await this._service.getUserImageUrlById(userId);

    if (!imageFile) {
      const response = h.response({
        status: 'success',
        message: 'user belum menpunyai image',
      });
      response.code(404);
      return response;
    }

    const imagePath = path.resolve(this._storageService.folder, imageFile);
    const response = h.file(imagePath);
    return response;
  }
}

module.exports = UsersHandler;

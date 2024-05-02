const path = require('path');

const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler,
  },
  {
    method: 'GET',
    path: '/users/{id}',
    handler: handler.getUserByIdHandler,
    options: {
      auth: 'notesapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/users',
    handler: handler.getUsersByUsernameHandler,
    options: {
      auth: 'notesapp_jwt',
    },
  },
  {
    method: 'PATCH',
    path: '/users',
    handler: handler.patchUserImageHandler,
    options: {
      auth: 'notesapp_jwt',
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 10000000, // 10MB
      },
    },
  },
  {
    method: 'GET',
    path: '/users/{id}/images',
    handler: handler.getUserImageByIdHandler,
    options: {
      auth: 'notesapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/public/images/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, '../../../public'),
      },
    },
    options: {
      auth: 'notesapp_jwt',
    },
  },
];

module.exports = routes;

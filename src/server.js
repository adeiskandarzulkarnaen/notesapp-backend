require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Jwt = require('@hapi/jwt');
const path = require('path');

/* notes */
const notes = require('./api/notes');
const NotesService = require('./services/mysql/NotesService');
const NotesValidator = require('./validator/notes');

/* users */
const users = require('./api/users');
const UsersService = require('./services/mysql/UsersService');
const UsersValidator = require('./validator/users');

/* authentications */
const authentications = require('./api/authentications');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

/* collaborations */
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/mysql/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations');

/* helper development plugin */
const helper = require('./api/helper');

/* storage */
const StorageService = require('./services/storage/StorageServices');

/* exceptions */
const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const collaborationsService = new CollaborationsService();
  const notesService = new NotesService(collaborationsService);
  const usersService = new UsersService();
  const storageService = new StorageService(path.resolve(__dirname, '../public'));

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;

    if (response instanceof Error) {
      // penanganan client error secara internal.
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'failed',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      // penanganan client error selain instance ClientError
      if (!response.isServer) {
        // /* penanganan secara native */
        // return h.continue;

        /* penanganan secara custom */
        const statusCode = response.output.statusCode;
        const errorResponse = h.response({
          status: 'error',
          message: response.message,
        });
        errorResponse.code(statusCode);
        return errorResponse;
      }

      // penanganan server error sesuai kebutuhan
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      console.error(response.message);
      return newResponse;
    }

    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue;
  });

  // registrasi plugin external
  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy('notesapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  // registrasi plugin internal
  await server.register([
    {
      plugin: notes,
      options: {
        service: notesService,
        validator: NotesValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        storageService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        notesService,
        validator: CollaborationsValidator,
      },
    },
    // {
    //   plugin: helper,
    //   options: {
    //     pool: require('./utils/pool'),
    //   },
    // },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();

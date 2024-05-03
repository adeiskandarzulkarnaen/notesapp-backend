/* eslint-disable */

const path = require('path');
const fs = require('fs/promises');

module.exports = {
  name: 'helper',
  version: '1.0.0',
  register: async (server, options) => {
    const { pool } = options;
    server.route([
      {
        method: 'POST',
        path: '/helper/truncate',
        handler: async (request, h) => {
          const { table } = request.query;;
          const availableTables = ['authentications', 'collaborations', 'notes', 'users'];
          
          // Menentukan tabel yang akan dihapus
          const tablesToDelete = table && availableTables.includes(table)
            ? [table]
            : availableTables;
          
          // Hapus tabel-tabel yang ditentukan
          for (const tableName of tablesToDelete) {
            await pool.execute(`DELETE FROM ${tableName}`);
          }
          
          console.log('beres');
          const response = h.response({
            status: 'success',
            message: 'berhasil truncate table',
            data: table ?? availableTables,
          });
          response.code(201);
          return response;
        },
        options: {
          auth: 'notesapp_jwt',
        },
      },
      {
        method: 'POST',
        path: '/helper/clean',
        handler: async (request, h) => {
          const dirPath = path.resolve(__dirname, '../../public');
          // delete all file in derectory
          const deletedFile = [];
          const files = await fs.readdir(dirPath);
          for (const file of files) {
            if (file !== '.gitignore') {
              const filePath = path.join(dirPath, file);
              await fs.unlink(filePath);
              deletedFile.push(file);
            }
          }
          
          const response = h.response({
            status: 'success',
            message: 'berhasil hapus image',
            data: deletedFile,
          });
          response.code(201);
          return response;
        },
        options: {
          auth: 'notesapp_jwt',
        },
      },
    ]);
  },
};

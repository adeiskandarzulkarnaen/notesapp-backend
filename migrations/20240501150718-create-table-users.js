/* eslint-disable no-unused-vars */

'use strict';

let dbm;
let type;
let seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */

exports.setup = (options, seedLink) => {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = (db) => {
  return db.createTable('users', {
    id: {
      type: 'string',
      length: 50,
      notNull: true,
      primaryKey: true,
    },
    username: {
      type: 'string',
      length: 50,
      notNull: true,
      unique: true,
    },
    password: {
      type: 'text',
      notNull: true,
    },
    fullname: {
      type: 'text',
      notNull: true,
    },
    image_file: {
      type: 'text',
      notNull: false,
    },
  });
};

exports.down = (db) => {
  return db.dropTable('users');
};

exports._meta = {
  version: 1,
};

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
  return db.createTable('authentications', {
    token: {
      type: 'text',
      notNull: true,
    },
  });
};

exports.down = (db) => {
  return db.dropTable('authentications');
};

exports._meta = {
  'version': 1,
};

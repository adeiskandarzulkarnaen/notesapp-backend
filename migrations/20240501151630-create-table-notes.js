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
  return db.createTable('notes', {
    id: {
      type: 'string',
      length: 50,
      primaryKey: true,
    },
    title: {
      type: 'text',
      notNull: true,
    },
    tags: 'text',
    body: {
      type: 'text',
      notNull: true,
    },
    owner: {
      type: 'string',
      length: 50,
      foreignKey: {
        name: 'notes_owner_fk',
        table: 'users',
        mapping: 'id',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT',
        },
      },
    },
    created_at: {
      type: 'text',
      notNull: true,
    },
    updated_at: {
      type: 'text',
      notNull: true,
    },
  });
};

exports.down = (db) => {
  return db.dropTable('notes');
};

exports._meta = {
  'version': 1,
};

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
  return db.createTable('collaborations', {
    columns: {
      id: {
        type: 'string',
        length: 50,
        notNull: true,
        primaryKey: true,
      },
      note_id: {
        type: 'string',
        length: 50,
        notNull: true,
        foreignKey: {
          name: 'collaborations_noteid_fk',
          table: 'notes',
          mapping: 'id',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT',
          },
        },
      },
      user_id: {
        type: 'string',
        length: 50,
        notNull: true,
        foreignKey: {
          name: 'collaborations_userid_fk',
          table: 'users',
          mapping: 'id',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT',
          },
        },
      },
    },
    unique: {
      unique_noteid_and_userid: ['user_id', 'note_id'],
    },
  });
};

exports.down = (db) => {
  return db.dropTable('collaborations');
};

exports._meta = {
  'version': 1,
};

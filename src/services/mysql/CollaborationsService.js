const pool = require('../../utils/pool');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class CollaborationsService {
  constructor() {
    this._pool = pool;
  }

  async addCollaboration(noteId, userId) {
    const id = `collab-${nanoid(16)}`;

    const query = {
      sql: 'INSERT INTO collaborations VALUES(?, ?, ?)',
      values: [id, noteId, userId],
    };

    const [result] = await this._pool.query(query);

    if (!result.affectedRows) {
      throw new InvariantError('kolaborasi gagal ditambahkan');
    }

    return id;
  }

  async deleteCollaboration(noteId, userId) {
    const query = {
      sql: `DELETE FROM collaborations WHERE note_id = ? AND user_id = ?`,
      values: [noteId, userId],
    };

    const [result] = await this._pool.query(query);

    if (!result.affectedRows) {
      throw new InvariantError('kolaborasi gagal dihapus');
    }
  }

  async verifyCollaborator(noteId, userId) {
    const query = {
      sql: 'SELECT * FROM collaborations WHERE note_id = ? AND user_id = ?',
      values: [noteId, userId],
    };

    const [result] = await this._pool.query(query);

    if (!result.length) {
      throw new InvariantError('kolaborasi gagal diverifikasi');
    }
  }
}

module.exports = CollaborationsService;

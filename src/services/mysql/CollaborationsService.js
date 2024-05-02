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
      sql: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
      values: [id, noteId, userId],
    };

    const [result] = await this._pool.query(query);

    if (result.affectedRows === 0) {
      throw new InvariantError('Kolaborasi gagal ditambahkan');
    }

    return id;
  }

  async deleteCollaboration(noteId, userId) {
    const query = {
      sql: `DELETE FROM collaborations WHERE note_id = ? AND user_id = ?`,
      values: [noteId, userId],
    };

    const [result] = await this._pool.query(query);

    if (result.affectedRows === 0) {
      throw new InvariantError('Kolaborasi gagal dihapus');
    }
  }

  async verifyCollaborator(noteId, userId) {
    const query = {
      sql: 'SELECT * FROM collaborations WHERE note_id = ? AND user_id = ?',
      values: [noteId, userId],
    };

    const [result] = await this._pool.query(query);

    if (result.length === 0) {
      throw new InvariantError('Kolaborasi gagal diverifikasi');
    }
  }
}

module.exports = CollaborationsService;

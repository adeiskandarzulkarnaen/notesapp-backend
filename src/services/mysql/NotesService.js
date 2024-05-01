const pool = require('../../configs/pool');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const { mapDBToModel } = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class NotesServices {
  constructor(collaborationService) {
    this._pool = pool;
    this._collaborationService = collaborationService;
  }

  async addNote({ title, body, tags, owner }) {
    const id = `note-${nanoid(16)}`;
    const sTags = tags.join();
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      sql: `INSERT INTO notes(id, title, tags, body, owner, created_at, updated_at)
        VALUES(?, ?, ?, ?, ?, ?, ?)`,
      values: [id, title, sTags, body, owner, createdAt, updatedAt],
    };

    const [result] = await this._pool.query(query);

    if (result.affectedRows === 0) {
      throw new InvariantError('Catatan gagal ditambahkan');
    }

    return id;
  }

  async getNotes(owner) {
    const query = {
      sql: `SELECT notes.* FROM notes
        LEFT JOIN collaborations ON collaborations.note_id = notes.id
        WHERE notes.owner = ? OR collaborations.user_id = ?
        GROUP BY notes.id`,
      values: [owner, owner],
    };
    const [result] = await this._pool.query(query);
    return result.map(mapDBToModel);
  }

  async getNoteById(id) {
    const query = {
      sql: `SELECT notes.*, users.username
        FROM notes
        LEFT JOIN users ON users.id = notes.owner
        WHERE notes.id = ?`,
      values: [id],
    };
    const [result] = await this._pool.query(query);

    if (!result.length) {
      throw new NotFoundError('Catatan tidak ditemukan');
    }

    return result.map(mapDBToModel)[0];
  }

  async editNoteById(id, { title, body, tags }) {
    const sTags = tags.join();
    const updatedAt = new Date().toISOString();
    const query = {
      sql: `UPDATE notes 
        SET title = ?, body = ?, tags = ?, updated_at = ? 
        WHERE id = ?`,
      values: [title, body, sTags, updatedAt, id],
    };

    const [result] = await this._pool.query(query);

    if (result.affectedRows === 0) {
      throw new NotFoundError('Gagal memperbarui catatan. Id tidak ditemukan');
    }
  }

  async deleteNoteById(id) {
    const query = {
      sql: 'DELETE FROM notes WHERE id = ?',
      values: [id],
    };

    const [result] = await this._pool.query(query);

    if (result.affectedRows === 0) {
      throw new NotFoundError('Catatan gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifyNoteOwner(id, owner) {
    const query = {
      sql: 'SELECT * FROM notes WHERE id = ?',
      values: [id],
    };

    const [result] = await this._pool.query(query);

    if (!result.length) {
      throw new NotFoundError('Catatan tidak ditemukan');
    }

    const note = result[0];

    if (note.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyNoteAccess(noteId, userId) {
    try {
      await this.verifyNoteOwner(noteId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      try {
        await this._collaborationService.verifyCollaborator(noteId, userId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = NotesServices;

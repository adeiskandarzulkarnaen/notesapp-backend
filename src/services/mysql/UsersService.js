const pool = require('../../configs/pool');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

class UsersServices {
  constructor() {
    this._pool = pool;
  }

  async addUser({ username, password, fullname }) {
    await this.verifyNewUsername(username);

    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
      sql: 'INSERT INTO users VALUES(?, ?, ?, ?)',
      values: [id, username, hashedPassword, fullname],
    };

    const [result] = await this._pool.query(query);

    if (result.affectedRows === 0) {
      throw new InvariantError('User gagal ditambahkan');
    }

    return id;
  }

  async verifyNewUsername(username) {
    const query = {
      sql: 'SELECT username FROM users WHERE username = ?',
      values: [username],
    };

    const [result] = await this._pool.query(query);

    if (result.length > 0) {
      throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.');
    }
  }

  async getUserById(userId) {
    const query = {
      sql: 'SELECT id, username, fullname FROM users WHERE id = ?',
      values: [userId],
    };

    const [result] = await this._pool.query(query);

    if (!result.length) {
      throw new NotFoundError('user tidak ditemukan');
    }

    return result[0];
  }

  async verifyUserCredential(username, password) {
    const query = {
      sql: 'SELECT id, password FROM users WHERE username = ?',
      values: [username],
    };

    const [result] = await this._pool.query(query);

    if (!result.length) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    const { id, password: hashedPassword } = result[0];

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    return id;
  }

  async getUsersByUsername(username) {
    const query = {
      sql: `SELECT id, username, fullname FROM users WHERE username LIKE ?`,
      values: [`%${username}%`],
    };

    const [result] = await this._pool.query(query);
    return result;
  }
}

module.exports = UsersServices;

const pool = require('../../utils/pool');
const InvariantError = require('../../exceptions/InvariantError');

class AuthenticationsService {
  constructor() {
    this._pool = pool;
  }

  async addRefreshToken(token) {
    const query = {
      sql: 'INSERT INTO authentications VALUES(?)',
      values: [token],
    };

    await this._pool.query(query);
  }

  async verifyRefreshToken(token) {
    const query = {
      sql: 'SELECT token FROM authentications WHERE token = ?',
      values: [token],
    };

    const [result] = await this._pool.query(query);

    if (!result.length) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }

  async deleteRefreshToken(token) {
    const query = {
      sql: 'DELETE FROM authentications WHERE token = ?',
      values: [token],
    };

    await this._pool.query(query);
  }
}

module.exports = AuthenticationsService;

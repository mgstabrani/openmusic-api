const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapSongDBToModel } = require('../../utils');

class SongsService {
  constructor() {
    this.pool = new Pool();
  }

  async addSong({
    title, year, genre, performer, duration, albumId,
  }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $8) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId, createdAt],
    };

    const result = await this.pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Song gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongs(title, performer) {
    let query = {
      text: `SELECT songs.* FROM songs
        GROUP BY songs.id`,
    };

    if (title) {
      query = {
        text: `SELECT songs.*
    FROM songs
    WHERE LOWER(songs.title) LIKE $1`,
        values: [`%${title.toLowerCase()}%`],
      };
    }

    if (performer) {
      query = {
        text: `SELECT songs.*
    FROM songs
    WHERE LOWER(songs.performer) LIKE $1`,
        values: [`%${performer.toLowerCase()}%`],
      };
    }

    if (title && performer) {
      query = {
        text: `SELECT songs.*
    FROM songs
    WHERE LOWER(songs.title) LIKE $1 AND LOWER(songs.performer) LIKE $2`,
        values: [`%${title.toLowerCase()}%`, `%${performer.toLowerCase()}%`],
      };
    }

    const result = await this.pool.query(query);
    const mappedResult = result.rows.map(mapSongDBToModel);

    return mappedResult;
  }

  async getSongById(id) {
    const query = {
      text: `SELECT songs.*
    FROM songs
    WHERE songs.id = $1`,
      values: [id],
    };
    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Song tidak ditemukan');
    }

    return result.rows.map(mapSongDBToModel)[0];
  }

  async editSongById(id, {
    title, year, genre, performer, duration, albumId,
  }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6, updated_at = $7 WHERE id = $8 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, updatedAt, id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui song. Id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Song gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = SongsService;

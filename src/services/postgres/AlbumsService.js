const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapAlbumDBToModel } = require('../../utils');

class AlbumsService {
  constructor() {
    this.pool = new Pool();
  }

  async addAlbum({
    name, year,
  }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, NULL, $4, $5) RETURNING id',
      values: [id, name, year, createdAt, updatedAt],
    };

    const result = await this.pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbums() {
    const query = {
      text: `SELECT albums.* FROM albums
        GROUP BY albums.id`,
    };

    const result = await this.pool.query(query);
    const mappedResult = result.rows.map(mapAlbumDBToModel);

    return mappedResult;
  }

  async getAlbumById(id) {
    const query = {
      text: `SELECT albums.*
    FROM albums
    WHERE albums.id = $1`,
      values: [id],
    };

    const songsQuery = {
      text: `SELECT songs.*
      FROM songs
      WHERE songs.album_id = $1`,
      values: [id],
    };

    const result = await this.pool.query(query);
    const songs = await this.pool.query(songsQuery);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    result.rows[0].songs = songs.rows;
    return result.rows.map(mapAlbumDBToModel)[0];
  }

  async editAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }

  async addAlbumCover(albumId, coverUrl) {
    const query = {
      text: 'UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id',
      values: [coverUrl, albumId],
    };
    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Gagal menambahkan cover album');
    }
  }
}

module.exports = AlbumsService;

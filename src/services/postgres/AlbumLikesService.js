const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class AlbumLikesService {
  constructor(cacheService) {
    this.pool = new Pool();
    this.cacheService = cacheService;
  }

  async addAlbumLikes(userId, albumId) {
    const id = `like-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3)  RETURNING id',
      values: [id, userId, albumId],
    };

    const result = await this.pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menambahkan like');
    }

    await this.cacheService.delete(`album_likes:${albumId}`);

    return result.rows[0].id;
  }

  async deleteAlbumLikes(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND "album_id" = $2 RETURNING id',
      values: [userId, albumId],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal membatalkan like');
    }

    await this.cacheService.delete(`album_likes:${albumId}`);
  }

  async checkAlreadyLike(userId, albumId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE user_id = $1 AND "album_id" = $2',
      values: [userId, albumId],
    };

    const result = await this.pool.query(query);

    return result.rows.length;
  }

  async getLikesCount(albumId) {
    try {
      const result = await this.cacheService.get(`album_likes:${albumId}`);
      return {
        count: JSON.parse(result),
        source: 'cache',
      };
    } catch (error) {
      const query = {
        text: 'SELECT * FROM user_album_likes WHERE "album_id" = $1',
        values: [albumId],
      };

      const result = await this.pool.query(query);
      if (!result.rows.length) {
        throw new InvariantError('Album tidak mempunyai like');
      }

      await this.cacheService.set(`album_likes:${albumId}`, JSON.stringify(result.rows.length));

      return {
        count: result.rows.length,
      };
    }
  }
}
module.exports = AlbumLikesService;

const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  constructor(collaborationsService) {
    this.pool = new Pool();
    this.collaborationsService = collaborationsService;
  }

  async addPlaylist({
    name, owner,
  }) {
    const id = nanoid(16);

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this.pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async addSongToPlaylist({ playlistId, songId }) {
    const id = nanoid(16);
    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this.pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Song gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username
      FROM users, playlists
      WHERE playlists.owner = $1 AND users.id = playlists.owner`,
      values: [owner],
    };

    const result = await this.pool.query(query);

    return result.rows;
  }

  async getPlaylistById(id) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username
    FROM playlists
    LEFT JOIN users ON users.id = playlists.owner
    WHERE playlists.id = $1`,
      values: [id],
    };
    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    return result.rows[0];
  }

  async getPlaylistSongs(playlistId) {
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer
      FROM playlists, songs, playlist_songs
      WHERE playlists.id = $1 AND playlist_songs.song_id = songs.id AND playlists.id = playlist_songs.playlist_id`,
      values: [playlistId],
    };
    const result = await this.pool.query(query);

    return result.rows;
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id, owner',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  async deletePlaylistSongById(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Song gagal dihapus dari playlist. Id tidak ditemukan');
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      try {
        await this.collaborationsService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistsService;

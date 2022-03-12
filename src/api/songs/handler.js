const ClientError = require('../../exceptions/ClientError');

class SongsHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler(request, h) {
    try {
      this.validator.validateSongPayload(request.payload);
      const {
        title, year, genre, performer, duration, albumId,
      } = request.payload;

      const songId = await this.service.addSong({
        title, year, genre, performer, duration, albumId,
      });

      const response = h.response({
        status: 'success',
        data: {
          songId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);

      return response;
    }
  }

  async getSongsHandler() {
    const songs = await this.service.getSongs();

    const songsResponse = songs.map((song) => ({
      id: song.id,
      title: song.title,
      performer: song.performer,
    }));

    return {
      status: 'success',
      data: {
        songs: songsResponse,
      },
    };
  }

  async getSongByIdHandler(request, h) {
    try {
      const { id } = request.params;

      const song = await this.service.getSongById(id);
      return {
        status: 'success',
        data: {
          song,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);

      return response;
    }
  }

  async putSongByIdHandler(request, h) {
    try {
      this.validator.validateSongPayload(request.payload);
      const { id } = request.params;

      await this.service.editSongById(id, request.payload);

      return {
        status: 'success',
        message: 'Song berhasil diperbarui',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);

      return response;
    }
  }

  async deleteSongByIdHandler(request, h) {
    try {
      const { id } = request.params;

      await this.service.deleteSongById(id);

      return {
        status: 'success',
        message: 'Song berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);

      return response;
    }
  }
}

module.exports = SongsHandler;

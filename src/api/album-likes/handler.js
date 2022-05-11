const ClientError = require('../../exceptions/ClientError');

class AlbumLikesHandler {
  constructor(service, albumsService) {
    this.service = service;
    this.albumsService = albumsService;

    this.postAlbumLikesHandler = this.postAlbumLikesHandler.bind(this);
    this.getAlbumLikesHandler = this.getAlbumLikesHandler.bind(this);
  }

  async postAlbumLikesHandler(request, h) {
    try {
      const { albumId } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this.albumsService.getAlbumById(albumId);
      const alreadyLiked = await this.service.checkAlreadyLike(credentialId, albumId);

      if (!alreadyLiked) {
        const likeId = await this.service.addAlbumLikes(credentialId, albumId);

        const response = h.response({
          status: 'success',
          message: `Berhasil menambahkan like pada album dengan id: ${likeId}`,
        });
        response.code(201);
        return response;
      }

      await this.service.deleteAlbumLikes(credentialId, albumId);

      const response = h.response({
        status: 'success',
        message: 'Berhasil membatalkan like',
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

  async getAlbumLikesHandler(request, h) {
    try {
      const { albumId } = request.params;
      const data = await this.service.getLikesCount(albumId);
      const likes = data.count;

      const response = h.response({
        status: 'success',
        data: {
          likes,
        },
      });
      response.header('X-Data-Source', data.source);
      response.code(200);
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
}

module.exports = AlbumLikesHandler;

const ClientError = require('../../exceptions/ClientError');

class ExportsHandler {
  constructor(service, playlistsService, validator) {
    this.service = service;
    this.playlistsService = playlistsService;
    this.validator = validator;

    this.postExportPlaylistHandler = this.postExportPlaylistHandler.bind(this);
  }

  async postExportPlaylistHandler(request, h) {
    try {
      this.validator.validateExportPlaylistsPayload(request.payload);

      const { playlistId } = request.params;
      const { targetEmail } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      const message = { playlistId, targetEmail };

      await this.playlistsService.getPlaylistById(playlistId);
      await this.playlistsService.verifyPlaylistOwner(playlistId, credentialId);

      await this.service.sendMessage('export:playlists', JSON.stringify(message));

      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses',
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
}

module.exports = ExportsHandler;

/* eslint-disable camelcase */
const mapAlbumDBToModel = ({
  id,
  name,
  year,
  songs,
  created_at,
  updated_at,
}) => ({
  id,
  name,
  year,
  songs,
  createdAt: created_at,
  updatedAt: updated_at,
});

const mapSongDBToModel = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  album_id,
  created_at,
  updated_at,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId: album_id,
  createdAt: created_at,
  updatedAt: updated_at,
});

const mapPlaylistDBToModel = ({
  id,
  name,
  owner,
}) => ({
  id,
  name,
  username: owner,
});

module.exports = { mapAlbumDBToModel, mapSongDBToModel, mapPlaylistDBToModel };

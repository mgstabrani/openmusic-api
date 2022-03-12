/* eslint-disable camelcase */
const mapAlbumDBToModel = ({
  id,
  name,
  year,
  created_at,
  updated_at,
}) => ({
  id,
  name,
  year,
  createdAt: created_at,
  updatedAt: updated_at,
});

module.exports = { mapAlbumDBToModel };

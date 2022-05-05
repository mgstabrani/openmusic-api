/* eslint-disable camelcase */

exports.up = (pgm) => {
  // membuat playlist baru.
  pgm.sql("INSERT INTO playlists(id, name, owner) VALUES ('old_playlists', 'old_playlists', 'old_playlists')");

  // mengubah nilai playlist_id pada playlist_songs yang playlist_id-nya bernilai NULL
  pgm.sql("UPDATE playlist_songs SET playlist_id = 'old_playlists' WHERE playlist_id = NULL");

  // memberikan constraint foreign key pada playlist_id terhadap kolom id dari tabel playlists
  pgm.addConstraint('playlist_songs', 'fk_playlist_songs.playlist_id.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  // menghapus constraint fk_playlist_songs.playlist_id.id pada tabel playlist_songs
  pgm.dropConstraint('playlist_songs', 'fk_playlist_songs.playlist_id.id');

  // mengubah nilai playlist_id old_playlist_songs pada playlist menjadi NULL
  pgm.sql("UPDATE playlist_songs SET playlist_id = NULL WHERE playlist_id = 'old_playlists'");

  // menghapus playlist baru.
  pgm.sql("DELETE FROM playlists WHERE id = 'old_playlists'");
};

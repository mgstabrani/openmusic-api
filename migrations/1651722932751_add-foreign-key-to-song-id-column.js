/* eslint-disable camelcase */

exports.up = (pgm) => {
  // membuat song baru.
  pgm.sql("INSERT INTO songs(id, title, year, genre, performer, duration, album_id, created_at, updated_at) VALUES ('old_songs', 'old_songs', 2019, 'old_songs', 'old_songs', 20, NULL, 'old_songs', 'old_songs')");

  // mengubah nilai song_id pada playlist_songs yang song_id-nya bernilai NULL
  pgm.sql("UPDATE playlist_songs SET song_id = 'old_songs' WHERE song_id = NULL");

  // memberikan constraint foreign key pada song_id terhadap kolom id dari tabel songs
  pgm.addConstraint('playlist_songs', 'fk_playlist_songs.song_id.id', 'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  // menghapus constraint fk_playlist_songs.song_id.id pada tabel playlist_songs
  pgm.dropConstraint('playlist_songs', 'fk_playlist_songs.song_id.id');

  // mengubah nilai song_id old_playlist_songs pada song menjadi NULL
  pgm.sql("UPDATE playlist_songs SET song_id = NULL WHERE song_id = 'old_songs'");

  // menghapus song baru.
  pgm.sql("DELETE FROM songs WHERE id = 'old_songs'");
};

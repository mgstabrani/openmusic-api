/* eslint-disable camelcase */

exports.up = (pgm) => {
  // membuat user baru.
  pgm.sql("INSERT INTO users(id, username, password, fullname) VALUES ('old_playlists', 'old_playlists', 'old_playlists', 'old playlists')");

  // mengubah nilai owner pada playlist yang owner-nya bernilai NULL
  pgm.sql("UPDATE playlists SET owner = 'old_playlists' WHERE owner = NULL");

  // memberikan constraint foreign key pada owner terhadap kolom id dari tabel users
  pgm.addConstraint('playlists', 'fk_playlists.owner.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  // menghapus constraint fk_playlists.owner.id pada tabel playlists
  pgm.dropConstraint('playlists', 'fk_playlists.owner.id');

  // mengubah nilai owner old_playlists pada playlist menjadi NULL
  pgm.sql("UPDATE playlists SET owner = NULL WHERE owner = 'old_playlists'");

  // menghapus user baru.
  pgm.sql("DELETE FROM users WHERE id = 'old_playlists'");
};

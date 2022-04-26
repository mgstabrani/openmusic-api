# openmusic-api

## Kriteria OpenMusic API versi 2
### Kriteria 1: Registrasi dan Autentikasi Pengguna
<img src="https://dicoding-web-img.sgp1.cdn.digitaloceanspaces.com/original/academy/dos:c9101131322a610d87e40f8af959da2120211215141916.png">
<br>
*any: merupakan nilai string apa pun selama tidak kosong.

#### Ketentuan
- **Username** harus unik.
- Authentication menggunakan JWT token.
- JWT token harus mengandung payload berisi **userId** yang merupakan id dari user autentik.
- Nilai secret key token JWT baik access token ataupun refresh token wajib menggunakan environment variable **ACCESS_TOKEN_KEY** dan **REFRESH_TOKEN_KEY**.
- Refresh token memiliki signature yang benar serta terdaftar di database.

### Kriteria 2: Pengelolaan Data Playlist 
<img src="https://dicoding-web-img.sgp1.cdn.digitaloceanspaces.com/original/academy/dos:bbf73f53c681045227cd811024a4b2de20220304110657.png">
<br>
*any: merupakan nilai string apa pun selama nilainya tidak kosong

#### Ketentuan
- Playlist merupakan resource yang dibatasi (restrict). Untuk mengaksesnya membutuhkan access token.
- Playlist yang muncul pada **GET /playlists** hanya yang ia miliki saja.
- Hanya owner playlist (atau kolabolator) yang dapat menambahkan, melihat, dan menghapus lagu ke/dari playlist.
- **songId** dimasukkan/dihapus ke/dari playlist wajib bernilai id lagu yang valid.

#### Response Body
- **GET /playlists**
    ```
    {
        "status": "success",
        "data": {
            "playlists": [
                {
                    "id": "playlist-Qbax5Oy7L8WKf74l",
                    "name": "Lagu Indie Hits Indonesia",
                    "username": "dicoding"
                },
                {
                    "id": "playlist-lmA4PkM3LseKlkmn",
                    "name": "Lagu Untuk Membaca",
                    "username": "dicoding"
                }
            ]
        }
    }
    ```
- **GET /playlists/{id}/songs**
    ```
    {
        "status": "success",
        "data": {
            "playlist": {
                "id": "playlist-Mk8AnmCp210PwT6B",
                "name": "My Favorite Coldplay",
                "username": "dicoding",
                "songs": [
                    {
                        "id": "song-Qbax5Oy7L8WKf74l",
                        "title": "Life in Technicolor",
                        "performer": "Coldplay"
                    },
                    {
                        "id": "song-poax5Oy7L8WKllqw",
                        "title": "Centimeteries of London",
                        "performer": "Coldplay"
                    },
                    {
                        "id": "song-Qalokam7L8WKf74l",
                        "title": "Lost!",
                        "performer": "Coldplay"
                    }
                ]
            }
        }
    }
    ```
##### Keterangan:
- Properti owner merupakan user id dari pembuat playlist. Anda bisa mendapatkan nilainya melalui artifacts payload JWT.

### Kriteria 3: Menerapkan Foreign Key
- Tabel songs terhadap albums;
- Tabel playlists terhadap users;
- Dan relasi tabel lainnya.

### Kriteria 4 : Menerapkan Data Validation
- POST /users:
  - **username** : string, required.
  - **password** : string, required.
  - **fullname** : string, required.
- POST /authentications:
  - **username** : string, required.
  - **password** : string, required.
- PUT /authentications:
  - **refreshToken** : string, required.
- DELETE /authentications:
  - **refreshToken** : string, required.
- POST /playlists:
  - **name** : string, required.
- POST /playlists/{playlistId}/songs
  - **songId** : string, required.


### Kriteria 5 :Penanganan Eror (Error Handling)
- Ketika proses validasi data pada request payload tidak sesuai (gagal), server harus mengembalikan response:
  - status code: **400 (Bad Request)**
  - response body:
    - status: **fail**
    - message: <\apa pun selama tidak kosong>
- Ketika pengguna mengakses resource yang tidak ditemukan, server harus mengembalikan response:
  - status code: **404 (Not Found)**
  - response body:
    - status: **fail**
    - message: <\apa pun selama tidak kosong>
- Ketika pengguna mengakses resource yang dibatasi tanpa access token, server harus mengembalikan response:
  - status code: **401 (Unauthorized)**
  - response body:
    - status: **fail**
    - message: <\apa pun selama tidak kosong>
- Ketika pengguna memperbarui access token menggunakan refresh token yang tidak valid, server harus mengembalikan response:
  - status code: **400 (Bad Request)**
  - response body:
    - status: **fail**
    - message: <\apa pun selama tidak kosong>
- Ketika pengguna mengakses resource yang bukan haknya, server harus mengembalikan response:
  - status code: **403 (Forbidden)**
  - response body:
    - status: **fail**
    - message: <\apa pun selama tidak kosong>
- Ketika terjadi server eror, server harus mengembalikan response:
  - status code: **500 (Internal Server Error)**
  - response body:
    - status: **error**
    - message: <\apa pun selama tidak kosong>

### Kriteria 6 : Pertahankan Fitur OpenMusic API versi 1
- Pengelolaan data album.
- Pengelolaan data song.
- Menerapkan data validations resource album dan song.

## Kriteria Opsional OpenMusic API versi 2
### Kriteria 1: Memiliki fitur kolaborator playlist
<img src="https://dicoding-web-img.sgp1.cdn.digitaloceanspaces.com/original/academy/dos:b2208d9238e801b66ed140c996925bae20211215143414.png">
<br>
*any: merupakan nilai string apa pun selama tidak kosong.

#### Hak akses kolaborator
- Playlist tampil pada permintaan **GET /playlists**.
- Dapat menambahkan lagu ke dalam playlist.
- Dapat menghapus lagu dari playlist.
- Dapat melihat daftar lagu yang ada di playlist.
- Dapat melihat aktifitas playlist (jika menerapkan kriteria opsional ke-2).

### Kriteria 2: Memiliki Fitur Playlist Activities
- Method: **GET**
- URL: **/playlists/{id}/activities**
- Status Code : **200**
- Response Body:
  ```
  {
    "status": "success",
    "data": {
        "playlistId": "playlist-Mk8AnmCp210PwT6B",
        "activities": [
            {
                "username": "dicoding",
                "title": "Life in Technicolor",
                "action": "add",
                "time": "2021-09-13T08:06:20.600Z"
            },
            {
                "username": "dicoding",
                "title": "Centimeteries of London",
                "action": "add",
                "time": "2021-09-13T08:06:39.852Z"
            },
            {
                "username": "dimasmds",
                "title": "Life in Technicolor",
                "action": "delete",
                "time": "2021-09-13T08:07:01.483Z"
            }
        ]
    }
  }
  ```

### Kriteria 3: Mempertahankan Kriteria Opsional OpenMusic V1
- Mendapatkan daftar lagu di dalam album detail.
- Query Parameter untuk Pencarian Lagu.
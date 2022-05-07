# openmusic-api

## Kriteria OpenMusic API versi 3
### Kriteria 1: Ekspor Lagu Pada Playlist
- Method : **POST**
- URL : **/export/playlists/{playlistId}**
- Body Request:
  ```
  {
    "targetEmail": string
  }
  ```

#### Ketentuan
- Wajib menggunakan message broker dengan menggunakan RabbitMQ.
  - Nilai host server RabbitMQ wajib menggunakan environment variable **RABBITMQ_SERVER**
- Hanya pemilik Playlist yang boleh mengekspor lagu.
- Wajib mengirimkan program consumer.
- Hasil ekspor berupa data json.
- Dikirimkan melalui email menggunakan [nodemailer](https://nodemailer.com/).
  - Kredensial alamat dan password email pengirim wajib menggunakan environment variable **MAIL_ADDRESS** dan **MAIL_PASSWORD**.
  - Serta, nilai host dan port dari server SMTP juga wajib menggunakan environment variable **MAIL_HOST** dan **MAIL_PORT**.

#### Response yang harus dikembalikan:
- Status Code: 201
- Response Body:
  ```
  {
    "status": "success",
    "message": "Permintaan Anda sedang kami proses",
  }
  ```

#### Struktur data JSON yang diekspor adalah seperti ini:
```
{
  "playlist": {
    "id": "playlist-Mk8AnmCp210PwT6B",
    "name": "My Favorite Coldplay Song",
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
```

### Kriteria 2: Mengunggah Sampul Album 
- Method : **POST**
- URL : **/albums/{id}/covers**
- Body Request (Form data):
  ```
  {
    "cover": file
  }
  ```

#### Ketentuan
- Tipe konten yang diunggah harus merupakan [MIME types dari images](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types#image_types).
- Ukuran file cover maksimal 512000 Bytes.
- Anda bisa menggunakan File System (lokal) atau S3 Bucket dalam menampung object.
- Bila menggunakan S3 Bucket, nama bucket wajib menggunakan variable environment **AWS_BUCKET_NAME**.

#### Response yang harus dikembalikan:
- Status Code: 201
- Response Body:
  ```
  {
    "status": "success",
    "message": "Sampul berhasil diunggah"
  }
  ```
  ```
  {
    "status": "success",
    "data": {
        "album": {
        "id": "album-Mk8AnmCp210PwT6B",
        "name": "Viva la Vida",
        "coverUrl": "http://...."
        }
    }
  }
  ```

#### Ketentuan:
- URL gambar harus dapat diakses dengan baik.
- Bila album belum memiliki sampul, maka `coverUrl` bernilai null.
- Bila menambahkan sampul pada album yang sudah memiliki sampul, maka sampul lama akan tergantikan.

### Kriteria 3: Menyukai Album
<img src="https://dicoding-web-img.sgp1.cdn.digitaloceanspaces.com/original/academy/dos:5525ed4d2c0bfb75b13b1f675df69e3720211215150450.png">
<br>
*any: merupakan nilai string apa pun selama nilainya tidak kosong.

#### Keterangan:
- Menyukai atau batal menyukai album merupakan resource strict sehingga dibutuhkan autentikasi untuk mengaksesnya. Hal ini bertujuan untuk mengetahui apakah pengguna sudah menyukai album.
- Jika pengguna belum menyukai album, maka aksi **POST** **/albums/{id}/likes** adalah menyukai album. Jika pengguna sudah menyukai album, maka aksinya batal menyukai.

### Kriteria 4 : Menerapkan Server-Side Cache
- Menerapkan server-side cache pada jumlah yang menyukai sebuah album (GET /albums/{id}/likes).
- Cache harus bertahan selama 30 menit.
- Respons yang dihasilkan dari cache harus memiliki custom header properti **X-Data-Source** bernilai “cache”.
- Cache harus dihapus setiap kali ada perubahan jumlah like pada album dengan id tertentu.
- Memory caching engine wajib menggunakan Redis atau Memurai (Windows).
  - Nilai host server Redis wajib menggunakan environment variable **REDIS_SERVER**

### Kriteria 5 :Pertahankan Fitur OpenMusic API versi 2 dan 1
- Pengelolaan Data Album
- Pengelolaan Data Song
- Fitur Registrasi dan Autentikasi Pengguna
- Pengelolaan Data Playlist 
- Menerapkan Foreign Key
- Menerapkan Data Validation
- Penanganan Eror (Error Handling)
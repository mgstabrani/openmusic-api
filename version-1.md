# openmusic-api

## Kriteria OpenMusic API versi 1
### Kriteria 1: Pengelolaan Data Album
<img src="https://dicoding-web-img.sgp1.cdn.digitaloceanspaces.com/original/academy/dos:b285d8d8f11c5d2f72d5ab51df9376e820211215133446.png">
<br>
*any: merupakan nilai string apa pun selama tidak kosong.

### Kriteria 2: Pengelolaan Data Song
<img src="https://dicoding-web-img.sgp1.cdn.digitaloceanspaces.com/original/academy/dos:49e70f7e35f9fa4ef0bd7500f3716c1b20220304101538.png">
<br>
*?: Boleh null atau undefined. <br>
*any: merupakan nilai string apa pun selama nilainya tidak kosong

### Kriteria 3: Menerapkan Data Validation
Wajib menerapkan proses Data Validation pada Request Payload sesuai spesifikasi berikut:
- POST /albums
    - <b>name</b> : string, required.
    - <b>year</b> : number, required.
- PUT /albums
    - <b>name</b> : string, required.
    - <b>year</b> : number, required.
- POST /songs
    - <b>title</b> : string, required.
    - <b>year</b> : number, required.
    - <b>genre</b> : string, required.
    - <b>performer</b> : string, required.
    - <b>duration</b> : number.
    - <b>albumId</b>: string.
- PUT /songs
    - <b>title</b> : string, required.
    - <b>year</b> : number, required.
    - <b>genre</b> : string, required.
    - <b>performer</b> : string, required.
    - <b>duration</b> : number.
    - <b>albumId</b> : string.

### Kriteria 4 : Penanganan Eror (Error Handling)
- Ketika proses validasi data pada request payload tidak sesuai (gagal), server harus mengembalikan response:
    - status code: 400 (Bad Request)
    - response body: 
        - status: <b>fail</b>
        - message: <\apa pun selama tidak kosong>
- Ketika pengguna mengakses resource yang tidak ditemukan, server harus mengembalikan response:
    - status code: 404 (Not Found)
    - response body:
        - status: <b>fail</b>
        - message: <\apa pun selama tidak kosong>
- Ketika terjadi server eror, server harus mengembalikan response:
    - status code: 500 (Internal Server Error)
    - response body:
        - status: <b>error</b>
        - message: <\apa pun selama tidak kosong>

### Kriteria 5 : Menggunakan Database dalam Menyimpan Data album dan lagu
- Data lagu harus disimpan di dalam database menggunakan PostgreSQL agar ketika di-restart data tidak akan hilang.
- Wajib menggunakan teknik migrations dalam mengelola struktur tabel pada database.
- Wajib menyimpan nilai host, post, maupun kredensial dalam mengakses database pada environment variable dengan ketentuan:
    - <b>PGUSER</b> : menyimpan nilai user untuk mengakses database.
    - <b>PGPASSWORD</b> : menyimpan nilai password dari user database.
    - <b>PGDATABASE</b> : menyimpan nilai nama database yang digunakan.
    - <b>PGHOST</b> : menyimpan nilai host yang digunakan oleh database.
    - <b>PGPORT</b> :  menyimpan nilai port yang digunakan oleh database.
- Wajib menggunakan package dotenv serta berkas [.env](https://www.npmjs.com/package/dotenv) dalam mengelola environment variable.

## Kriteria Opsional OpenMusic API versi 1
### Kriteria 1: Memunculkan daftar lagu di dalam detail album
API harus memunculkan daftar lagu di dalam album pada endpoint `GET /albums/{albumId}`.
```
{
  "status": "success",
  "data": {
    "album": {
      "id": "album-Mk8AnmCp210PwT6B",
      "name": "Viva la Vida",
      "year": 2008,
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

### Kriteria 2: Query Parameter untuk Pencarian Lagu
Menerapkan query parameter pada endpoint GET /songs untuk fitur pencarian lagu.
- `?title`: mencari lagu berdasarkan judul lagu.
- `?performer`: mencari lagu berdasarkan performer.
# NotesApp RESTful API

Repositori ini berisi kode sumber untuk proyek Node.js berjudul **NotesApp**, sebuah API RESTful yang dibangun dengan menggunakan framework Hapi.js dan menggunakan database MySQL. NotesApp memungkinkan pengguna untuk mengelola catatan mereka dengan fitur-fitur seperti otentikasi, otorisasi, dan kolaborasi.


## Features

- **User Registration:** Pengguna dapat mendaftar untuk membuat akun baru dalam aplikasi. Proses registrasi ini memungkinkan pengguna untuk mengakses fitur-fitur lain dalam NotesApp.
- **Authentication:** Proses otentikasi diimplementasikan menggunakan JSON Web Tokens (JWT). Pengguna dapat mendaftar, masuk, dan memperoleh token untuk mengotentikasi permintaan mereka ke API.
- **Authorization:** Otorisasi diimplementasikan untuk memastikan bahwa pengguna hanya dapat mengakses dan mengubah catatan mereka sendiri. Setiap catatan terkait dengan pengguna, dan hanya pemilik catatan yang memiliki izin untuk mengedit atau menghapusnya.
- **Collaboration** NotesApp memungkinkan kolaborasi dengan memungkinkan pengguna untuk berbagi catatan mereka dengan pengguna lain. Fitur ini memungkinkan beberapa pengguna untuk mengakses dan berkolaborasi pada catatan yang dibagikan.


## Technologies Used:

- **Node.js**: Sebuah runtime environment JavaScript yang memungkinkan eksekusi kode JavaScript di luar browser web. Ini digunakan dalam NotesApp untuk menyediakan server side, memungkinkan pengolahan permintaan dari client dan interaksi dengan database.
- **MySQL**: Sebuah sistem manajemen basis data relasional yang digunakan untuk menyimpan dan mengelola data aplikasi secara efisien.
- **Hapi.js**: Sebuah framework Node.js yang kuat dan fleksibel untuk membangun aplikasi web dan API dengan cepat dan efisien.
- **JSON Web Tokens (JWT)**: Sebuah standar untuk mentransmisikan informasi secara aman antara pihak sebagai objek JSON. JWT digunakan untuk otentikasi dalam NotesApp, memastikan keamanan dan keaslian permintaan pengguna.


## Getting Started
1. **Clone the repository:**:
    ```bash
    git clone https://github.com/adeiskandarzulkarnaen/notesapp-backend.git
    ```
    ```bash
    cd notesapp-backend
    ```
2. **Install dependencies:**:
    ```bash
    npm install
    ```
3. **Setup .env file:**
   * Salin file `.env.example` menjadi `.env` dengan menjalankan perintah:
        ```bash
        cp .env.example .env
        ```
   * Edit file `.env` sesuai kebutuhan Anda, termasuk pengaturan koneksi database dan konfigurasi lainnya.
4. **Setup the MySQL database:**
    Buat database MySQL sesuai dengan konfigurasi di file `.env`
    ```sql
    CREATE DATABASE database_name;
    ```
5. **Run Database Migrasi:**
    Untuk menjalankan migrasi database, jalankan perintah:
    ```bash
    npm run migrate:up
    ```
6. **Run the application**
    ```bash
    npm start
    ```


## Contributing:

Contributions to the NotesApp project are welcome! If you have any suggestions, bug reports, or feature requests, please open an issue or submit a pull request.


## License:

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

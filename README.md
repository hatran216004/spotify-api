# 🎧 Spotify-clone REST API

API cho nền tảng phát nhạc, hỗ trợ các chức năng quản lý người dùng, bài hát, album, nghệ sĩ, playlist, tìm kiếm và thống kê.

## 🛠 Stack Công Nghệ

- Node.js + Express
- MongoDB + Redis(Cache)
- Multer (upload) & Cloundinary lưu trữ audio + image
- RESTful API structure

## 🌐 Base URL

## Authentication

> ⚠️ Module `auth.route.js` chưa có endpoint. Dự kiến dùng cho đăng ký / đăng nhập và xác thực token.

---

## API Endpoints

### User

| Method | Endpoint                          | Description                            |
| ------ | --------------------------------- | -------------------------------------- |
| GET    | `/users`                          | Lấy danh sách người dùng               |
| GET    | `/users/me`                       | Lấy thông tin người dùng hiện tại      |
| PATCH  | `/users/me`                       | Cập nhật thông tin người dùng (có ảnh) |
| GET    | `/users/me/liked-tracks`          | Lấy danh sách bài hát yêu thích        |
| PATCH  | `/users/me/liked-tracks/:trackId` | Thêm bài hát vào yêu thích             |
| DELETE | `/users/me/liked-tracks/:trackId` | Xoá bài hát khỏi yêu thích             |

---

### Track

| Method | Endpoint               | Description                        |
| ------ | ---------------------- | ---------------------------------- |
| GET    | `/tracks`              | Lấy tất cả bài hát                 |
| GET    | `/tracks/trending`     | Lấy bài hát thịnh hành             |
| GET    | `/tracks/made-for-you` | Lấy bài hát đề xuất cho người dùng |
| GET    | `/tracks/:id`          | Lấy thông tin bài hát              |
| GET    | `/tracks/:id/lyrics`   | Lấy lời bài hát                    |

---

### Album

| Method | Endpoint      | Description         |
| ------ | ------------- | ------------------- |
| GET    | `/albums`     | Lấy danh sách album |
| GET    | `/albums/:id` | Lấy thông tin album |

---

### Artist

| Method | Endpoint   | Description           |
| ------ | ---------- | --------------------- |
| GET    | `/artists` | Lấy danh sách nghệ sĩ |

---

### Playlist

| Method | Endpoint                         | Description                        |
| ------ | -------------------------------- | ---------------------------------- |
| GET    | `/playlists`                     | Lấy danh sách playlist             |
| POST   | `/playlists`                     | Tạo playlist mới                   |
| GET    | `/playlists/:id`                 | Lấy chi tiết playlist              |
| PATCH  | `/playlists/:id`                 | Cập nhật playlist                  |
| DELETE | `/playlists/:id`                 | Xoá playlist                       |
| PATCH  | `/playlists/:id/reorder`         | Sắp xếp lại bài hát trong playlist |
| DELETE | `/playlists/:id/tracks/:trackId` | Xoá bài hát khỏi playlist          |

---

### Search

| Method | Endpoint  | Description                       |
| ------ | --------- | --------------------------------- |
| GET    | `/search` | Tìm kiếm bài hát, artists, albums |

---

### Stats

| Method | Endpoint | Description                                          |
| ------ | -------- | ---------------------------------------------------- |
| GET    | `/stats` | Lấy thống kê tổng số bài hát, artists, users, albums |

---

## Admin API

> Dành cho quản trị viên, thao tác trực tiếp với dữ liệu.

### Tracks (Quản lý bài hát)

| Method | Endpoint            | Description                               |
| ------ | ------------------- | ----------------------------------------- |
| POST   | `/admin/tracks`     | Tạo bài hát mới (upload ảnh/audio/lyrics) |
| PATCH  | `/admin/tracks/:id` | Cập nhật bài hát                          |
| DELETE | `/admin/tracks/:id` | Xoá bài hát                               |

### Artists (Quản lý nghệ sĩ)

| Method | Endpoint             | Description      |
| ------ | -------------------- | ---------------- |
| POST   | `/admin/artists`     | Tạo nghệ sĩ      |
| PATCH  | `/admin/artists/:id` | Cập nhật nghệ sĩ |
| DELETE | `/admin/artists/:id` | Xoá nghệ sĩ      |

### Albums (Quản lý album)

| Method | Endpoint            | Description    |
| ------ | ------------------- | -------------- |
| POST   | `/admin/albums`     | Tạo album      |
| PATCH  | `/admin/albums/:id` | Cập nhật album |
| DELETE | `/admin/albums/:id` | Xoá album      |

---

## 📂 Upload & Middleware

- Một số route yêu cầu `multipart/form-data` để upload hình ảnh hoặc file nhạc (audio).

---

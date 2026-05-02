## Sistem Pengaduan Akademik & Non-Akademik

##  Identitas

* Nama: Muhammad Fachri Wiryansyah
* NIM: 2410511096
* Kelas: B
* Link Youtube Demo: https://youtu.be/L2Q0iN50m9U

---

## Cara Menjalankan Sistem

### 1. Clone Repository

```bash
git clone https://github.com/username/uts-pplos-b-2410511096.git
cd uts-pplos-b-2410511096
```

---

### 2. Setup Database (MySQL)

Buat 4 database:

```
auth_db, berikut adalah tabelnya:
CREATE TABLE users (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NULL,
    email VARCHAR(100) UNIQUE NULL,
    password VARCHAR(255) NULL,
    oauth_provider VARCHAR(50) NULL,
    oauth_id VARCHAR(100) NULL,
    avatar TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    deleted_at DATETIME NULL
);

CREATE TABLE refresh_tokens (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    user_id INT(11) NULL,
    token TEXT NULL,
    expires_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

complaint_db

disposition_db, berikut adalah tabelnya:
CREATE TABLE units (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dispositions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  complaint_id INT,
  unit_id INT,
  status VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  disposition_id INT,
  action VARCHAR(100),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


notification_db, berikut adalah tabelnya:
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  title VARCHAR(255),
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

```

---

### 3. Jalankan Semua Service

#### Auth Service (Port 3001)

```bash
cd services/auth-service
npm install
npm run dev
```

---

#### 🧾 Complaint Service - Laravel (Port 8000)

```bash
cd services/complaint-service
composer install
php artisan migrate
php artisan serve
```

---

#### Disposition Service (Port 3003)

```bash
cd services/disposition-service
npm install
node src/app.js
```

---

#### Notification Service (Port 3004)

```bash
cd services/notification-service
npm install
node src/app.js
```

---

#### API Gateway (Port 3000)

```bash
cd gateway
npm install
node src/app.js
```

---

## Base URL (Gateway)

Semua request harus melalui:

```
http://localhost:3000/
```

---

## Peta Endpoint (Routing Gateway)

### Auth Service

| Method | Endpoint                  |
| ------ | ------------------------- |
| POST   | /api/auth/register        |
| POST   | /api/auth/login           |
| POST   | /api/auth/refresh         |
| POST   | /api/auth/logout          |
| GET    | /api/auth/profile         |
| GET    | /api/auth/google          |
| GET    | /api/auth/google/callback |

---

### Complaint Service

| Method | Endpoint                    |
| ------ | --------------------------- |
| GET    | /api/complaints             |
| POST   | /api/complaints             |
| GET    | /api/complaints/{id}        |
| PUT    | /api/complaints/{id}        |
| DELETE | /api/complaints/{id}        |
| POST   | /api/complaints/{id}/rating |


---

### Disposition Service

| Method | Endpoint                         |
| ------ | -------------------------------- |
| POST   | /api/dispositions                |
| GET    | /api/dispositions/complaint/{id} |
| PUT    | /api/dispositions/{id}           |
| GET    | /api/dispositions/units          |

---

### Notification Service

| Method | Endpoint                     |
| ------ | ---------------------------- |
| POST   | /api/notifications           |
| GET    | /api/notifications/user/{id} |


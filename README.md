# File Upload dengan Cloudinary - User Management & Role-Based System

Aplikasi full-stack untuk upload dan manajemen file menggunakan React, Node.js, MySQL, Sequelize ORM, dan Cloudinary. Production-ready dengan fitur lengkap termasuk autentikasi user, role management, dan konfigurasi Cloudinary per user.

## 🚀 Fitur

### Backend
- ✅ RESTful API dengan Express.js
- ✅ **User Authentication dengan JWT**
- ✅ **Role-based Access Control (Admin, Moderator, User)**
- ✅ **Per-user Cloudinary Configuration**
- ✅ **Encrypted Storage untuk API Secrets**
- ✅ Database MySQL dengan Sequelize ORM
- ✅ Integrasi Cloudinary untuk penyimpanan file
- ✅ Upload single & multiple files
- ✅ Pagination, search, dan filtering
- ✅ Soft delete untuk data uploads
- ✅ Rate limiting & security headers (Helmet)
- ✅ CORS configuration
- ✅ Error handling yang comprehensive
- ✅ File validation (type & size)
- ✅ Upload progress tracking
- ✅ Statistics API

### Frontend
- ✅ React 18 dengan Vite + React Router
- ✅ **Login & Register Pages**
- ✅ **Settings Page (Profile, Cloudinary, Password)**
- ✅ **User Management (Admin/Moderator)**
- ✅ **Protected Routes dengan Role Checking**
- ✅ **Auth Context untuk Global State**
- ✅ Drag & drop file upload
- ✅ Multiple file selection
- ✅ Real-time upload progress
- ✅ File gallery dengan pagination
- ✅ Search & filter functionality
- ✅ Responsive design
- ✅ Toast notifications
- ✅ Image preview
- ✅ File statistics dashboard (per user)

## 📋 Persyaratan

- Node.js >= 16.x
- MySQL >= 5.7 atau >= 8.0
- npm atau yarn
- Akun Cloudinary (gratis di [cloudinary.com](https://cloudinary.com))

## 🛠️ Instalasi

### 1. Clone Repository

```bash
git clone <repository-url>
cd file-upload-cloudinary
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env dan isi dengan kredensial Anda
nano .env  # atau gunakan editor lain
```

#### Konfigurasi .env Backend

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=file_upload_dev
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
DB_SSL=false

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=uploads

# File Upload Configuration
MAX_FILE_SIZE=10485760  # 10MB in bytes
MAX_FILES=5

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# Authentication (NEW!)
JWT_SECRET=your-jwt-secret-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=7d

# Encryption (NEW! - for encrypting Cloudinary API secrets per user)
ENCRYPTION_SECRET=your-encryption-secret-key-change-in-production-min-32-chars
```

#### Setup Database

```bash
# Create database
mysql -u root -p
CREATE DATABASE file_upload_dev;
EXIT;

# Run migrations
npm run db:migrate
```

#### Start Backend Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server akan berjalan di `http://localhost:5000`

### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env
nano .env
```

#### Konfigurasi .env Frontend

```env
VITE_API_URL=http://localhost:5000/api
```

#### Start Frontend

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Frontend akan berjalan di `http://localhost:3000`

## 🎯 Cara Mendapatkan Kredensial Cloudinary

1. Daftar di [cloudinary.com](https://cloudinary.com) (gratis)
2. Login ke dashboard
3. Di halaman dashboard, Anda akan melihat:
   - **Cloud Name**: `CLOUDINARY_CLOUD_NAME`
   - **API Key**: `CLOUDINARY_API_KEY`
   - **API Secret**: `CLOUDINARY_API_SECRET`
4. Copy nilai tersebut ke file `.env` backend

## 📁 Struktur Project

```
file-upload-cloudinary/
├── backend/
│   ├── src/
│   │   ├── config/          # Database & Cloudinary config
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Custom middleware
│   │   ├── migrations/      # Database migrations
│   │   ├── models/          # Sequelize models
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Helper functions
│   │   └── index.js         # App entry point
│   ├── .env.example
│   ├── .sequelizerc
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API services
│   │   ├── styles/          # CSS files
│   │   ├── App.jsx          # Main component
│   │   └── main.jsx         # Entry point
│   ├── .env.example
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## 🔌 API Endpoints

### Health Check
- `GET /health` - Server health check

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile (requires auth)
- `PUT /api/auth/profile` - Update user profile (requires auth)
- `PUT /api/auth/change-password` - Change password (requires auth)
- `POST /api/auth/logout` - Logout user (requires auth)

### User Management Endpoints (Admin/Moderator Only)
- `GET /api/users` - Get all users (admin/moderator)
- `GET /api/users/:id` - Get user by ID (admin/moderator)
- `POST /api/users` - Create new user (admin only)
- `PUT /api/users/:id` - Update user (admin/moderator)
- `DELETE /api/users/:id` - Delete user (admin only)
- `GET /api/users/stats` - Get user statistics (admin only)

### Cloudinary Configuration Endpoints (Requires Auth)
- `GET /api/cloudinary-config` - Get user's Cloudinary config
- `POST /api/cloudinary-config` - Save/Update Cloudinary config
- `POST /api/cloudinary-config/test` - Test Cloudinary credentials
- `DELETE /api/cloudinary-config` - Delete Cloudinary config
- `PATCH /api/cloudinary-config/toggle` - Toggle config active status

### Upload Endpoints (Requires Auth)
- `POST /api/uploads/single` - Upload single file (requires auth)
- `POST /api/uploads/multiple` - Upload multiple files (requires auth)
- `GET /api/uploads` - Get all uploads (with pagination & filters)
- `GET /api/uploads/:id` - Get single upload by ID
- `DELETE /api/uploads/:id` - Delete upload (requires auth)
- `GET /api/uploads/stats` - Get upload statistics

### Query Parameters untuk GET /api/uploads

```
page=1              # Page number
limit=10            # Items per page
resourceType=image  # Filter by type: image, video, raw
sortBy=createdAt    # Sort field: createdAt, size, filename
sortOrder=DESC      # Sort order: ASC, DESC
search=filename     # Search by filename
```

### Contoh Request

#### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "johndoe",
    "password": "password123",
    "fullName": "John Doe"
  }'
```

#### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "login": "user@example.com",
    "password": "password123"
  }'
```

#### Upload Single File (dengan Authentication)

```bash
curl -X POST http://localhost:5000/api/uploads/single \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/image.jpg"
```

#### Upload Multiple Files

```bash
curl -X POST http://localhost:5000/api/uploads/multiple \
  -F "files=@/path/to/image1.jpg" \
  -F "files=@/path/to/image2.jpg"
```

#### Get Uploads with Filters

```bash
curl "http://localhost:5000/api/uploads?page=1&limit=10&resourceType=image&sortOrder=DESC"
```

## 👥 User Roles & Permissions

Aplikasi ini memiliki 3 level user dengan permission yang berbeda:

### 1. **Admin** (Full Access)
- ✅ Manage semua users (create, read, update, delete)
- ✅ View semua uploads dari semua users
- ✅ Access user statistics
- ✅ Manage own profile dan Cloudinary config
- ✅ Upload dan delete files

### 2. **Moderator** (Limited Management)
- ✅ View dan update users (tidak bisa delete)
- ✅ View semua uploads dari semua users
- ✅ Manage own profile dan Cloudinary config
- ✅ Upload dan delete files

### 3. **User** (Basic Access)
- ✅ Manage own profile
- ✅ Configure own Cloudinary account
- ✅ Upload files ke own Cloudinary
- ✅ View dan delete own uploads only
- ✅ View own statistics

### Cara Menggunakan

1. **Register** sebagai user baru (default role: `user`)
2. **Configure Cloudinary** di Settings page:
   - Masuk ke Settings → Cloudinary tab
   - Isi Cloud Name, API Key, dan API Secret
   - Test connection sebelum save
3. **Upload Files** menggunakan own Cloudinary account
4. **Admin** bisa membuat user dengan role `admin` atau `moderator`

## 🚀 Production Deployment

### Backend

1. **Set Environment Variables**
   ```bash
   NODE_ENV=production
   DB_SSL=true  # if using cloud database
   ```

2. **Database Migration**
   ```bash
   npm run db:migrate
   ```

3. **Start Server**
   ```bash
   npm start
   ```

### Frontend

1. **Build**
   ```bash
   npm run build
   ```

2. **Deploy** folder `dist/` ke hosting pilihan Anda:
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - DigitalOcean App Platform
   - dll

### Rekomendasi Hosting

**Backend:**
- Railway
- Render
- Heroku
- DigitalOcean
- AWS EC2

**Database:**
- AWS RDS
- DigitalOcean Managed Database
- PlanetScale
- Railway MySQL

**Frontend:**
- Vercel (recommended)
- Netlify
- Cloudflare Pages

## 🔒 Security Features

- ✅ **JWT Authentication** untuk secure access
- ✅ **Password Hashing** dengan bcrypt
- ✅ **API Secret Encryption** dengan crypto-js (AES)
- ✅ **Role-based Authorization** (Admin, Moderator, User)
- ✅ **Protected Routes** dengan middleware auth
- ✅ Helmet.js untuk security headers
- ✅ CORS protection
- ✅ Rate limiting (100 req/15 min)
- ✅ File type validation
- ✅ File size limits (10MB default)
- ✅ SQL injection protection (Sequelize ORM)
- ✅ Environment variables untuk credentials
- ✅ Error handling yang tidak expose internal details
- ✅ **Per-user Cloudinary isolation** (setiap user pakai own account)

## 📝 File Types yang Didukung

- **Images**: JPEG, JPG, PNG, GIF, WebP, SVG
- **Videos**: MP4, MPEG, MOV
- **Documents**: PDF, DOC, DOCX, XLS, XLSX

Batas ukuran file: **10MB** (configurable via `.env`)

## 🐛 Troubleshooting

### Backend tidak bisa connect ke database

```bash
# Cek apakah MySQL running
sudo systemctl status mysql

# Test koneksi
mysql -u root -p

# Cek credentials di .env
```

### Upload gagal dengan error Cloudinary

```bash
# Pastikan kredensial Cloudinary benar di .env
# Cek di Cloudinary dashboard
# Pastikan CLOUDINARY_FOLDER exist atau set ke "uploads"
```

### CORS Error di Frontend

```bash
# Pastikan CORS_ORIGIN di backend .env sesuai dengan frontend URL
# Default: http://localhost:3000
```

### Migration Error

```bash
# Rollback migration
npm run db:migrate:undo

# Run migration lagi
npm run db:migrate
```

## 📚 Dependencies

### Backend
- express - Web framework
- sequelize - ORM
- mysql2 - MySQL driver
- cloudinary - Cloud storage
- multer - File upload middleware
- helmet - Security headers
- cors - CORS middleware
- joi - Validation
- dotenv - Environment variables

### Frontend
- react - UI library
- vite - Build tool
- axios - HTTP client
- react-dropzone - Drag & drop
- react-icons - Icons
- react-toastify - Notifications

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License - lihat file [LICENSE](LICENSE)

## 👨‍💻 Author

Your Name

## 🙏 Acknowledgments

- Cloudinary untuk cloud storage
- React community
- Express.js team
- Sequelize maintainers

---

**Happy Coding! 🎉**

Jika ada pertanyaan atau issue, silakan buat issue di repository ini.

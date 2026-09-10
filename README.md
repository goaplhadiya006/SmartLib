# 📚 SmartLib - Full-Stack Online Library Management System

SmartLib is a production-level, responsive full-stack **Online Library Management System** built with **React.js (Vite)**, **Tailwind CSS**, **Node.js/Express**, **REST APIs**, **JWT Authentication**, and **MongoDB (Mongoose)**.

---

## 🚀 Key Features

### 👤 User Portal
- **Home Landing Page**: Modern hero section, live book search, stats counters, featured & popular books, category grid, and process walkthrough.
- **Book Catalog**: Comprehensive listing with real-time title/author/ISBN search, category dropdown, availability filter, sorting (rating, newest, year, title), and pagination.
- **Book Details**: Detailed page with large cover, synopsis, ISBN, publication year, total & available copies, rating, wishlist toggle, borrow action, and interactive user reviews.
- **Borrow System**: Instant book borrowing with automatic 14-day due dates, stock decrementing, and unreturned borrow checks.
- **My Borrowed Books**: View active loans, due date countdowns, overdue warnings, and trigger book returns (stock incrementing).
- **Borrowing History**: Log of past returned books.
- **Wishlist System**: Save favorite books to wishlist for quick access and one-click borrowing.
- **User Profile**: Update profile details, change password (max 8 chars), and upload avatar images.
- **Community Feedback & Contact**: Submit ratings, testimonials, and support inquiries.
- **Forgot Password**: Password reset with email verification and max 8-character password enforcement.

### 🛡️ Admin Dashboard (`/admin`)
- **Strict Role-based Route Protection**: Client users cannot view or access any part of the admin panel.
- **Executive Analytics Dashboard**: Real-time KPI summary cards and interactive **Recharts** visualizations (Monthly Borrowing Activity AreaChart, Category Distribution PieChart, Top 5 Borrowed Books BarChart).
- **Manage Books (CRUD)**: Searchable inventory table, add book with Multer image upload or URL, edit details, and delete books.
- **Manage Categories (CRUD)**: Category manager with description, total book count badge, and deletion protection.
- **Manage Users**: User accounts overview with role toggling (`user` <-> `admin`), active loan count, and account deletion.
- **Manage Borrowings & Returns Desk**: Track all member loans, issue return confirmations, and manage check-ins.
- **Overdue Books & Delinquencies**: Automated overdue tracking with direct email reminder links to members.
- **Reports & Analytics**: Printable executive library audit report.` 

---

## 🏃 Run Commands

### Start Backend API Server
```bash
cd server
npm run dev
```
*Server starts on `http://localhost:5000`.*

### Start Frontend Client
```bash
cd client
npm run dev
```
*Frontend opens on `http://localhost:3000`.*

---

## 📡 REST API Summary

### Auth APIs
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user & receive JWT token
- `GET /api/auth/profile` - Get current user profile (Protected)
- `PUT /api/auth/profile` - Update user profile & avatar (Protected)

### Book APIs
- `GET /api/books` - Search, filter, sort & paginate books
- `GET /api/books/featured` - Get top rated featured books
- `GET /api/books/:id` - Get single book details with reviews
- `POST /api/books` - Create book record with cover upload (Admin)
- `PUT /api/books/:id` - Update book record (Admin)
- `DELETE /api/books/:id` - Delete book (Admin)
- `POST /api/books/:id/reviews` - Add review & rating (Protected)

### Category APIs
- `GET /api/categories` - Fetch all categories with book count
- `POST /api/categories` - Create new category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Borrowing APIs
- `POST /api/borrow` - Borrow an available book (Protected)
- `PUT /api/borrow/:id/return` - Return a borrowed book (Protected)
- `GET /api/borrow/my` - Get user's borrowings (Protected)
- `GET /api/borrow/all` - Get all borrowings (Admin)
- `GET /api/borrow/overdue` - Get overdue loans list (Admin)
- `GET /api/borrow/stats` - Get dashboard statistics & chart data (Admin)

### Wishlist & Feedback APIs
- `GET /api/wishlist` - Get saved wishlist (Protected)
- `POST /api/wishlist` - Add book to wishlist (Protected)
- `DELETE /api/wishlist/:id` - Remove book from wishlist (Protected)
- `POST /api/feedback` - Submit user feedback
- `GET /api/feedback` - Get community feedback list

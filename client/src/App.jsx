import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Layouts & Route Guards
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import AdminRoute from './components/AdminRoute';

// Public & User Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Books from './pages/Books';
import BookDetails from './pages/BookDetails';
import Categories from './pages/Categories';
import SearchResults from './pages/SearchResults';
import MyBorrowedBooks from './pages/MyBorrowedBooks';
import BorrowHistory from './pages/BorrowHistory';
import Wishlist from './pages/Wishlist';
import UserProfile from './pages/UserProfile';
import Contact from './pages/Contact';
import Feedback from './pages/Feedback';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageBooks from './pages/admin/ManageBooks';
import AddBook from './pages/admin/AddBook';
import EditBook from './pages/admin/EditBook';
import ManageCategories from './pages/admin/ManageCategories';
import ManageUsers from './pages/admin/ManageUsers';
import ManageBorrowings from './pages/admin/ManageBorrowings';
import ManageReturns from './pages/admin/ManageReturns';
import OverdueBooks from './pages/admin/OverdueBooks';
import AdminFeedback from './pages/admin/AdminFeedback';
import AdminReports from './pages/admin/AdminReports';
import AdminProfile from './pages/admin/AdminProfile';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            {/* Public & User Portal Routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="books" element={<Books />} />
              <Route path="books/:id" element={<BookDetails />} />
              <Route path="categories" element={<Categories />} />
              <Route path="search" element={<SearchResults />} />
              <Route path="my-borrowed" element={<MyBorrowedBooks />} />
              <Route path="borrow-history" element={<BorrowHistory />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="profile" element={<UserProfile />} />
              <Route path="contact" element={<Contact />} />
              <Route path="feedback" element={<Feedback />} />
            </Route>

            {/* Admin Dashboard Routes (Strictly protected by AdminRoute) */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="books" element={<ManageBooks />} />
                <Route path="books/add" element={<AddBook />} />
                <Route path="books/edit/:id" element={<EditBook />} />
                <Route path="categories" element={<ManageCategories />} />
                <Route path="users" element={<ManageUsers />} />
                <Route path="borrowings" element={<ManageBorrowings />} />
                <Route path="returns" element={<ManageReturns />} />
                <Route path="overdue" element={<OverdueBooks />} />
                <Route path="feedback" element={<AdminFeedback />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="profile" element={<AdminProfile />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;

const express = require('express');
const router = express.Router();
const {
  borrowBook,
  returnBook,
  getMyBorrowings,
  getAllBorrowings,
  getOverdueBorrowings,
  getBorrowStats,
} = require('../controllers/borrowController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, borrowBook);
router.get('/my', protect, getMyBorrowings);
router.put('/:id/return', protect, returnBook);
router.get('/all', protect, admin, getAllBorrowings);
router.get('/overdue', protect, admin, getOverdueBorrowings);
router.get('/stats', protect, admin, getBorrowStats);

module.exports = router;

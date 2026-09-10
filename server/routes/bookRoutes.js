const express = require('express');
const router = express.Router();
const {
  getBooks,
  getFeaturedBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  addBookReview,
} = require('../controllers/bookController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getBooks);
router.get('/featured', getFeaturedBooks);
router.get('/:id', getBookById);

router.post('/', protect, admin, upload.single('coverImage'), createBook);
router.put('/:id', protect, admin, upload.single('coverImage'), updateBook);
router.delete('/:id', protect, admin, deleteBook);

router.post('/:id/reviews', protect, addBookReview);

module.exports = router;

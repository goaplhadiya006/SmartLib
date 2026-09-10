const Borrow = require('../models/Borrow');
const Book = require('../models/Book');
const User = require('../models/User');
const Category = require('../models/Category');

// Helper to update overdue status
const checkAndUpdateOverdueStatus = async () => {
  const now = new Date();
  await Borrow.updateMany(
    { status: 'Borrowed', dueDate: { $lt: now } },
    { $set: { status: 'Overdue' } }
  );
};

// @desc    Borrow a book
// @route   POST /api/borrow
// @access  Private
const borrowBook = async (req, res) => {
  try {
    const { bookId, days = 14 } = req.body;
    const userId = req.user._id;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: 'Sorry, no copies of this book are currently available' });
    }

    // Check if user currently has an unreturned copy of this book
    const existingBorrow = await Borrow.findOne({
      user: userId,
      book: bookId,
      status: { $in: ['Borrowed', 'Overdue'] },
    });

    if (existingBorrow) {
      return res.status(400).json({ message: 'You have already borrowed this book and have not returned it yet' });
    }

    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(borrowDate.getDate() + parseInt(days, 10));

    const borrow = await Borrow.create({
      user: userId,
      book: bookId,
      borrowDate,
      dueDate,
      status: 'Borrowed',
    });

    // Reduce available copies
    book.availableCopies -= 1;
    await book.save();

    const populatedBorrow = await Borrow.findById(borrow._id).populate('book').populate('user', 'name email');
    res.status(201).json(populatedBorrow);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Return a borrowed book
// @route   PUT /api/borrow/:id/return
// @access  Private
const returnBook = async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id);

    if (!borrow) {
      return res.status(404).json({ message: 'Borrowing record not found' });
    }

    // Allow user who borrowed or admin to return
    if (borrow.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to return this borrowing record' });
    }

    if (borrow.status === 'Returned') {
      return res.status(400).json({ message: 'Book has already been returned' });
    }

    borrow.status = 'Returned';
    borrow.returnDate = new Date();
    await borrow.save();

    // Increase available copies
    const book = await Book.findById(borrow.book);
    if (book) {
      book.availableCopies += 1;
      await book.save();
    }

    const updatedBorrow = await Borrow.findById(borrow._id).populate('book').populate('user', 'name email');
    res.json(updatedBorrow);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's borrowings
// @route   GET /api/borrow/my
// @access  Private
const getMyBorrowings = async (req, res) => {
  try {
    await checkAndUpdateOverdueStatus();
    const borrowings = await Borrow.find({ user: req.user._id })
      .populate({
        path: 'book',
        populate: { path: 'category', select: 'name' }
      })
      .sort({ createdAt: -1 });

    res.json(borrowings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all borrowings (admin)
// @route   GET /api/borrow/all
// @access  Private/Admin
const getAllBorrowings = async (req, res) => {
  try {
    await checkAndUpdateOverdueStatus();
    const borrowings = await Borrow.find({})
      .populate('user', 'name email role profileImage')
      .populate({
        path: 'book',
        populate: { path: 'category', select: 'name' }
      })
      .sort({ createdAt: -1 });

    res.json(borrowings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get overdue borrowings
// @route   GET /api/borrow/overdue
// @access  Private/Admin
const getOverdueBorrowings = async (req, res) => {
  try {
    await checkAndUpdateOverdueStatus();
    const overdueList = await Borrow.find({ status: 'Overdue' })
      .populate('user', 'name email')
      .populate('book')
      .sort({ dueDate: 1 });

    res.json(overdueList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get stats for Admin Dashboard & Recharts
// @route   GET /api/borrow/stats
// @access  Private/Admin
const getBorrowStats = async (req, res) => {
  try {
    await checkAndUpdateOverdueStatus();

    const totalBooks = await Book.countDocuments({});
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalCategories = await Category.countDocuments({});
    const currentlyBorrowed = await Borrow.countDocuments({ status: 'Borrowed' });
    const overdueBooks = await Borrow.countDocuments({ status: 'Overdue' });

    // Sum total available copies across books
    const books = await Book.find({});
    const availableBooks = books.reduce((acc, b) => acc + b.availableCopies, 0);

    // Monthly borrowing stats (last 6 months)
    const monthlyStatsMap = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = `${months[d.getMonth()]} ${d.getFullYear().toString().substr(-2)}`;
      monthlyStatsMap[label] = { month: label, borrowings: 0, returns: 0 };
    }

    const allBorrows = await Borrow.find({});
    allBorrows.forEach((b) => {
      const bDate = new Date(b.borrowDate);
      const label = `${months[bDate.getMonth()]} ${bDate.getFullYear().toString().substr(-2)}`;
      if (monthlyStatsMap[label]) {
        monthlyStatsMap[label].borrowings += 1;
      }
      if (b.returnDate) {
        const rDate = new Date(b.returnDate);
        const rLabel = `${months[rDate.getMonth()]} ${rDate.getFullYear().toString().substr(-2)}`;
        if (monthlyStatsMap[rLabel]) {
          monthlyStatsMap[rLabel].returns += 1;
        }
      }
    });

    const monthlyStats = Object.values(monthlyStatsMap);

    // Category distribution
    const categories = await Category.find({});
    const categoryStats = await Promise.all(
      categories.map(async (c) => {
        const count = await Book.countDocuments({ category: c._id });
        return { name: c.name, count };
      })
    );

    // Popular books (most borrowed)
    const popularBooksAgg = await Borrow.aggregate([
      { $group: { _id: '$book', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const popularBooks = await Promise.all(
      popularBooksAgg.map(async (item) => {
        const bk = await Book.findById(item._id).select('title author coverImage');
        return {
          title: bk ? bk.title : 'Unknown Book',
          borrowCount: item.count,
        };
      })
    );

    res.json({
      summary: {
        totalBooks,
        totalUsers,
        currentlyBorrowed,
        availableBooks,
        overdueBooks,
        totalCategories,
      },
      monthlyStats,
      categoryStats,
      popularBooks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  borrowBook,
  returnBook,
  getMyBorrowings,
  getAllBorrowings,
  getOverdueBorrowings,
  getBorrowStats,
};

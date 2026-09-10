const Wishlist = require('../models/Wishlist');
const Book = require('../models/Book');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ user: req.user._id })
      .populate({
        path: 'book',
        populate: { path: 'category', select: 'name' },
      })
      .sort({ createdAt: -1 });

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add book to wishlist
// @route   POST /api/wishlist
// @access  Private
const addToWishlist = async (req, res) => {
  try {
    const { bookId } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const existingItem = await Wishlist.findOne({
      user: req.user._id,
      book: bookId,
    });

    if (existingItem) {
      return res.status(400).json({ message: 'Book is already in your wishlist' });
    }

    const item = await Wishlist.create({
      user: req.user._id,
      book: bookId,
    });

    const populatedItem = await Wishlist.findById(item._id).populate({
      path: 'book',
      populate: { path: 'category', select: 'name' },
    });

    res.status(201).json(populatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove book from wishlist
// @route   DELETE /api/wishlist/:id
// @access  Private
const removeFromWishlist = async (req, res) => {
  try {
    const item = await Wishlist.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Wishlist item not found' });
    }

    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Wishlist.deleteOne({ _id: item._id });
    res.json({ message: 'Book removed from wishlist', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};

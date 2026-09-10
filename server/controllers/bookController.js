const Book = require('../models/Book');
const Category = require('../models/Category');

// @desc    Get all books with filter, search, sort, pagination
// @route   GET /api/books
// @access  Public
const getBooks = async (req, res) => {
  try {
    const {
      search,
      category,
      author,
      availability,
      sort,
      page = 1,
      limit = 8,
    } = req.query;

    let query = {};

    // Search filter (title, author, isbn)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } },
      ];
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Author filter
    if (author) {
      query.author = { $regex: author, $options: 'i' };
    }

    // Availability filter
    if (availability === 'available') {
      query.availableCopies = { $gt: 0 };
    } else if (availability === 'unavailable') {
      query.availableCopies = 0;
    }

    // Sorting
    let sortOptions = {};
    if (sort === 'rating') {
      sortOptions = { rating: -1 };
    } else if (sort === 'newest') {
      sortOptions = { createdAt: -1 };
    } else if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sort === 'title_asc') {
      sortOptions = { title: 1 };
    } else if (sort === 'title_desc') {
      sortOptions = { title: -1 };
    } else if (sort === 'year') {
      sortOptions = { publicationYear: -1 };
    } else {
      sortOptions = { createdAt: -1 };
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Book.countDocuments(query);
    const books = await Book.find(query)
      .populate('category', 'name')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.json({
      books,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get top featured books
// @route   GET /api/books/featured
// @access  Public
const getFeaturedBooks = async (req, res) => {
  try {
    const books = await Book.find({})
      .populate('category', 'name')
      .sort({ rating: -1, createdAt: -1 })
      .limit(6);

    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single book by ID
// @route   GET /api/books/:id
// @access  Public
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('category', 'name description');

    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new book
// @route   POST /api/books
// @access  Private/Admin
const createBook = async (req, res) => {
  try {
    const {
      title,
      author,
      description,
      category,
      isbn,
      publicationYear,
      totalCopies,
      availableCopies,
      coverImage,
    } = req.body;

    let imagePath = coverImage || '/uploads/default-book.png';
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    const copies = parseInt(totalCopies, 10) || 1;
    const avail = availableCopies !== undefined ? parseInt(availableCopies, 10) : copies;

    const book = new Book({
      title,
      author,
      description,
      category,
      isbn,
      publicationYear: parseInt(publicationYear, 10),
      totalCopies: copies,
      availableCopies: avail,
      coverImage: imagePath,
    });

    const createdBook = await book.save();
    const populatedBook = await Book.findById(createdBook._id).populate('category', 'name');
    res.status(201).json(populatedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private/Admin
const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      book.title = req.body.title || book.title;
      book.author = req.body.author || book.author;
      book.description = req.body.description || book.description;
      book.category = req.body.category || book.category;
      book.isbn = req.body.isbn || book.isbn;
      book.publicationYear = req.body.publicationYear !== undefined ? parseInt(req.body.publicationYear, 10) : book.publicationYear;
      
      if (req.body.totalCopies !== undefined) {
        const diff = parseInt(req.body.totalCopies, 10) - book.totalCopies;
        book.totalCopies = parseInt(req.body.totalCopies, 10);
        book.availableCopies = Math.max(0, book.availableCopies + diff);
      }

      if (req.body.availableCopies !== undefined) {
        book.availableCopies = parseInt(req.body.availableCopies, 10);
      }

      if (req.file) {
        book.coverImage = `/uploads/${req.file.filename}`;
      } else if (req.body.coverImage) {
        book.coverImage = req.body.coverImage;
      }

      const updatedBook = await book.save();
      const populatedBook = await Book.findById(updatedBook._id).populate('category', 'name');
      res.json(populatedBook);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Admin
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      await Book.deleteOne({ _id: book._id });
      res.json({ message: 'Book deleted successfully' });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add review to book
// @route   POST /api/books/:id/reviews
// @access  Private
const addBookReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const book = await Book.findById(req.params.id);

    if (book) {
      const alreadyReviewed = book.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'You have already reviewed this book' });
      }

      const review = {
        user: req.user._id,
        userName: req.user.name,
        rating: Number(rating),
        comment,
      };

      book.reviews.push(review);
      book.rating =
        book.reviews.reduce((acc, item) => item.rating + acc, 0) / book.reviews.length;

      await book.save();
      res.status(201).json({ message: 'Review added', reviews: book.reviews, rating: book.rating });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBooks,
  getFeaturedBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  addBookReview,
};

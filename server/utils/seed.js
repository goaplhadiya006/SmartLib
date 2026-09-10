const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const path = require('path');

const User = require('../models/User');
const Category = require('../models/Category');
const Book = require('../models/Book');
const Borrow = require('../models/Borrow');
const Wishlist = require('../models/Wishlist');
const Feedback = require('../models/Feedback');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/online-library';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing collection data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Book.deleteMany({});
    await Borrow.deleteMany({});
    await Wishlist.deleteMany({});
    await Feedback.deleteMany({});

    console.log('Existing collections cleared.');

    // 1. Create Admin & Users
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('Admin123', salt);
    const userPassword = await bcrypt.hash('User1234', salt);

    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@library.com',
      password: adminPassword,
      role: 'admin',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    });

    const user1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: userPassword,
      role: 'user',
      profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    });

    const user2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: userPassword,
      role: 'user',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    });

    const user3 = await User.create({
      name: 'Alex Johnson',
      email: 'alex@example.com',
      password: userPassword,
      role: 'user',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    });

    console.log('Users created.');

    // 2. Create Categories
    const categoriesData = [
      { name: 'Computer Science & Tech', description: 'Software engineering, artificial intelligence, networking, and programming languages.' },
      { name: 'Fiction & Literature', description: 'Bestselling novels, classic literature, sci-fi, and compelling mysteries.' },
      { name: 'Business & Finance', description: 'Entrepreneurship, leadership, economics, and financial independence.' },
      { name: 'Science & Mathematics', description: 'Physics, biology, mathematics, chemistry, and space exploration.' },
      { name: 'History & Biography', description: 'Historical records, memoirs, world history, and political philosophy.' },
      { name: 'Self-Improvement', description: 'Personal development, productivity, psychology, and wellness.' },
    ];

    const createdCategories = await Category.insertMany(categoriesData);
    console.log('Categories created.');

    const catMap = {};
    createdCategories.forEach((c) => {
      catMap[c.name] = c._id;
    });

    // 3. Create Sample Books
    const booksData = [
      {
        title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        author: 'Robert C. Martin',
        description: 'Even bad code can function. But if code isn’t clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code.',
        category: catMap['Computer Science & Tech'],
        isbn: '978-0132350884',
        publicationYear: 2008,
        coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80',
        totalCopies: 8,
        availableCopies: 6,
        rating: 4.8,
        reviews: [
          { user: user1._id, userName: user1.name, rating: 5, comment: 'Must read for every developer! Transformed how I write code.' },
          { user: user2._id, userName: user2.name, rating: 4, comment: 'Very practical advice and solid principles.' },
        ],
      },
      {
        title: 'Designing Data-Intensive Applications',
        author: 'Martin Kleppmann',
        description: 'Data is at the center of many software applications today. Key considerations include data scalability, consistency, reliability, efficiency, and maintainability.',
        category: catMap['Computer Science & Tech'],
        isbn: '978-1449373320',
        publicationYear: 2017,
        coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
        totalCopies: 5,
        availableCopies: 4,
        rating: 4.9,
        reviews: [
          { user: user3._id, userName: user3.name, rating: 5, comment: 'The gold standard for distributed systems and databases.' },
        ],
      },
      {
        title: 'The Pragmatic Programmer',
        author: 'Andrew Hunt & David Thomas',
        description: 'The Pragmatic Programmer cuts through the increasing specialization and technicalities of modern software development to examine the core process.',
        category: catMap['Computer Science & Tech'],
        isbn: '978-0135957059',
        publicationYear: 2019,
        coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
        totalCopies: 6,
        availableCopies: 5,
        rating: 4.7,
      },
      {
        title: 'Atomic Habits',
        author: 'James Clear',
        description: 'No matter your goals, Atomic Habits offers a proven framework for improving—every day. James Clear reveals practical strategies that will teach you how to form good habits.',
        category: catMap['Self-Improvement'],
        isbn: '978-0735211292',
        publicationYear: 2018,
        coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80',
        totalCopies: 10,
        availableCopies: 7,
        rating: 4.9,
        reviews: [
          { user: user1._id, userName: user1.name, rating: 5, comment: 'Life changing book! Small habits really compound over time.' },
        ],
      },
      {
        title: 'The Psychology of Money',
        author: 'Morgan Housel',
        description: 'Doing well with money isn’t necessarily about what you know. It’s about how you behave. And behavior is hard to teach, even to really smart people.',
        category: catMap['Business & Finance'],
        isbn: '978-0857197689',
        publicationYear: 2020,
        coverImage: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=600&auto=format&fit=crop&q=80',
        totalCopies: 7,
        availableCopies: 5,
        rating: 4.8,
      },
      {
        title: 'Sapiens: A Brief History of Humankind',
        author: 'Yuval Noah Harari',
        description: 'One hundred thousand years ago, at least six human species inhabited the earth. Today there is just one. Us. Homo sapiens. How did our species succeed in the battle for dominance?',
        category: catMap['History & Biography'],
        isbn: '978-0062316097',
        publicationYear: 2014,
        coverImage: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&auto=format&fit=crop&q=80',
        totalCopies: 8,
        availableCopies: 6,
        rating: 4.6,
      },
      {
        title: 'Dune',
        author: 'Frank Herbert',
        description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is spice.',
        category: catMap['Fiction & Literature'],
        isbn: '978-0441172719',
        publicationYear: 1965,
        coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&auto=format&fit=crop&q=80',
        totalCopies: 6,
        availableCopies: 4,
        rating: 4.9,
      },
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        description: 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it, To Kill A Mockingbird became an instant bestseller.',
        category: catMap['Fiction & Literature'],
        isbn: '978-0060935467',
        publicationYear: 1960,
        coverImage: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=600&auto=format&fit=crop&q=80',
        totalCopies: 4,
        availableCopies: 3,
        rating: 4.8,
      },
      {
        title: 'Thinking, Fast and Slow',
        author: 'Daniel Kahneman',
        description: 'In his mega-bestseller, Daniel Kahneman takes us on a groundbreaking tour of the mind and explains the two systems that drive the way we think.',
        category: catMap['Science & Mathematics'],
        isbn: '978-0374533557',
        publicationYear: 2011,
        coverImage: 'https://images.unsplash.com/photo-1509021436468-d5103974984a?w=600&auto=format&fit=crop&q=80',
        totalCopies: 5,
        availableCopies: 4,
        rating: 4.5,
      },
      {
        title: 'Zero to One: Notes on Startups',
        author: 'Peter Thiel',
        description: 'The great secret of our time is that there are still uncharted frontiers to explore and new inventions to create. In Zero to One, legendary entrepreneur Peter Thiel shows how.',
        category: catMap['Business & Finance'],
        isbn: '978-0804139298',
        publicationYear: 2014,
        coverImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&auto=format&fit=crop&q=80',
        totalCopies: 6,
        availableCopies: 5,
        rating: 4.6,
      },
      {
        title: 'Deep Work: Rules for Focused Success in a Distracted World',
        author: 'Cal Newport',
        description: 'Deep work is the ability to focus without distraction on a cognitively demanding task. It’s a skill that allows you to quickly master complicated information.',
        category: catMap['Self-Improvement'],
        isbn: '978-1455586691',
        publicationYear: 2016,
        coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&auto=format&fit=crop&q=80',
        totalCopies: 7,
        availableCopies: 6,
        rating: 4.7,
      },
      {
        title: 'A Brief History of Time',
        author: 'Stephen Hawking',
        description: 'A landmark volume in science writing by one of the great minds of our time, Stephen Hawking explores profound questions about the universe.',
        category: catMap['Science & Mathematics'],
        isbn: '978-0553380163',
        publicationYear: 1988,
        coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
        totalCopies: 4,
        availableCopies: 3,
        rating: 4.7,
      },
      {
        title: 'Steve Jobs',
        author: 'Walter Isaacson',
        description: 'Based on more than forty interviews with Steve Jobs conducted over two years, this is the definitive biography of the revolutionary founder of Apple.',
        category: catMap['History & Biography'],
        isbn: '978-1451648539',
        publicationYear: 2011,
        coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&auto=format&fit=crop&q=80',
        totalCopies: 5,
        availableCopies: 4,
        rating: 4.8,
      },
      {
        title: 'Refactoring: Improving the Design of Existing Code',
        author: 'Martin Fowler',
        description: 'For more than twenty years, serious programmers have relied on Martin Fowler’s Refactoring to improve the structural integrity of legacy software.',
        category: catMap['Computer Science & Tech'],
        isbn: '978-0134757599',
        publicationYear: 2018,
        coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
        totalCopies: 4,
        availableCopies: 3,
        rating: 4.8,
      },
      {
        title: '1984',
        author: 'George Orwell',
        description: 'Winston Smith toes the Party line, rewriting history to satisfy the Ministry of Truth. With every lie he writes, Winston comes to hate the Party that seeks power for its own sake.',
        category: catMap['Fiction & Literature'],
        isbn: '978-0451524935',
        publicationYear: 1949,
        coverImage: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=600&auto=format&fit=crop&q=80',
        totalCopies: 8,
        availableCopies: 6,
        rating: 4.9,
      },
      {
        title: 'The Intelligent Investor',
        author: 'Benjamin Graham',
        description: 'The greatest investment advisor of the twentieth century, Benjamin Graham, taught and inspired people worldwide. His philosophy of value investing remains unmatched.',
        category: catMap['Business & Finance'],
        isbn: '978-0060555665',
        publicationYear: 1949,
        coverImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80',
        totalCopies: 5,
        availableCopies: 4,
        rating: 4.7,
      },
    ];

    const createdBooks = await Book.insertMany(booksData);
    console.log(`${createdBooks.length} books created.`);

    // 4. Create Sample Borrowings
    const today = new Date();
    const past15Days = new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000);
    const past5Days = new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000);
    const future9Days = new Date(today.getTime() + 9 * 24 * 60 * 60 * 1000);
    const overdueDate = new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000);
    const pastDueDate = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);

    const borrowingsData = [
      {
        user: user1._id,
        book: createdBooks[0]._id, // Clean Code
        borrowDate: past5Days,
        dueDate: future9Days,
        status: 'Borrowed',
      },
      {
        user: user2._id,
        book: createdBooks[3]._id, // Atomic Habits
        borrowDate: past15Days,
        dueDate: pastDueDate,
        returnDate: past5Days,
        status: 'Returned',
      },
      {
        user: user3._id,
        book: createdBooks[6]._id, // Dune
        borrowDate: overdueDate,
        dueDate: pastDueDate,
        status: 'Overdue',
      },
    ];

    await Borrow.insertMany(borrowingsData);
    console.log('Sample borrowings created.');

    // 5. Create Wishlist Entries
    await Wishlist.create({ user: user1._id, book: createdBooks[1]._id });
    await Wishlist.create({ user: user1._id, book: createdBooks[4]._id });
    await Wishlist.create({ user: user2._id, book: createdBooks[0]._id });
    console.log('Wishlist entries created.');

    // 6. Create Feedback Entries
    await Feedback.create({
      user: user1._id,
      name: user1.name,
      email: user1.email,
      message: 'The online library collection is outstanding! Borrowing books is so fast and intuitive.',
      rating: 5,
    });

    await Feedback.create({
      user: user2._id,
      name: user2.name,
      email: user2.email,
      message: 'Love the modern user interface and clean responsive dashboard on mobile.',
      rating: 5,
    });

    await Feedback.create({
      name: 'Sarah Connor',
      email: 'sarah@example.com',
      message: 'Great platform! Would love to see more tech eBooks added to the repository.',
      rating: 4,
    });

    console.log('Sample feedback entries created.');
    console.log('--- SEEDING COMPLETED SUCCESSFULLY ---');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();

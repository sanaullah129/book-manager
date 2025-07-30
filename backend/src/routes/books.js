const express = require("express");
const router = express.Router();
const authMiddleware = require("../authMiddleware");
const { v4: uuidv4 } = require("uuid");
let books = require("../data/books");
const {
  logger,
  createErrorResponse,
  createSuccessResponse,
  asyncHandler,
} = require("../utils/errorHandler");

// Input validation for book data
const validateBookInput = (req, res, next) => {
  const { title, author, genre, yearPublished } = req.body;
  const errors = {};

  if (!title || typeof title !== 'string' || title.trim().length < 1) {
    errors.title = 'Title is required and must be a non-empty string';
  }

  if (!author || typeof author !== 'string' || author.trim().length < 1) {
    errors.author = 'Author is required and must be a non-empty string';
  }

  if (!genre || typeof genre !== 'string' || genre.trim().length < 1) {
    errors.genre = 'Genre is required and must be a non-empty string';
  }

  if (!yearPublished || typeof yearPublished !== 'number' || yearPublished < 1000 || yearPublished > new Date().getFullYear() + 1) {
    errors.yearPublished = `Year published must be a number between 1000 and ${new Date().getFullYear() + 1}`;
  }

  if (Object.keys(errors).length > 0) {
    logger.warn('Book validation failed', {
      errors,
      requestData: req.body,
      user: req.user?.username,
      ip: req.ip
    });

    return res.status(400).json(
      createErrorResponse('Validation failed', 400, { validationErrors: errors })
    );
  }

  next();
};

// GET /books - Get all books
router.get("/", authMiddleware, asyncHandler(async (req, res) => {
  try {
    logger.info('Fetching all books', {
      user: req.user?.username,
      totalBooks: books.length
    });

    res.json(createSuccessResponse(
      books,
      `Retrieved ${books.length} books successfully`
    ));

  } catch (error) {
    logger.error('Error fetching books', error, {
      user: req.user?.username
    });
    throw new Error('Unable to fetch books at this time');
  }
}));

// POST /books - Create a new book
router.post("/", authMiddleware, validateBookInput, asyncHandler(async (req, res) => {
  try {
    const { title, author, genre, yearPublished } = req.body;

    // Check for duplicate books (same title and author)
    const existingBook = books.find(book =>
      book.title.toLowerCase() === title.toLowerCase() &&
      book.author.toLowerCase() === author.toLowerCase()
    );

    if (existingBook) {
      logger.warn('Attempt to create duplicate book', {
        title,
        author,
        user: req.user?.username,
        existingBookId: existingBook.id
      });

      return res.status(409).json(
        createErrorResponse(
          'A book with this title and author already exists',
          409,
          { existingBook: { id: existingBook.id, title: existingBook.title, author: existingBook.author } }
        )
      );
    }

    const newBook = {
      id: uuidv4(),
      title: title.trim(),
      author: author.trim(),
      genre: genre.trim(),
      yearPublished,
      createdAt: new Date().toISOString(),
      createdBy: req.user?.username
    };

    books.push(newBook);

    logger.info('Book created successfully', {
      bookId: newBook.id,
      title: newBook.title,
      author: newBook.author,
      user: req.user?.username
    });

    res.status(201).json(createSuccessResponse(
      newBook,
      'Book created successfully'
    ));

  } catch (error) {
    logger.error('Error creating book', error, {
      requestData: req.body,
      user: req.user?.username
    });
    throw new Error('Unable to create book at this time');
  }
}));

// PUT /books/:id - Update a book
router.put("/:id", authMiddleware, validateBookInput, asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, genre, yearPublished } = req.body;

    if (!id || typeof id !== 'string') {
      return res.status(400).json(
        createErrorResponse('Valid book ID is required', 400)
      );
    }

    const index = books.findIndex(book => book.id === id);

    if (index === -1) {
      logger.warn('Attempt to update non-existent book', {
        bookId: id,
        user: req.user?.username
      });

      return res.status(404).json(
        createErrorResponse('Book not found', 404, { bookId: id })
      );
    }

    // Check for duplicate books (excluding current book)
    const existingBook = books.find(book =>
      book.id !== id &&
      book.title.toLowerCase() === title.toLowerCase() &&
      book.author.toLowerCase() === author.toLowerCase()
    );

    if (existingBook) {
      logger.warn('Attempt to update book to duplicate title/author', {
        bookId: id,
        title,
        author,
        user: req.user?.username,
        conflictingBookId: existingBook.id
      });

      return res.status(409).json(
        createErrorResponse(
          'Another book with this title and author already exists',
          409,
          { conflictingBook: { id: existingBook.id, title: existingBook.title, author: existingBook.author } }
        )
      );
    }

    const originalBook = { ...books[index] };
    books[index] = {
      ...books[index],
      title: title.trim(),
      author: author.trim(),
      genre: genre.trim(),
      yearPublished,
      updatedAt: new Date().toISOString(),
      updatedBy: req.user?.username
    };

    logger.info('Book updated successfully', {
      bookId: id,
      originalTitle: originalBook.title,
      newTitle: books[index].title,
      user: req.user?.username
    });

    res.json(createSuccessResponse(
      books[index],
      'Book updated successfully'
    ));

  } catch (error) {
    logger.error('Error updating book', error, {
      bookId: req.params.id,
      requestData: req.body,
      user: req.user?.username
    });
    throw new Error('Unable to update book at this time');
  }
}));

// DELETE /books/:id - Delete a book
router.delete("/:id", authMiddleware, asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
      return res.status(400).json(
        createErrorResponse('Valid book ID is required', 400)
      );
    }

    const bookIndex = books.findIndex(book => book.id === id);

    if (bookIndex === -1) {
      logger.warn('Attempt to delete non-existent book', {
        bookId: id,
        user: req.user?.username
      });

      return res.status(404).json(
        createErrorResponse('Book not found', 404, { bookId: id })
      );
    }

    const deletedBook = books[bookIndex];
    books = books.filter(book => book.id !== id);

    logger.info('Book deleted successfully', {
      bookId: id,
      title: deletedBook.title,
      author: deletedBook.author,
      user: req.user?.username
    });

    res.json(createSuccessResponse(
      { deletedBook: { id: deletedBook.id, title: deletedBook.title, author: deletedBook.author } },
      'Book deleted successfully'
    ));

  } catch (error) {
    logger.error('Error deleting book', error, {
      bookId: req.params.id,
      user: req.user?.username
    });
    throw new Error('Unable to delete book at this time');
  }
}));

// GET /books/:id - Get a specific book
router.get("/:id", authMiddleware, asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
      return res.status(400).json(
        createErrorResponse('Valid book ID is required', 400)
      );
    }

    const book = books.find(book => book.id === id);

    if (!book) {
      logger.warn('Attempt to fetch non-existent book', {
        bookId: id,
        user: req.user?.username
      });

      return res.status(404).json(
        createErrorResponse('Book not found', 404, { bookId: id })
      );
    }

    logger.info('Book fetched successfully', {
      bookId: id,
      title: book.title,
      user: req.user?.username
    });

    res.json(createSuccessResponse(
      book,
      'Book retrieved successfully'
    ));

  } catch (error) {
    logger.error('Error fetching book', error, {
      bookId: req.params.id,
      user: req.user?.username
    });
    throw new Error('Unable to fetch book at this time');
  }
}));

module.exports = router;

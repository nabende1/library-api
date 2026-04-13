const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const getBooksCollection = () => mongodb.getdatabase().db().collection('books');

// GET /books
const getAll = async (req, res) => {
  try {
    const results = await getBooksCollection().find({}).toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};

// GET /books/:id
const getSingle = async (req, res) => {
  try {
    const bookId = new ObjectId(req.params.id);
    const result = await getBooksCollection().findOne({ _id: bookId });

    if (!result) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (error) {
    if (error.name === 'BSONError') {
      return res.status(400).json({ error: 'Invalid book ID format' });
    }
    console.error('Error fetching book:', error);
    res.status(500).json({ error: 'Failed to fetch book' });
  }
};

// POST /books
const create = async (req, res) => {
  try {
    const {
      title,
      author,
      isbn,
      genre,
      publishedYear,
      publisher,
      description,
      pageCount,
      language,
      available
    } = req.body;

    if (!title || !author || !isbn || !genre || !publishedYear || !publisher || !description) {
      return res.status(400).json({
        error: 'Required fields: title, author, isbn, genre, publishedYear, publisher, description'
      });
    }

    if (typeof publishedYear !== 'number' || publishedYear < 1000 || publishedYear > 9999) {
      return res.status(400).json({ error: 'publishedYear must be a 4-digit number' });
    }

    if (pageCount !== undefined && (typeof pageCount !== 'number' || pageCount < 1)) {
      return res.status(400).json({ error: 'pageCount must be a positive number' });
    }

    const newBook = {
      title,
      author,
      isbn,
      genre,
      publishedYear,
      publisher,
      description,
      pageCount: pageCount || null,
      language: language || 'English',
      available: available !== undefined ? Boolean(available) : true
    };

    const response = await getBooksCollection().insertOne(newBook);

    res.setHeader('Content-Type', 'application/json');
    res.status(201).json({ message: 'Book created successfully', id: response.insertedId });
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ error: 'Failed to create book' });
  }
};

// PUT /books/:id
const update = async (req, res) => {
  try {
    const bookId = new ObjectId(req.params.id);
    const {
      title,
      author,
      isbn,
      genre,
      publishedYear,
      publisher,
      description,
      pageCount,
      language,
      available
    } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (author !== undefined) updateData.author = author;
    if (isbn !== undefined) updateData.isbn = isbn;
    if (genre !== undefined) updateData.genre = genre;
    if (publishedYear !== undefined) {
      if (typeof publishedYear !== 'number' || publishedYear < 1000 || publishedYear > 9999) {
        return res.status(400).json({ error: 'publishedYear must be a 4-digit number' });
      }
      updateData.publishedYear = publishedYear;
    }
    if (publisher !== undefined) updateData.publisher = publisher;
    if (description !== undefined) updateData.description = description;
    if (pageCount !== undefined) {
      if (typeof pageCount !== 'number' || pageCount < 1) {
        return res.status(400).json({ error: 'pageCount must be a positive number' });
      }
      updateData.pageCount = pageCount;
    }
    if (language !== undefined) updateData.language = language;
    if (available !== undefined) updateData.available = Boolean(available);

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'At least one field must be provided for update' });
    }

    const response = await getBooksCollection().updateOne({ _id: bookId }, { $set: updateData });

    if (response.matchedCount === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ message: 'Book updated successfully' });
  } catch (error) {
    if (error.name === 'BSONError') {
      return res.status(400).json({ error: 'Invalid book ID format' });
    }
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'Failed to update book' });
  }
};

// DELETE /books/:id
const remove = async (req, res) => {
  try {
    const bookId = new ObjectId(req.params.id);

    const response = await getBooksCollection().deleteOne({ _id: bookId });

    if (response.deletedCount === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    if (error.name === 'BSONError') {
      return res.status(400).json({ error: 'Invalid book ID format' });
    }
    console.error('Error deleting book:', error);
    res.status(500).json({ error: 'Failed to delete book' });
  }
};

module.exports = { getAll, getSingle, create, update, remove };

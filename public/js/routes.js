const express = require('express');
const {Book, filterBooks} = require('./book');
const utils = require("./utils");

// load json with books
let books = require('../json/books.json').map((book) => new Book(book));

const router = express.Router();

// GET / - welcome page
router.get('/', (req, res) => {
    return res.render('main');
});

// GET /books - get all books (supports filtering by available and overdue)
router.get('/books', (req, res) => {
    const filteredBooks = filterBooks(books, req.query);
    // if request from ajax return json
    if (req.xhr) {
        return res.status(200).json(filteredBooks);
    }
    // otherwise render page
    return res.render('books', { books: filteredBooks });
});

// GET /books/:id - get book by id
router.get('/books/:id', (req, res) => {
    const sId = req.params.id;
    if (utils.checkRequiredInteger(sId, res, 'id')) return res;

    const id = utils.toInteger(sId);
    const book = books.find(book => book.id === id);
    if (!book) {
        return res.status(404).send({ error: 'Book not found' });
    }

    return res.render('book', { book: book });
});

// POST /books - create book
router.post('/books', (req, res) => {
    const { title, author, year } = req.body;
    if (utils.checkRequiredString(title, res, 'title')) return res;
    if (utils.checkRequiredString(author, res, 'author')) return res;
    if (utils.checkRequiredInteger(year, res, 'year')) return res;

    books.push(new Book({
        title: title,
        author: author,
        year: utils.toInteger(year),
    }));
    return res.status(201).send({ message: 'Book created' });
});

// PUT /books/:id - update book by id
router.put('/books/:id', (req, res) => {
    const sId = req.params.id;
    const { title, author, year } = req.body;
    if (utils.checkRequiredInteger(sId, res, 'id')) return res;
    if (utils.checkRequiredString(title, res, 'title')) return res;
    if (utils.checkRequiredString(author, res, 'author')) return res;
    if (utils.checkRequiredInteger(year, res, 'year')) return res;

    const id = utils.toInteger(sId);
    const book = books.find(book => book.id === id);
    if (!book) {
        return res.status(404).send({ message: 'Book not found' });
    }

    book.updateBook({
        title: title,
        author: author,
        year: utils.toInteger(year)
    });
    return res.status(200).send({ message: 'Book updated' });
});

// DELETE /books/:id - delete book by id
router.delete('/books/:id', (req, res) => {
    const sId = req.params.id;
    if (utils.checkRequiredInteger(sId, res, 'id')) return res;

    const id = utils.toInteger(sId);
    const bookIndex = books.findIndex(b => b.id === id);
    if (bookIndex === -1) {
        return res.status(404).send({ error: 'Book not found' });
    }

    books = books.filter(book => book.id !== id);
    return res.status(200).send({ message: 'Book deleted' });
});

// POST /books/:id/checkout - give book to username
router.post('/books/:id/checkout', (req, res) => {
    const sId = req.params.id;
    const { username, returnDate } = req.body;
    if (utils.checkRequiredInteger(sId, res, 'id')) return res;
    if (utils.checkReturnDate(returnDate, res)) return res;
    if (utils.checkRequiredString(username, res, 'username')) return res;

    const id = utils.toInteger(sId);
    const book = books.find(book => book.id === id && book.available);
    if (!book) {
        return res.status(404).send({ error: 'Book not found' });
    }

    book.updateBook({
        available: false,
        checkedOutBy: {
            name: username,
            returnDate: returnDate,
        },
    });
    return res.status(200).send({ message: 'Book checked out' });
});

// POST /books/:id/return - return book
router.post('/books/:id/return', (req, res) => {
    const sId = req.params.id;
    if (utils.checkRequiredInteger(sId, res, 'id')) return res;

    const id = utils.toInteger(sId);
    const book = books.find(book => book.id === id && !book.available);
    if (!book) {
        return res.status(404).send({ error: 'Book not found' });
    }

    book.updateBook({ available: true });
    book.resetCheckedOutBy();
    return res.status(200).send({ message: 'Book returned' });
});

// not serving get pages
router.get('*', (req, res) => {
    return res.status(404).render('error');
});

module.exports = router;

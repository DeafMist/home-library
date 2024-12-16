const process = require('node:process');
const express = require('express');
const fs = require('fs');
const { router } = require('./public/js/routes');

const app = express();

// template settings
app.set('view engine', 'ejs');
app.set('views', 'public/views');
// static folder
app.use(express.static('public'));
// use json in http body
app.use(express.json());
// serve form's data
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/', router);

// start server
app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});

// shutdown hook that saves modified books in json
const saveBooks = () => {
    const { books } = require('./public/js/routes');
    const booksWithoutId = books.map(({ id, ...rest }) => rest);
    console.log('Saving books...');
    fs.writeFileSync('./public/json/books.json', JSON.stringify(booksWithoutId, null, 2));
};

// application closure handlers
process.on('SIGINT', () => {
    saveBooks();
    process.exit(0);
});

process.on('SIGTERM', () => {
    saveBooks();
    process.exit(0);
});

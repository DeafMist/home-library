const utils = require('./utils');

const Book = class Book {
    // books count that provide book's id
    static bookCount = 0;

    constructor(book) {
        this.validateBook(book);
        this.id = Book.bookCount++;
        this.title = book.title;
        this.author = book.author;
        this.year = book.year;
        // true by default
        this.available = book.available ?? true;
        if (book.checkedOutBy) {
            this.updateCheckedOutBy(book.checkedOutBy);
        } else {
            this.resetCheckedOutBy();
        }
    }

    // validate require fields
    validateBook(book) {
        if (!utils.isString(book.author) || utils.isNullOrEmpty(book.author)) {
            throw new Error(`${book.author} is not a valid author.`);
        }

        if (!utils.isString(book.title) || utils.isNullOrEmpty(book.title)) {
            throw new Error(`${book.title} is not a valid title.`);
        }

        if (!Number.isInteger(book.year)) {
            throw new Error(`${book.year} is not a valid year.`);
        }

        if (book.available != null && !utils.isBoolean(book.available)) {
            throw new Error(`${book.available} is not a valid available.`);
        }
    }

    updateBook(book) {
        this.title = this.updateField(book.title, this.title);
        this.author = this.updateField(book.author, this.author);
        this.year = Number.isInteger(book.year) ? book.year : this.year;
        this.available = utils.isBoolean(book.available) ? book.available : this.available;
        if (book.checkedOutBy) this.updateCheckedOutBy(book.checkedOutBy);
    }

    updateField(newValue, currentValue) {
        return (utils.isString(newValue) && !utils.isNullOrEmpty(newValue)) ? newValue : currentValue;
    }

    updateCheckedOutBy(checkedOutBy) {
        this.checkedOutBy.name = this.updateField(checkedOutBy.name, this.checkedOutBy.name);
        if (utils.isDate(checkedOutBy.returnDate)) {
            this.checkedOutBy.returnDate = new Date(checkedOutBy.returnDate);
        }
    }

    resetCheckedOutBy() {
        this.checkedOutBy = {
            name: null,
            returnDate: null,
        };
    }
}

// utility function for filtering books
const filterBooks = (books, filters) => {
    return books.filter(book => {
        // filter by available if true
        const matchesAvailable = filters.available === 'true'
            ? book.available === true
            : true;

        // filter by overdue if true
        const matchesReturnDate = filters.overdue === 'true'
            ? book.checkedOutBy.returnDate != null && utils.isDateBeforeToday(new Date(book.checkedOutBy.returnDate))
            : true;

        return matchesAvailable && matchesReturnDate;
    });
}

module.exports = {
    Book,
    filterBooks,
};

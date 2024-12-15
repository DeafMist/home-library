// serve clicks on filter checkboxes
$(document).ready(() => {
    $('#filter-available, #filter-overdue').change(() => updateBookList());
});

// add book dialog
document.getElementById('add-book-btn').onclick = () =>
    document.getElementById('add-book-dialog').showModal();
const closeDialog = () =>
    document.getElementById('add-book-dialog').close();

// delete book with ajax by sending request to DELETE /books/:id
const deleteBook = (id) => {
    if(confirm('Вы уверены, что хотите удалить эту книгу?')) {
        $.ajax({
            url: `/books/${id}`,
            type: 'DELETE',
            success: function(response) {
                location.reload();
            },
            error: function(error) {
                alert(error.responseJSON.error);
            }
        });
    }
};

// create book with ajax by sending request to POST /books
const addBook = (event) => {
    event.preventDefault();
    const formData = $(event.target).serialize();
    $.ajax({
        type: 'POST',
        url: '/books',
        data: formData,
        success: function(response) {
            location.reload();
        },
        error: function(error) {
            alert(error.responseJSON.error);
        }
    });
};

// update books list when filtering
const updateBookList = () => {
    const available = $('#filter-available').is(':checked');
    const overdue = $('#filter-overdue').is(':checked');
    const queryString = $.param({
        available: available,
        overdue: overdue
    });
    $.ajax({
        type: 'GET',
        url: '/books?' + queryString,
        success: function(response) {
            $('#book-list').empty();
            response.forEach(function(book) {
                $('#book-list').append(`
                    <li class="book-item" id="book-${book.id}">
                        <a class="book-link" href="/books/${book.id}">${book.author}: "${book.title}"</a>
                        <span class="book-status">${book.available ? 'Можно взять' : 'На руках'}</span>
                        <button class="btn" onclick="deleteBook(${book.id})">Удалить</button>
                    </li>
                `);
            });
        },
        error: function(error) {
            alert(error.responseJSON.error);
        }
    });
};

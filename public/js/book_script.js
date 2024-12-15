// update book dialog
document.getElementById('upd-book-btn').onclick = () =>
    document.getElementById('upd-book-dialog').showModal();
const closeUpdateBookDialog = () =>
    document.getElementById('upd-book-dialog').close();

// checkout book dialog
const checkoutButton = document.getElementById('checkout-btn');
if (checkoutButton) {
    checkoutButton.onclick = () =>
        document.getElementById('checkout-dialog').showModal();
}
const closeCheckoutDialog = () =>
    document.getElementById('checkout-dialog').close();

// update book with ajax by sending request to PUT /books/:id
const updateBook = (event) => {
    event.preventDefault();
    const form = event.target;
    const bookId = form.querySelector('input[name="bookId"]').value;
    const formData = $(event.target).serialize();
    $.ajax({
        type: 'PUT',
        url: `/books/${bookId}`,
        data: formData,
        success: function(response) {
            location.reload();
        },
        error: function(error) {
            alert(error.responseJSON.error);
        }
    });
};

// checkout book with ajax by sending request to POST /books/:id/checkout
const checkoutBook = (event) => {
    event.preventDefault();
    const form = event.target;
    const bookId = form.querySelector('input[name="bookId"]').value;
    const formData = $(event.target).serialize();
    $.ajax({
        type: 'POST',
        url: `/books/${bookId}/checkout`,
        data: formData,
        success: function(response) {
            location.reload();
        },
        error: function(error) {
            alert(error.responseJSON.error);
        }
    });
};

// return book with ajax by sending request to POST /books/:id/return
const returnBook = (bookId) => {
    $.ajax({
        type: 'POST',
        url: `/books/${bookId}/return`,
        success: function(response) {
            location.reload(); // Перезагружаем страницу после успешного ответа
        },
        error: function(error) {
            alert(error.responseJSON.error); // Показываем ошибку при неудаче
        }
    });
};

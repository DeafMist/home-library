const express = require('express');
const routes = require('./public/js/routes');

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
app.use('/', routes);

// start server
app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});

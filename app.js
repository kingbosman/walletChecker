const express = require('express'),
    app = express();

// Middelewares
app.use(express.urlencoded({ extended: true }));

// Import routes
app.use('/', require('./api/routes/general'));
app.use('/update', require('./api/routes/balances'));

// TODO setup Mongoose DB and load it here

app.listen(3000, (req, res) => {
    console.log('Connected');
});

// TODO test DB connection
// TODO Remove data folder which contains all file writing
// TODO test all routes (list each route as new todo)
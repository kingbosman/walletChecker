const express = require('express'),
    app = express();

// Middelewares
app.use(express.urlencoded({ extended: true }));

// Import routes
app.use('/', require('./api/routes/general'));

app.listen(3000, (req, res) => {
    console.log('Connected');
});
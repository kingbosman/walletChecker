const express = require('express'),
    app = express();

// Middelewares
app.use(express.urlencoded({ extended: true }));

// Import routes
app.use('/details', require('./api/routes/details'));

app.use('/this', (req, res) => {
    console.log('got a request');
    res.write('Something here');
    res.end();
})

app.listen(3000, (req, res) => {
    console.log('Connected');
});
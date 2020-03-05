const express = require('express'),
    app = express();

app.use('/this', (req, res) => {
    console.log('got a request');
    res.write('Something here');
    res.end();
})

app.listen(3000, (req, res) => {
    console.log('Connected');
});
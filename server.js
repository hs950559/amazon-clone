const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const config = require('./config');
const mongoose = require('mongoose');
const cors = require('cors');
const port = config.port;
const app = express();

mongoose.connect(config.database, err => {
    if(err) return err;
    console.log('Connected to database');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cors());

app.get('/', (req, res) => {
    res.json({name: 'OK'});
});

app.listen(port, err => {
    console.log('app running on port ' + port);
});

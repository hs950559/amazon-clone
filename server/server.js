const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const config = require('./config');
const mongoose = require('mongoose');
const cors = require('cors');
const port = config.port;
const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(config.database, err => {
    if(err) return err;
    console.log('Connected to database');
});

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
if (!process.env.NODE_ENV === 'test') {
    app.use(morgan('dev'));
}
app.use(cors());

// Use Routes
app.use('/account', require('./routes/account'));

app.get('/', (req, res) => {
    res.json({name: 'OK'});
});

// Global Error Handling
// Catch 404 errors and forword them to error handler
app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// Error handler
app.use((err, req, res, next) => {
	const error = app.get('env') === 'dev' ? err : {};
	const status = error.status || 500;

	res.status(status).json({
		error: {
			message: error.message
		}
	});
});

app.listen(port, err => {
    console.log('app running on port ' + port);
});

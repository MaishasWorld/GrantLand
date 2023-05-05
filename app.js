require("dotenv").config()
const express = require("express")
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const apiRouter = require('./api');
// Setup your Middleware and API Router here
const client = require('./db/client');
client.connect();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
// //This delivers the index.html in the public directory.
// app.get('/', express.static(path.join(__dirname, 'public')));
app.use('/api', apiRouter);

//catching paths that don't exist
app.use(function (req, res, next) {
    const msg = "page cant be found"
    res.status(404).send({ message : msg })
});

//error handler
apiRouter.use((error, req, res, next) => {
    res.send({
      name: error.name,
      error: error.error, 
      message: error.message,
    });
  });
  
module.exports = app;

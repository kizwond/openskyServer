const express = require('express')
const cors = require('cors')
// const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
// const dotenv = require('dotenv');
require('dotenv').config();
const mongoose = require("mongoose");
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const path = require("path");

// dotenv.config();
// const config = require("./config/key");
const app = express();
const passportConfig = require('./passport');
passportConfig();


// const connect = mongoose.connect(config.mongoURI,{
//     useNewUrlParser: true, 
//     useUnifiedTopology: true,
//     useCreateIndex: true, 
//     useFindAndModify: false
//   })
//   .then(() => console.log('MongoDB Connected...'))
//   .catch(err => console.log(err));

app.use(cors())
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(express.json());
// app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cookieParser('dsfsdfsfsdf'));
const fileStoreOptions = ({path : '.sessions'});
app.use(session({
  // secret: process.env.COOKIE_SECRET,
  secret: 'dsfsdfsfsdf',
  cookie: {
      httponly: true,
      maxAge: 1800000
  },
  resave: false,
  saveUninitialized: false,
  store : new FileStore(fileStoreOptions),
}));


const userRouter = require('./routes/user');
const writeRouter = require('./routes/write');
const studyRouter = require('./routes/study');

console.log('process.env.NODE_ENV',process.env.NODE_ENV);
console.log('process.env.COOKIE_SECRET',process.env.COOKIE_SECRET);

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
    // Set static folder   
    // All the javascript and css files will be read and served from this folder
    app.use(express.static("client/build"));
    // index.html for all page routes    html or routing and naviagtion
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
    });
  }

app.use(passport.initialize());
app.use(passport.session());

// app.use('/write', writeRouter);
// app.use('/study', studyRouter);
app.use('/api/user', userRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT,() => console.log(`Server started on port ${PORT}`))
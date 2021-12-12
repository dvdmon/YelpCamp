const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const morgan = require('morgan');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');

const ExpressError = require('./utils/ExpressError');
const { title } = require('process');

// require routes
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

const password = 'tASTkkkzXcBM6dfU'
const uid = 'leviwallach'
const MONGODB_URI = `mongodb+srv://${uid}:${password}@cluster0.en4vy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

//connect to Mongoose
mongoose.connect(MONGODB_URI)
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

//sets a static folder to hold js, css, etc. files so they can be referenced in our files
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());


app.use(morgan('tiny'));

// middleware that runs for every route and checks whether there's a flash message with the
// category of success (or error) and adds it to the res.locals object under the key of success.
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


// use routes
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);




app.get('/', (req, res) => {
    res.render('home')
})






app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})
// creates a new ExpressError instance, the clas of which is set up in a separate file and
// is just our own customized extension of the Error class which takes a 'statusCode'
// and a 'message' property.  This route takes all not found routes and just passes an
// ExpressError instance with the 404 info to the next() error handler below.

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh No, Something Went wrong"
    res.status(statusCode).render('error', { err });
})
// the last error handler which takes whatever error is passed to it and displays it on the page

app.listen(3000, () => {
    console.log("Serving on port 3000");
})
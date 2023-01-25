const express = require('express')
const app = express()
const port = 7777
const cookieParser = require('cookie-parser');
const db = require('./config/mongoose');

const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
//used for session cookie
const session = require('express-session');

const expressLayouts = require('express-ejs-layouts')
app.use(expressLayouts);

app.use(cookieParser());
app.use(express.urlencoded())

//extract styles and scripts from sub pages into layouts
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use(express.static('./assets'))

//set the view engine
app.set('view engine', 'ejs');
app.set('views', './views');


app.use(session({
    name: 'socialApp',

    secret: 'something',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

//use express router
app.use('/', require('./routes'))

app.listen(port, function (err) {
    if (err) {
        console.log(`Error in running the server: ${err}`)
    }
    console.log(`Server is running on port: ${port}`)
})
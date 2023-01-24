const express = require('express')
const app = express()
const port = 7777
const db = require('./config/mongoose');

const expressLayouts = require('express-ejs-layouts')
app.use(expressLayouts);

//extract styles and scripts from sub pages into layouts
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use(express.static('./assets'))

//set the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

//use express router
app.use('/', require('./routes'))


app.listen(port, function (err) {
    if (err) {
        console.log(`Error in running the server: ${err}`)
    }
    console.log(`Server is running on port: ${port}`)
})
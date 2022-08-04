//to setup and fire the express server
const express= require('express');
const cookieParser =require('cookie-parser');
const app=express();
const port =8000;
//add express ejs library for layouts
const expressLayouts= require('express-ejs-layouts');
//adding mondodb using mongoose
const db= require('./config/mongoose');
// used for session cookie
const session = require('express-session');
const passport=require('passport');
const passportLocal =require('./config/passport-local-strategy');
//used tto store the session cookie
const MongoStore = require('connect-mongo')(session);
const sassMiddleware= require('node-sass-middleware');

app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}));

// app.use(express.urlencoded()); depriciated
const bodyParser= require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(express.static('./assets'));

app.use(expressLayouts);
// extracts style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);



//setup the view engine
app.set('view engine','ejs');
app.set('views','./views');

//used tto store the session cookie in the db
app.use(session({
    name: 'codial',
    //TODO change the secret before deploying in production mode.
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie:{
        maxAge: (1000*60*100)
    },
    store: new MongoStore(
        {
            mongooseConnection: db,
            autoRemove: 'disabled'
        },
        function(err){
            console.log(err || 'connect-mongodb setup ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

//use express router
app.use('/', require('./routes'));

app.listen(port,function(err){
    if(err){
        // console.log('Error: ',err);
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
});
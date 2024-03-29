//to setup and fire the express server
const express= require('express');
const env= require('./config/environment');
const logger = require('morgan');

const cookieParser =require('cookie-parser');
const app=express();
require('./config/view-helpers')(app);
const port =8000;
//add express ejs library for layouts
const expressLayouts= require('express-ejs-layouts');
//adding mondodb using mongoose
const db= require('./config/mongoose');
// used for session cookie
const session = require('express-session');
const passport=require('passport');
const passportLocal =require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy'); 
const passportGoogle = require('./config/passport-google-oauth2-strategy');
//used tto store the session cookie
const MongoStore = require('connect-mongo')(session);
const sassMiddleware= require('node-sass-middleware');
//used to generate flash messages
const flash = require('connect-flash');
const customMware = require('./config/middleware');

//setup the chat server to be used with socket.io
const cors= require('cors');
app.use(cors());
const chatServer= require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');
const path = require('path');

if(env.name== 'development'){
    app.use(sassMiddleware({
        src: path.join(__dirname, env.asset_path, 'scss'),
        dest: path.join(__dirname, env.asset_path, 'css'),
        debug: true,
        outputStyle: 'extended',
        prefix: '/css'
    }));
}


// app.use(express.urlencoded()); depriciated
const bodyParser= require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(express.static(env.asset_path));
//make the uploads path available to the browser
app.use('/uploads',express.static(__dirname+'/uploads'));

app.use(logger(env.morgan.mode, env.morgan.options));

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
    secret: env.session_cookie_key,
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

app.use(flash());
app.use(customMware.setFlash);

//use express router
app.use('/', require('./routes'));

app.listen(port,function(err){
    if(err){
        // console.log('Error: ',err);
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
});
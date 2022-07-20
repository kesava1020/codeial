//to setup and fire the express server
const express= require('express');
const app=express();
const port =8000;
//add express ejs library for layouts
const expressLayouts= require('express-ejs-layouts');

app.use(express.static('./assets'));

app.use(expressLayouts);
// extracts style and scripts from sub pages into the layout
app.set('layout extactStyles', true);
app.set('layout extactScripts', true);

//use express router
app.use('/', require('./routes'));

//setup the view engine
app.set('view engine','ejs');
app.set('views','./views');

app.listen(port,function(err){
    if(err){
        // console.log('Error: ',err);
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
});
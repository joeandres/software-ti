const express = require('express');
const app = express();
const exthbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const {database}=require('./src/keys.js');
const parser = require('body-parser');
const passport = require('passport');
const flash=require('connect-flash');
const validator = require('express-validator');
require('./src/lib/passport');

//intializations

//settings
app.set('port',process.env.PORT || 3000);
app.set('views',path.join(__dirname,'/src/views'));
app.use(express.static(path.join(__dirname, '/src/public')));
app.engine('.hbs',exthbs.engine({
    defaultLayout:'main',
    layoutsDir:path.join(app.get('views'),'layouts'),
    partialsDir:path.join(app.get('views'),'partials'),
    extname:'.hbs',
    helpers:require('./src/lib/handlebars.js')
}));
app.set('view engine','.hbs');

//Middlewares
app.use(session({
    secret:'pass',
    resave:false,
    saveUninitialized:false,
    store:new MySQLStore(database)
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(parser.urlencoded({extended:false}));
app.use(parser.json());
//global variables
app.use((req,res,next)=>{
    app.locals.success=req.flash('success');
    app.locals.message=req.flash('message');
    app.locals.user = req.user;
    next();
});
//Rutes

app.use(require('./src/routes/links'));

//Public

//Starting
app.listen(app.get('port'),()=>{
    console.log('conectado ',app.get('port'));
});
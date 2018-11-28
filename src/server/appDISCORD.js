const createError = require('http-errors');
const express = require('express');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
var jwt = require('jsonwebtoken');
const Discord = require('discord.js');
const client = new Discord.Client();

const assetPath = require('./asset_path.js');

const db = require('./modules/db.js');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const messagesRouter = require('./routes/messages');
const sessionsRouter = require('./routes/sessions');

const projectRoot = path.join(__dirname, '../..');
const serverRoot = path.join(__dirname, '.');

const app = express();

const jwtSecret = process.env.JWT_SECRET;

// Connect to DB, and insert default user if necessary
db.connect().then((db) => {
  let collection = db.collection('users');
  collection.countDocuments().then((res) => {
    if (res === 0) {
      collection.insertOne({
        email: 'laurent@ipl.be',
        password: '$2b$10$g2/XIWMv6xLnK02NGRulr.ysJYqlCLOyd53sDrSeb0XH2SaiMoC9O',
        firstName: 'Laurent',
        lastName: 'Leleux'
      }).catch((err) => {
        console.log('[App] Unable to insert default user');
      });
    }
  })
  collection = db.collection('messages');
  collection.countDocuments().then((res) => {
    if (res <= 1) {
      collection.insertOne({
        body: 'Bonjour'
      }).catch((err) => {
        console.log('[App] Unable to insert first default message');
      });
      collection.insertOne({
        body: 'Bonjour Discord'
      }).catch((err) => {
        console.log('[App] Unable to insert second default message');
      });
    }
  })
});

const authMiddleware = (req, res, next) => {
  var token = req.get('authorization');
	if (!token) {
		res.status(401).send('A token is mandatory');
		return;
	}
	jwt.verify(token, jwtSecret, (err, decoded) => {
		if (err) {
			res.status(401).send('Unable to parse token');
			return;
		}
		if (decoded.exp <= Date.now()) {
			res.status(401).send('Token has expired');
			return;
		}
    req.token = decoded;
    next();
	});
}

app.locals.assetPath = assetPath;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  sassMiddleware({
    src: path.join(serverRoot, 'public'),
    dest: path.join(serverRoot, 'public'),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true
  })
);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../../dist')));

app.use('/', indexRouter);
app.use('/api/sessions', sessionsRouter);
app.use(authMiddleware);
app.use('/api/users', usersRouter);
app.use('/api/messages', messagesRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


client.on('ready', () => {
  console.log('[Discord] Client logged !');
});
client.on('message', msg => {
  if (msg.content === '!bot') {
    var auteur = msg.author;
    msg.reply('Pour ajouter un message sur le site, entrez "!bot [Message]"');
  }
  var regex = /^!bot ./;
  if(msg.content.match(regex)) {
      //var contenu = msg.content.subtring(5);
       db.connect().then((db) => {
       collection = db.collection('messages');
       collection.insertOne({
         body: msg.author.username+': '+msg.content.substring(5)
       }).catch((err) => {
         console.log('[App] Error in insert of message');
       });
     });
    msg.reply('Votre message a bien été ajouté!');
  }
});
client.login('NTE0NDMyMjE4MjQwNjQ3MTY5.DtWwOA.RtsYEH1tYfM9p5POOC5jSVHJNT0');


module.exports = app;

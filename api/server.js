const express  = require( 'express'         );
const helmet   = require( 'helmet'          );
const cors     = require( 'cors'            );
const sessions = require( 'express-session' );

const KnexSessionStore = require( 'connect-session-knex' )( sessions ); // store session in DB

const authRouter = require ( '../auth/auth-router.js'   );
const usersRouter = require( '../users/users-router.js' );

const knex = require( '../database/dbConfig' );

const server = express();

const tenMin = 1000 * 60 * 10;

const sessionConfiguration = {
  name: 'cookieCrisp',
  secret: 'keep it secret, keep it safe!',  // for encryption
  saveUninitialized: true,  // GDPR laws require false
  resave: false,

  store: new KnexSessionStore( {
    knex,
    createtable: true,
    clearInterval: tenMin,
    sidfieldname: 'sid',
    tablename: 'sessions'
  } ),

  cookie: {
    maxAge: tenMin,
    secure: false,   // false for http: development; true for https: production
    httpOnly: true,  // if true JS can't touch the cookie
  }
};

server.use( helmet()                         );
server.use( express.json()                   );
server.use( cors()                           );
server.use( sessions( sessionConfiguration ) );  // add req.session object

server.use( '/api/auth', authRouter   );
server.use( '/api/users', usersRouter );

server.get( '/', ( req, res ) => {
  res.json( { api: 'up' }   );
} );

module.exports = server;

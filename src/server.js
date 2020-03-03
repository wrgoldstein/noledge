import sirv from 'sirv';
import fs from 'fs'
import polka from 'polka';
import session from 'express-session';
import sessionFileStore from 'session-file-store';
import compression from 'compression';
import { json } from 'body-parser';
import * as sapper from '@sapper/server';

const FileStore = sessionFileStore(session);

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

polka() // You can also use Express
  .use(session({
    secret: 'conduit',
    resave: false,
    rolling: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 31536000
    },
    store: new FileStore({
      path: process.env.NOW ? `/tmp/sessions` : `.sessions`
    })
  }))
  .use(json())
	.use(
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		sapper.middleware({
			session: req => ({
				user: req.session && req.session.user
			})
    }))
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
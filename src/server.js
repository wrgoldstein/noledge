import sirv from 'sirv';
import fs from 'fs'
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

polka() // You can also use Express
	.use(
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		sapper.middleware()
	)
	.get('/notebook.json', (req, res) => {
		res.end(fs.readFile('../notebooks/Untitled.ipynb'))
	})
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});

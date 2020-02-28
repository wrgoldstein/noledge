import fs from "fs"

const path = JSON.parse(fs.readFileSync('./config.json')).notebook_path

// todo: replace this with a configured directory path
export function get(req, res) {
	const { slug } = req.params;
	console.log(`${path}/${slug.replace(/\|/g, '/')}`)
	let notebook = JSON.parse(fs.readFileSync(`${path}/${slug.replace(/\|/g, '/')}`))
	res.writeHead(200, {
		'Content-Type': 'application/json'
	});

	res.end(JSON.stringify({ notebook, path }));
}

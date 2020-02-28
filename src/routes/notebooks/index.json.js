import fs from "fs"

const path = JSON.parse(fs.readFileSync('./config.json')).notebook_path

import { promisify } from "util"
import { resolve } from "path"
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

async function getFiles(dir) {
  const subdirs = await readdir(dir);
  const files = await Promise.all(subdirs.map(async (subdir) => {
    const res = resolve(dir, subdir);
    return (await stat(res)).isDirectory() ? getFiles(res) : res;
  }));
  return files.reduce((a, f) => a.concat(f), []);
}

// todo: replace this with a configured directory path

export function get(req, res) {
	res.writeHead(200, {
		'Content-Type': 'application/json'
	});
	getFiles(path).then( files => {
		res.end(JSON.stringify({ files, path }));
	})
}

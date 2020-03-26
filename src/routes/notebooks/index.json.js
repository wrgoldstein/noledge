import * as auth from "../auth/authorize"
import fs from "fs"
import { list_files, search } from "../../local"
import { FAILSAFE_SCHEMA } from "js-yaml"

export async function get(req, res) {
  let files = await list_files()

  res.writeHead(200, {
    'Content-Type': 'application/json'
  })

  fs.stat('lookup.json', (err, stat) => {
    if (err) return res.end('{}')
    res.end(JSON.stringify({ files }));
  })
}

import fs from "fs"
import _ from "lodash"
import fetch from "node-fetch"
import authorize from "../auth/authorize"

const client_id = process.env.GITHUB_CLIENT_ID
const client_secret = process.env.GITHUB_CLIENT_SECRET
const GITHUB_AUTH = 'https://github.com';
const GITHUB_API = 'https://api.github.com';

const config = JSON.parse(fs.readFileSync('./config.json'))
const repository = config.repository
const path = `${config.notebook_path}/${config.publish_folder}`

function filterHidden(contents){
  return contents.filter(content => 
    // bit of a hack, filter hidden files and directories
    !content.url.match(`${repository}/contents/\\.`)
  )
}

const source = `${GITHUB_API}/repos/${repository}/contents`

async function get_contents(token){
  const opts = { 
    method: 'GET',
    headers: { Authorization: `token ${token}` }
  }
  let contents = await fetch(source, opts).then(r => r.json())
  contents = await Promise.all(contents.map(c => recurse_contents(c, opts)))
  return contents
}

async function recurse_contents(content, opts){
  if (content.type == 'dir'){
    let folder = await fetch(content._links.self, opts).then(r => r.json())
    let files = await Promise.all(folder.map(file => recurse_contents(file, opts)))
    return {
      name: content.name,
      type: 'folder',
      files
    }
  } else {
    return { name: content.name, type: 'file' }
  }
}

export async function get(req, res) {
  // TODO cache this in a database
  let [authorized, payload] = authorize(req, res)
  
  if (!authorized){
    res.statusCode = 401
    return res.end('{}')
  }

  const { token } = payload
  const files = await get_contents(token)

  res.writeHead(200, {
    'Content-Type': 'application/json'
  })

  res.end(JSON.stringify({ files }));
}

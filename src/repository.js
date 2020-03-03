import mongoose from 'mongoose'
import fs from "fs"
import fetch from "node-fetch"

const GITHUB_API = 'https://api.github.com';

const config = JSON.parse(fs.readFileSync('./config.json'))
const repository = config.repository
const source = `${GITHUB_API}/repos/${repository}/contents`

export async function get_contents(token){
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
      sha: content.sha,
      type: 'folder',
      files
    }
  } else {
    return { 
      name: content.name, 
      type: 'file', 
      sha: content.sha,
      download_url: content.download_url
    }
  }
}

mongoose.connect('mongodb://localhost:27017/test', {
  useNewUrlParser: true, 
  useUnifiedTopology: true
});

const Repo = mongoose.model('Repo', {
  tree: Object
})

const FileLookup = mongoose.model('File', {
  sha: String,
  download_url: String,
  name: String
})

async function save_SHA(files){
  // create one document per notebook to allow
  // looking up the 
  await FileLookup.deleteMany()
  await Promise.all(files.map(_save_SHA))
  return
}

async function _save_SHA(file){
  if (file.type == 'file') // save it
    await FileLookup(file).save()
  else {
    await Promise.all(file.files.map(_save_SHA))
  }
  return
}

export async function persist_tree(tree){
  await Repo.deleteMany() // store only one tree at a time
  await Repo({tree}).save()
  await save_SHA(tree)
  return
}

export async function get_download_url_by_sha(sha){
  const file = await FileLookup.findOne({ sha })
  return file.download_url
}

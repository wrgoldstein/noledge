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
      path: content.path,
      type: 'folder',
      files
    }
  } else {
    return { 
      name: content.name,
      path: content.path,
      sha: content.sha,
      type: 'file', 
      download_url: content.download_url
    }
  }
}

mongoose.connect('mongodb://localhost:27017/test', {
  useNewUrlParser: true, 
  useUnifiedTopology: true
});

export const Repo = mongoose.model('Repo', {
  tree: Object
})

const File = mongoose.model('File', {
  sha: String,
  download_url: String,
  name: String
})

async function save_file(files){
  // create one document per notebook
  await File.deleteMany()
  await Promise.all(files.map(_save_file))
  return
}

async function _save_file(file){
  if (file.type == 'file') // save it
    await File(file).save()
  else {
    await Promise.all(file.files.map(_save_file))
  }
  return
}

export async function persist_tree(tree){
  await Repo.deleteMany() // store only one tree at a time
  await Repo({tree}).save()
  await save_file(tree)
  return
}

export async function get_file_by_sha(sha){
  return await File.findOne({ sha })
}

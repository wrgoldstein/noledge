import mongoose from 'mongoose'
import fs from "fs"
import fetch from "node-fetch"
import yaml from 'js-yaml'

const GITHUB_API = 'https://api.github.com';

const config = JSON.parse(fs.readFileSync('./config.json'))
const repository = config.repository
const SOURCE_URL = `${GITHUB_API}/repos/${repository}/contents`
const COMMIT_URL = `${GITHUB_API}/repos/${repository}/commits`

export async function get_contents(token){
  const opts = { 
    method: 'GET',
    headers: { Authorization: `token ${token}` }
  }
  let contents = await fetch(SOURCE_URL, opts).then(r => r.json())
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

export const File = mongoose.model('File', {
  sha: String,
  download_url: String,
  author: Object,
  name: String,
  updated_at: Date,
  tags: Object,
  description: String
})

export const FileBody = mongoose.model('FileBody', {
  sha: String,
  body: Object
})


async function save_files(files, token){
  // create one document per notebook
  await File.deleteMany()
  await Promise.all(files.map((f) => _save_file(f, token)))
  return
}

async function _save_file(file, token){
  // todo clean up

  if (file.type == 'file') {
    if (file.name.slice(file.name.length - 6, file.name.length) != '.ipynb') return
    const opts = { 
      method: 'GET',
      headers: { Authorization: `token ${token}` }
    }
    let body = await fetch(file.download_url, opts).then(r => r.text())
    const commits = await fetch(`${COMMIT_URL}?path=${file.path}`, opts).then(r => r.json())
    const commit = commits.pop()
    try {
      body = JSON.parse(body)
    } catch {
      // todo unhandled errors
      return
    }

    // parse metadata from notebook
    let meta = {}
    if (body.cells && body.cells[0].cell_type == 'raw'){
      meta = body.cells.shift()
      meta = yaml.load(meta.source.join('').split('---')[1])
    }

    file.author = { ...commit.author, ...commit.commit.author }
    file.updated_at = commit.commit.author.date
    file.body = body
    file = { ...file, ...meta }
    await File(file).save()
    await FileBody(file).save() // save document body separately
  }
  else {
    await Promise.all(file.files.map((f) => _save_file(f, token)))
  }
  return
}

export async function persist_tree(tree, token){
  await Repo.deleteMany() // store only one tree at a time
  await Repo({ tree }).save()
  await save_files(tree, token)
  return
}

export async function get_file_by_sha(sha){
  return await File.findOne({ sha })
}

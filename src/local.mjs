import util from "util"
import { exec } from 'child_process'
import fs from "fs"
import glob from 'glob'
import _ from "lodash"
import yaml from "js-yaml"
import slugify from "slugify"
import elasticlunr from "elasticlunr"

const readFile = util.promisify(fs.readFile);
const awaitExec = util.promisify(exec)

const directory = 'notebooks'
let lookup_path = 'lookup.json'
let index

export async function build_lookup(){
  console.log('[info] Beginning lookup build')
  let lookup = {}

  index = elasticlunr(function(){
    this.addField('title')
    this.addField('tags')
    this.addField('author')
    this.setRef('ref')
  })

  let paths = glob.sync(`${directory}/**/*.ipynb`)
  let work = paths.map(async (f, i) => {
    const body = await readFile(f, 'utf8')
    if (!body) return
    const json = JSON.parse(body)
    let meta = {}

    // git blame the file
    const fpath = f.split('/').slice(1).join('/')    
    const cmd = `git -C ${directory} blame '${fpath}' -p | grep '^author'`
    const { stdout, stderr } = await awaitExec(cmd)
    const rstdout = stdout.split('\n').reverse().join('\n')
    const author = new RegExp('author (.*)').exec(rstdout)[1]
    const time = new RegExp('author-time (.*)').exec(rstdout)[1]
    let updated_at = new Date(0)
    updated_at.setUTCSeconds(+time)
    let slug = slugify(fpath.replace(/\//g, '.').slice(0, -6).toLowerCase())

    // handle metadata
    if (json.cells[0].cell_type == "raw"){
      meta = yaml.load(
        json.cells[0].source.join('').split('---')[1]
      )
    }

    const title = fpath.split('/').pop().slice(0, -6)

    lookup[slug] = {
      ref: i,
      slug,
      title,
      tags: [],
      path: f,
      author,
      updated_at,
      ...meta
    }

    index.addDoc(lookup[slug])
  })
  await Promise.all(work)
  fs.writeFileSync(lookup_path, JSON.stringify(lookup))
  console.log('[info] Finished lookup build')
  return
}

export async function list_files(){
  const body = await readFile(lookup_path, 'utf8')
  return JSON.parse(body)
}

export async function get_by_slug(slug){
  let lookup = await readFile(lookup_path.replace(/(\s+)/g, '\\$1'), 'utf8')
  lookup = JSON.parse(lookup)
  const file = lookup[slug]
  let notebook = await readFile(file.path, 'utf8')
  notebook = JSON.parse(notebook)
  if (notebook.cells[0].cell_type == 'raw'){
    notebook.cells.shift()
  }
  return { file, notebook }
}

export async function search(text){
  const refs = index.search(text, {expand: true}).map(f => +f.ref)
  const response = await get_by_refs(refs)
  return response
}

async function get_by_refs(refs){
  let lookup = await readFile(lookup_path, 'utf8')
  lookup = JSON.parse(lookup)
  const found = Object.values(lookup).filter(f => refs.includes(f.ref))
  return found
}

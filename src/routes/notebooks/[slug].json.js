import fs from "fs"
import * as auth from "../auth/authorize"
import { get_download_url_by_sha } from "../../repository"

const GITHUB_API = 'https://api.github.com';

const config = JSON.parse(fs.readFileSync('./config.json'))
const repository = config.repository
const path = `${config.notebook_path}/${config.publish_folder}`

const source = `${GITHUB_API}/repos/${repository}/contents`

export async function get(req, res) {
  // todo check jwt
  const { slug } = req.params
  const url = await get_download_url_by_sha(slug)
  const result = await auth.get(url, req)
  res.writeHead(200, {
    'Content-Type': 'application/json'
  })
  res.end(result)
}

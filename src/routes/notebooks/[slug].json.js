import * as auth from "../auth/authorize"
import { get_file_by_sha } from "../../repository"

export async function get(req, res) {
  // todo check jwt
  const { slug } = req.params
  const file = await get_file_by_sha(slug)
  const notebook = await auth.get(file.download_url, req)
  res.writeHead(200, {
    'Content-Type': 'application/json'
  })
  res.end(JSON.stringify({ file, notebook: JSON.parse(notebook) }))
}

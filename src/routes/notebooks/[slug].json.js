import * as auth from "../auth/authorize"
import { File, FileBody } from "../../repository"

export async function get(req, res) {
  // todo check jwt
  const { slug } = req.params
  const file = await File.findOne({ sha: slug }).exec()
  const body = await FileBody.findOne({ sha: slug }).exec()
  const notebook = body.body
  // const notebook = await auth.get(file.download_url, req)
  res.writeHead(200, {
    'Content-Type': 'application/json'
  })
  res.end(JSON.stringify({ file, notebook }))
}

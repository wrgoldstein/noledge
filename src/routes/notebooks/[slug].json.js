import * as auth from "../auth/authorize"
import { File, FileBody } from "../../repository"
import { get_by_slug } from "../../local"

export async function get(req, res) {
  // todo check jwt
  const { slug } = req.params
  // const file = await File.findOne({ sha: slug }).exec()
  // const body = await FileBody.findOne({ sha: slug }).exec()
  // const notebook = body.body
  const response = await get_by_slug(slug)
  // const notebook = await auth.get(file.download_url, req)
  res.writeHead(200, {
    'Content-Type': 'application/json'
  })
  res.end(JSON.stringify(response))
}

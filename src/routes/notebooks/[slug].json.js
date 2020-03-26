import * as auth from "../auth/authorize"
import { get_by_slug } from "../../local"

export async function get(req, res) {
  const { slug } = req.params
  const response = await get_by_slug(slug)

  res.writeHead(200, {
    'Content-Type': 'application/json'
  })
  res.end(JSON.stringify(response))
}

import * as auth from "../auth/authorize"
import { Repo } from "../../repository"

export async function get(req, res) {
  // TODO cache this in a database
  let [authorized, payload] = auth.authorize(req, res)
  
  if (!authorized){
    res.statusCode = 401
    return res.end('{}')
  }

  const { token } = payload

  // Definitely do NOT do this every time
  // a page is loaded
  const tree = await Repo.findOne().exec()
  const files = tree.tree

  res.writeHead(200, {
    'Content-Type': 'application/json'
  })

  res.end(JSON.stringify({ files }));
}

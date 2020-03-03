import * as auth from "../auth/authorize"
import { get_contents } from "../../repository"

export async function get(req, res) {
  // TODO cache this in a database
  let [authorized, payload] = auth.authorize(req, res)
  
  if (!authorized){
    res.statusCode = 401
    return res.end('{}')
  }

  const { token } = payload
  const files = await get_contents(token)

  res.writeHead(200, {
    'Content-Type': 'application/json'
  })

  res.end(JSON.stringify({ files }));
}

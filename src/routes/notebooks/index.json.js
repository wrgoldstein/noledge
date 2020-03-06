import * as auth from "../auth/authorize"
import { Repo, File } from "../../repository"

export async function get(req, res) {
  let [authorized, payload] = auth.authorize(req, res) 
  
  if (!authorized){
    res.statusCode = 401
    return res.end('{}')
  }

  const { token } = payload
  const { display } = req.query
  const files = await File.find().exec() //todo paginate

  res.writeHead(200, {
    'Content-Type': 'application/json'
  })

  res.end(JSON.stringify({ files }));
}

import * as auth from "../auth/authorize"
import { Repo, File } from "../../repository"
import { list_files, search } from "../../local"
import { FAILSAFE_SCHEMA } from "js-yaml"

export async function get(req, res) {
  // let [authorized, payload] = auth.authorize(req, res) 
  // list_files()
  // if (!authorized){
  //   res.statusCode = 401
  //   return res.end('{}')
  // }

  // const { token } = payload
  // const { display } = req.query
  // const files = await File.find().exec() //todo paginate
  const files = await list_files()

  res.writeHead(200, {
    'Content-Type': 'application/json'
  })
  
  res.end(JSON.stringify({ files }));
}

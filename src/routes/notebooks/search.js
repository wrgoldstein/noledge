import * as auth from "../auth/authorize"
import { search } from "../../local"

export async function post(req, res){
  let [authorized, payload] = auth.authorize(req, res) 
  
  // if (!authorized){
  //   res.statusCode = 401
  //   return res.end('{}')
  // }

  const { term } = req.body
  const files = await search(term)
  res.end(JSON.stringify({ files }))
}

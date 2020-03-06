import * as auth from "../auth/authorize"
import { Repo, File } from "../../repository"

export async function post(req, res){
  let [authorized, payload] = auth.authorize(req, res) 
  
  if (!authorized){
    res.statusCode = 401
    return res.end('{}')
  }

  const { term } = req.body
  const re = new RegExp(term, 'i')

  const files = await File.find({$or: [{name: re}, {'author.name': re}]}).exec()
  res.end(JSON.stringify({ files }))
}

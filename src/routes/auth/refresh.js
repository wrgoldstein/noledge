import fetch from "node-fetch"
import jwt from "jsonwebtoken"
// import {
//   persist_tree,
//   get_contents
// } from "../../repository"
import * as auth from "./authorize"

export async function get(req, res){
  let [authorized, payload] = auth.authorize(req, res)
  
  if (!authorized){
    res.statusCode = 401
    return res.end('{}')
  }

  // const { token } = payload
  
  // const tree = await get_contents(token)
  // await persist_tree(tree, token)
  res.end()
}

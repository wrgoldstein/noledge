import fetch from "node-fetch"
import jwt from "jsonwebtoken"
import * as auth from "./authorize"
import { pull, clone } from "../../github.mjs"

export async function get(req, res){
  let [authorized, payload] = auth.authorize(req, res)
  
  if (!authorized){
    res.statusCode = 401
    return res.end('{}')
  }

  await pull()
  res.end()
}

export async function post(req, res){
  let [authorized, payload] = auth.authorize(req, res)
  
  if (!authorized){
    res.statusCode = 401
    return res.end('{}')
  }

  await clone()
  res.end()
}

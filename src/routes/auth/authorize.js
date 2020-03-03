import fetch from "node-fetch"
import jwt from "jsonwebtoken"

const GITHUB_API = 'https://api.github.com';
const jwtKey = process.env.JWT_SECRET

export function authorize(req){
  const user = req.session.user

  if (!user) {
    return [ false, {} ]
  }

  let payload
  try {
    payload = jwt.verify(user.jwt_token, jwtKey)
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      // if the error thrown is because the JWT is unauthorized, return a 401 error
      return [ false, payload ]
    }
    return [ false, payload ]
  }

  return [ true, payload ]
}

export function get(url, req){
  let [ authed, payload ] = authorize(req)
  const opts = { 
    method: 'GET',
    headers: { Authorization: `token ${payload.token}` }
  }
  return fetch(url, opts).then(r => r.text())
}
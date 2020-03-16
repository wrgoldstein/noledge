import fetch from "node-fetch"
import jwt from "jsonwebtoken"
import {
  persist_tree,
  get_contents
} from "../../repository"

const jwtKey = process.env.JWT_SECRET
const client_id = process.env.GITHUB_CLIENT_ID
const client_secret = process.env.GITHUB_CLIENT_SECRET
const GITHUB_AUTH = 'https://github.com';
const GITHUB_API = 'https://api.github.com';

export async function get(req, res){
  const response = await fetch(`${GITHUB_AUTH}/login/oauth/access_token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      client_id,
      client_secret,
      code: req.query.code
    })
  })
  const text = await response.text()
  const token = text.slice(13, 53)
  // todo don't do this on every authentication
  const tree = await get_contents(token)
  await persist_tree(tree, token) // persist files

  const opts = { 
    method: 'GET',
    headers: { Authorization: `token ${token}` }
  };

  const github_user = await fetch(`${GITHUB_API}/user`, opts)
                              .then(resp => resp.json())

  const { login } = github_user
  const jwt_token = jwt.sign({ login, token }, jwtKey, {
    algorithm: 'HS256'
  })

  req.session.user = { login, jwt_token }
  res.end()
}

import jwt from "jsonwebtoken"

const jwtKey = process.env.JWT_SECRET
export async function get(req, res){
  const name = req.query.name
  const jwt_token = jwt.sign({ name }, jwtKey, {
    algorithm: 'HS256'
  })

  res.writeHead(200, {
    'Content-Type': 'application/json'
  })

  req.session.user = { name, jwt_token }
  res.end(JSON.stringify({ name, jwt_token }))
}

import jwt from "jsonwebtoken"

const jwtKey = process.env.JWT_SECRET

export function get(req, res){
  console.log(req.session)
  const login = 'horan'
  const secret = 'secret!!!!'

  const token = jwt.sign({ login, secret }, jwtKey, {
    algorithm: 'HS256'
  })

  req.session.user = { login, token }

  res.end()
}

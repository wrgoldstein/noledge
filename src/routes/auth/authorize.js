import jwt from "jsonwebtoken"
const jwtKey = process.env.JWT_SECRET

export default (req, res) => {
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
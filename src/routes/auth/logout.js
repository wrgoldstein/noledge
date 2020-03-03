export function get(req, res){
  req.session.user = undefined
  res.end('logged out')
}
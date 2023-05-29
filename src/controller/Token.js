
const jwt = require('jsonwebtoken');

function token(req, res, next) {
  const authHeader = req.header('authorization')
  const token = authHeader && authHeader.split(" ")[1]
  
  if (!token) return res.status(401).json({msg: "Acesso negado"})
  
  try {
    const secret = process.env.SECRET
    const decoded = jwt.verify(token, secret)
    const userRole = decoded.role

    if (userRole === 'admin' || userRole === 'cliente') {
      next()
    } else {
      res.status(403).json({msg: "Acesso negado"})
    }
  } catch (error) {
    res.status(400).json({msg: "Token inválido"})
  }
}

module.exports = { token };
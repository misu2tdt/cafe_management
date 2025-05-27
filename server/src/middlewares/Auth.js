import jwt from 'jsonwebtoken'

const authMiddleware = (req, res, next) => {
  const token = req.headers.token || req.headers.authorization || req.headers['x-access-token']
  
  if (!token) {
    return res.status(401).json({success: false, message: "Not authorized, please login again"})
  }
  
  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET)
    req.user = {
      id: token_decode.id,
      role: token_decode.role,
    }
    
    if (!req.body) {
      req.body = {}
    }
    
    req.body.userId = token_decode.id
    req.body.role = token_decode.role
    
    next()
  } catch (error) {
    console.log(error)
    res.status(401).json({success: false, message: "Invalid or expired token"})
  }
}

export default authMiddleware
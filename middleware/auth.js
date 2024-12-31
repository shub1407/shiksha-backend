import jwt from "jsonwebtoken"
function auth(req, res, next) {
  if (!req.cookies("Authorization"))
    return res
      .status(401)
      .json({ message: "Access denied, no token provided", error: true })

  const token = req.header("Authorization").split(" ")[1]

  if (!token)
    return res
      .status(200)
      .json({ message: "Access denied, no token provided", error: true })
  try {
    const payload = jwt.verify(token, process.env.JWT_KEY)
    req.user = payload
    next()
  } catch (error) {
    res.status(401).json({ message: "Invalid token", error: true })
  }
}

function isSo(req, res, next) {
  if (req.user.role === "so") next()
  else
    return res
      .status(403)
      .json({ message: "Access denied, not a super admin", error: true })
}
function isStateHead(req, res, next) {
  if (req.user.role === "state_head") next()
  else
    res
      .status(403)
      .json({ message: "Access denied, not a state head", error: true })
}
function isAdmin(req, res, next) {
  if (req.user.role === "admin") next()
  else
    return res
      .status(403)
      .json({ message: "Access denied, not an admin", error: true })
}

export { auth, isSo, isStateHead, isAdmin }

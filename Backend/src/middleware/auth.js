import jwt from "jsonwebtoken";

function readToken(req) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  return scheme === "Bearer" ? token : null;
}

export function requireAuth(req, res, next) {
  const token = readToken(req);
  if (!token) return res.status(401).json({ message: "Login required" });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
    req.user = { id: payload.sub };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
export function optionalAuth(req,res,next){
    const token = readToken(req);
    if(token){
        try{
            const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });;
            req.user = {id: payload.sub};
        }catch{

        }
    }
    next();
}

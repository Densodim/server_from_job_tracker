import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Токен не предоставлен" });
  }

  jwt.verify(token, process.env.API_TOKEN, (err, user) => {
    console.log("token:", token);
    console.log("error:", err);

    if (err) {
      return res.status(403).json({ error: "Недействительный токен" });
    }
    req.user = user;
    next();
  });
};

export default authenticateToken;

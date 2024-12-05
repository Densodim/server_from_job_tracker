const authMiddleware = (req, res, next) => {
  const token = req.cookies._vercel_jwt;

  if (!token) {
    console.log("Кука отсутствует, но продолжаем выполнение");
  } else {
    req.token = token;
  }

  next();
};

export default authMiddleware;

import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.cookies._vercel_jwt; // Получаем куку

  if (!token) {
    return res.status(401).json({ message: "Неавторизован" });
  }

  try {
    const decoded = jwt.verify(token, process.env.API_TOKEN); // Проверяем токен
    req.user = decoded; // Сохраняем данные пользователя
    next(); // Переходим к следующему middleware
  } catch (error) {
    return res.status(403).json({ message: "Доступ запрещен" });
  }
};

export default authMiddleware;

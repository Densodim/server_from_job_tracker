const authMiddleware = (req, res, next) => {
   const token = req.cookies._vercel_jwt; // Получаем куку
 
   if (!token) {
     // Если токен отсутствует, просто продолжаем выполнение
     console.log("Кука отсутствует, но продолжаем выполнение");
   } else {
     // Вы можете здесь просто сохранить токен в `req`, если нужно
     req.token = token;
   }
 
   next(); // Переходим к следующему middleware
 };
 
 export default authMiddleware;
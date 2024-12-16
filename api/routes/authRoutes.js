import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import csrf from "csurf";
import cookieParser from "cookie-parser";

const router = express.Router();

const csrfProtection = csrf({ cookie: true });

function generateJWT(user) {
  return jwt.sign({ id: user._id, email: user.email }, process.env.API_TOKEN, {
    expiresIn: "1h",
  });
}

router.use(cookieParser());

router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Пользователь с таким email уже существует" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, password: hashedPassword, name });
    await newUser.save();

    const token = generateJWT(newUser);

    res.cookie("csrfToken", req.csrfToken(), { httpOnly: true });

    res.status(201).json({
      token,
      user: { id: newUser._id, email: newUser.email, name: newUser.name },
    });
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    res.status(500).json({ error: "Ошибка на сервере" });
  }
});

router.post("/login", csrfProtection, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Неверный email или пароль" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Неверный email или пароль" });
    }

    const token = generateJWT(user);

    res.cookie("csrfToken", req.csrfToken(), { httpOnly: true });

    res.status(200).json({
      token,
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error("Ошибка авторизации:", error);
    res.status(500).json({ error: "Ошибка на сервере" });
  }
});

// Проверка CSRF-токена на защищённых маршрутах
router.get("/protected", csrfProtection, (req, res) => {
  res.status(200).json({ message: "Это защищённый маршрут" });
});

export { router as authRoutes };

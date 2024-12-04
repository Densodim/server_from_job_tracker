import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import { router } from "./routes/jobRoutes.js";
import dotenv from "dotenv";
import authMiddleware from "./authMiddleware.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const dbUri = process.env.MONGO_PUBLIC_URL;

if (!dbUri) {
  console.error("Ошибка: Строка подключения не найдена!");
  process.exit(1);
}

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(bodyParser.json());

app.use(authMiddleware, router);

mongoose
  .connect(dbUri)
  .then(() => {
    console.log("Подключение к базе данных успешно");
    app.listen(port, () => {
      console.log(`Сервер запущен на порту ${port}`);
    });
  })
  .catch((error) => {
    console.error("Ошибка при подключении к базе данных:", error);
  });

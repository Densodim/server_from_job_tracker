import express from "express";
import { Job } from "../models/job.js";
import authMiddleware from "../authMiddleware.js";
import jwt from "jsonwebtoken";

export const router = express.Router();

router.get("/api/jobs", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении вакансий" });
  }
});

router.post("/api/jobs", authMiddleware, async (req, res) => {
  const { company, position, salary, status, note } = req.body;

  const newJob = new Job({ company, position, salary, status, note });

  try {
    await newJob.save();
    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при добавлении вакансии" });
  }
});

router.put("/api/jobs/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { company, position, salary, status, note } = req.body;

  try {
    const job = await Job.findByIdAndUpdate(
      id,
      { company, position, salary, status, note },
      { new: true }
    );
    if (!job) {
      return res.status(404).json({ message: "Вакансия не найдена" });
    }
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при обновлении вакансии" });
  }
});

router.delete("/api/jobs/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const job = await Job.findByIdAndDelete(id);
    if (!job) {
      return res.status(404).json({ message: "Вакансия не найдена" });
    }
    res.status(204).json({ message: "Вакансия удалена" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при удалении вакансии" });
  }
});

router.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "12345") {
    const token = jwt.sign({ username }, process.env.API_TOKEN, {
      expiresIn: "1h",
    });

    return res.json({ token });
  }

  res.status(401).json({ message: "Неверные учетные данные" });
});

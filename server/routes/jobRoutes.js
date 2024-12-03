import express from "express";
import {Job} from "../models/job.js";



export const router = express.Router();

router.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении вакансий' });
  }
});

router.post('/api/jobs', async (req, res) => {
  const { company, position, salary, status, note } = req.body;

  const newJob = new Job({ company, position, salary, status, note });

  try {
    await newJob.save();
    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при добавлении вакансии' });
  }
});


router.put('/api/jobs/:id', async (req, res) => {
  const { id } = req.params;
  const { company, position, salary, status, note } = req.body;

  try {
    const job = await Job.findByIdAndUpdate(
      id,
      { company, position, salary, status, note },
      { new: true }
    );
    if (!job) {
      return res.status(404).json({ message: 'Вакансия не найдена' });
    }
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при обновлении вакансии' });
  }
});


router.delete('/api/jobs/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const job = await Job.findByIdAndDelete(id);
    if (!job) {
      return res.status(404).json({ message: 'Вакансия не найдена' });
    }
    res.status(204).json({ message: 'Вакансия удалена' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении вакансии' });
  }
});


import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  doc,
} from "firebase/firestore";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

// Инициализация Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const testJobs = [
  {
    company: "Google",
    position: "Software Engineer",
    salary: "100",
    status: "Applied",
    note: "Ожидаю ответа",
  },
  {
    company: "Microsoft",
    position: "Frontend Developer",
    salary: "90",
    status: "Interviewed",
    note: "Интервью назначено на следующую неделю",
  },
  {
    company: "Amazon",
    position: "Backend Developer",
    salary: "110",
    status: "Rejected",
    note: "Причина отказа неизвестна",
  },
];

async function loadTestData() {
  try {
    const jobsCollection = collection(db, "jobs");

    // Удаление старых данных
    const querySnapshot = await getDocs(jobsCollection);
    for (const docSnapshot of querySnapshot.docs) {
      await deleteDoc(doc(db, "jobs", docSnapshot.id));
    }
    console.log("Старые данные удалены!");

    // Добавление тестовых данных
    for (const job of testJobs) {
      if (typeof job.salary === "string") {
        job.salary = parseFloat(job.salary); // Преобразование зарплаты в число
      }
      console.log("Добавление данных:", job); // Логируем каждую запись
      await addDoc(jobsCollection, job);
    }
    console.log("Тестовые данные добавлены!");

    // Экспорт данных в файл
    const newQuerySnapshot = await getDocs(jobsCollection);
    const jobs = newQuerySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    fs.writeFileSync("jobs_backup.json", JSON.stringify(jobs, null, 2));
    console.log("Данные выгружены в файл jobs_backup.json!");
  } catch (error) {
    console.error("Ошибка:", error.message);
  }
}

loadTestData();

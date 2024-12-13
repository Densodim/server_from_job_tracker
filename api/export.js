import { MongoClient } from "mongodb";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const dbUri = process.env.MONGO_PUBLIC_URL;

if (!dbUri) {
  console.error(
    "Ошибка: MONGO_PUBLIC_URL не определён в переменных окружения!"
  );
  process.exit(1);
}

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

const client = new MongoClient(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,
});

async function main() {
  try {
    await client.connect();

    const db = client.db();
    const collection = db.collection("jobs");

    await collection.deleteMany();

    await collection.insertMany(testJobs);
    console.log("Тестовые данные добавлены!");

    const jobs = await collection.find().toArray();
    fs.writeFileSync("jobs_backup.json", JSON.stringify(jobs, null, 2));
    console.log("База данных выгружена в файл jobs_backup.json!");
  } catch (error) {
    console.error("Ошибка:", error);
  } finally {
    await client.close();
  }
}

main();

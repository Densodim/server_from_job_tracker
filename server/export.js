import mongoose from "mongoose";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const dbUri = process.env.MONGO_PUBLIC_URL;


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

mongoose.connect(dbUri).then(async () => {
    try {
        const db = mongoose.connection.db;

        await db.collection("jobs").deleteMany();

        await db.collection("jobs").insertMany(testJobs);
        console.log("Тестовые данные добавлены!");

        const jobs = await db.collection("jobs").find().toArray();
        fs.writeFileSync("jobs_backup.json", JSON.stringify(jobs, null, 2));
        console.log("База данных выгружена в файл jobs_backup.json!");

    } catch (error) {
        console.error("Ошибка:", error);
    } finally {
        await mongoose.disconnect();
    }
});

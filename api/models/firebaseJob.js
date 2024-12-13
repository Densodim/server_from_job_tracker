import {
  collection,
  addDoc,
  setDoc,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase.js";

export const addJob = async (jobData) => {
  try {
    if (typeof jobData.salary === "string") {
      jobData.salary = parseFloat(jobData.salary);
    }

    const docRef = await addDoc(collection(db, "jobs"), jobData);
    console.log("Job added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding job:", error);
    throw error;
  }
};

export const getJobs = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "jobs"));
    const jobs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return jobs;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};

export const updateJob = async (id, updatedData) => {
  try {
    const jobRef = doc(db, "jobs", id);
    await updateDoc(jobRef, updatedData);
    console.log("Job updated:", id);
  } catch (error) {
    console.error("Error updating job:", error);
    throw error;
  }
};

export const deleteJob = async (id) => {
  try {
    const jobRef = doc(db, "jobs", id);
    await deleteDoc(jobRef);
    console.log("Job deleted:", id);
  } catch (error) {
    console.error("Error deleting job:", error);
    throw error;
  }
};

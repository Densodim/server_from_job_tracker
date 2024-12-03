import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  salary: { type: Number, required: true },
  status: { type: String, required: true },
  note: { type: String, required: false },
});

jobSchema.pre('save', function(next) {
  if (typeof this.salary === 'string') {
    this.salary = parseFloat(this.salary);
  }
  next();
});

export const Job = mongoose.model('Job', jobSchema);



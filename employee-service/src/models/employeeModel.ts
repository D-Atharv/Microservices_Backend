import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployee extends Document {
  image?: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  gender: string;
  courses: string[];
  createDate?: Date;
}

const employeeSchema: Schema<IEmployee> = new Schema({
  image: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  role: { type: String, required: true },
  gender: { type: String, required: true },
  courses: { type: [String], required: true },
  createDate: { type: Date, default: Date.now },
});

export const Employee = mongoose.model<IEmployee>('Employee', employeeSchema);

import { Request, Response } from 'express';
import { Employee, IEmployee } from '../models/employeeModel';
import multer from 'multer';

const upload = multer({ dest: "uploads/" }); // Adjust for file uploads

export const createEmployee = [
    upload.single("image"),
    async (req: Request, res: Response): Promise<void> => {
        try {
            const { name, email, mobile, role, gender, courses } = req.body;

            if (!name || !email || !mobile || !role) {
                res.status(400).json({ message: "Name, email, mobile, and role are required." });
            }

            // Ensure `courses` is parsed as an array
            const parsedCourses = courses ? JSON.parse(courses) : [];

            const baseUrl = `${req.protocol}://${req.get('host')}`;
            const imagePath = req.file ? `${baseUrl}/uploads/${req.file.filename}` : undefined;

            const employee: IEmployee = new Employee({
                name,
                email,
                mobile,
                role,
                gender,
                courses: parsedCourses,
                image: imagePath,
            });

            await employee.save();
            res.status(201).json({ message: "Employee created successfully", employee });
        } catch (error) {
            console.error("Error in createEmployee:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
];

export const getEmployees = async (_req: Request, res: Response): Promise<void> => {
    try {
        const employees: IEmployee[] = await Employee.find();
        res.status(200).json({ employees });
    } catch (error) {
        console.error("Error in getEmployees:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const updateEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, mobile, role, gender, courses } = req.body;

    const parsedCourses = typeof courses === "string" ? JSON.parse(courses) : courses;

    const updateData = {
      ...(name && { name }),
      ...(email && { email }),
      ...(mobile && { mobile }),
      ...(role && { role }),
      ...(gender && { gender }),
      ...(parsedCourses && { courses: parsedCourses }),
    };

    const employee = await Employee.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!employee) {
      res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ message: "Employee updated successfully", employee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const employee = await Employee.findByIdAndDelete(id);

    if (!employee) {
      res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

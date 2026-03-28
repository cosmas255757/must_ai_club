import { submitProject, getProjectById, listAllProjects, listProjectsByStudent, updateProject, deleteProject } from "../models/projectModel.js";

// -------------------------
// SUBMIT PROJECT
// -------------------------
export const addProject = async (req, res) => {
  try {
    const { title, description, fileUrl } = req.body;
    const studentId = req.user.id; // From authenticate middleware

    if (!title || !description || !fileUrl) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const project = await submitProject(studentId, title, description, fileUrl);

    res.status(201).json({ message: "Project submitted successfully", project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------------
// GET SINGLE PROJECT
// -------------------------
export const getProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await getProjectById(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------------
// LIST PROJECTS
// -------------------------
export const listProjects = async (req, res) => {
  try {
    const user = req.user;

    let projects;
    if (user.role === "student") {
      projects = await listProjectsByStudent(user.id);
    } else {
      projects = await listAllProjects();
    }

    res.json({ projects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------------
// UPDATE PROJECT
// -------------------------
export const editProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, fileUrl } = req.body;
    const user = req.user;

    if (!title || !description || !fileUrl) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Get existing project to check ownership
    const existingProject = await getProjectById(id);
    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (user.role === "student" && existingProject.student_id !== user.id) {
      return res.status(403).json({ message: "Forbidden: Cannot edit others' projects" });
    }

    const project = await updateProject(id, title, description, fileUrl);

    res.json({ message: "Project updated successfully", project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------------
// DELETE PROJECT
// -------------------------
export const removeProject = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const existingProject = await getProjectById(id);
    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (user.role === "student" && existingProject.student_id !== user.id) {
      return res.status(403).json({ message: "Forbidden: Cannot delete others' projects" });
    }

    const project = await deleteProject(id);

    res.json({ message: "Project deleted successfully", project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

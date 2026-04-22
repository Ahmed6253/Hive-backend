import ApiError from "../../utils/ApiError.js";
import Task from "./tasks.model.js";

export const create = async (req, res, next) => {
  const { name, description, dueDate, status, difficulty, groupId } = req.body;
  if (!name || !status || difficulty) {
    return next(new ApiError(400, "Some fildes are missing"));
  }
  if (!groupId) {
    return next(new ApiError(400, "GroupId is required"));
  }
  try {
    const newTask = new Task({
      name,
      description,
      dueDate,
      status,
      difficulty,
      groupId,
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    next(new ApiError(500, "Error creating task"));
  }
};
export const remove = async (req, res, next) => {
  const { id, groupId } = req.body;
  if (!id || !groupId) {
    return next(new ApiError(400, "TaskId and GroupId are required"));
  }
  try {
    const deletedTask = await Task.findOneAndDelete({ _id: id, groupId });
    if (!deletedTask) {
      return next(new ApiError(404, "Task not found"));
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    next(new ApiError(500, "Error deleting task"));
  }
};
export const edit = async (req, res, next) => {
  const { id, name, description, dueDate, status, difficulty } = req.body;
  if (!id) {
    return next(new ApiError(400, "TaskId is required"));
  }
  if (!name && !status && !difficulty) {
    return next(new ApiError(400, "Some fildes are missing"));
  }
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { name, description, dueDate, status, difficulty },
      { new: true },
    );
    if (!updatedTask) {
      return next(new ApiError(404, "Task not found"));
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    next(new ApiError(500, "Error updating task"));
  }
};

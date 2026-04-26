import Group from "../groups/groups.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import Task from "./tasks.model.js";

export const get = async (req, res, next) => {
  const userId = req.user._id;

  try {
    const result = await Group.aggregate([
      { $match: { userId } }, // if groups are user-specific

      {
        $lookup: {
          from: "tasks",
          localField: "_id",
          foreignField: "groupId",
          as: "tasks",
        },
      },

      {
        $project: {
          id: "$_id",
          name: 1,
          description: 1,
          icon: 1,
          tasks: {
            $map: {
              input: "$tasks",
              as: "task",
              in: {
                id: "$$task._id",
                name: "$$task.name",
                description: "$$task.description",
                dueDate: "$$task.dueDate",
                status: "$$task.status",
                difficulty: "$$task.difficulty",
                createdAt: "$$task.createdAt",
                updatedAt: "$$task.updatedAt",
              },
            },
          },
        },
      },

      { $sort: { _id: -1 } },
    ]);

    const grouped = result.reduce((acc, group) => {
      acc.push({
        id: group._id,
        name: group.name,
        description: group.description,
        icon: group.icon,
        tasks: group.tasks,
      });
      return acc;
    }, []);

    new ApiResponse(200, grouped, "Tasks retrieved successfully", "tasks").send(
      res,
    );
  } catch (error) {
    next(new ApiError(500, "Error getting task"));
  }
};

export const create = async (req, res, next) => {
  const { name, description, dueDate, status, difficulty, groupId } = req.body;
  const userId = req.user._id;
  if (!name || !status || !difficulty) {
    return next(new ApiError(400, "Some fields are missing"));
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
      userId,
    });
    await newTask.save();
    new ApiResponse(201, newTask, "Task created successfully", "task").send(
      res,
    );
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
    new ApiResponse(
      200,
      { message: "Task deleted successfully" },
      "Task deleted successfully",
      "task",
    ).send(res);
  } catch (error) {
    next(new ApiError(500, "Error deleting task"));
  }
};
export const edit = async (req, res, next) => {
  const { id, name, description, dueDate, status, difficulty, groupId } =
    req.body;
  if (!id) {
    return next(new ApiError(400, "TaskId is required"));
  }
  if (!name && !status && !difficulty) {
    return next(new ApiError(400, "Some fields are missing"));
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
    new ApiResponse(200, updatedTask, "Task updated successfully", "task").send(
      res,
    );
  } catch (error) {
    next(new ApiError(500, "Error updating task"));
  }
};

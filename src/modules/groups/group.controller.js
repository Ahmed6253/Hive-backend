import ApiError from "../../utils/ApiError.js";
import Group from "./groups.model.js";

export const get = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const groups = await Group.find({ userId });
    res.status(200).json(groups);
  } catch (error) {
    next(new ApiError(500, "Error getting groups"));
  }
};

export const create = async (req, res, next) => {
  const { name, description, icon } = req.body;
  const userId = req.user._id;
  if (!name) {
    return next(new ApiError(400, "Name is required"));
  }
  if (!description) {
    return next(new ApiError(400, "Description is required"));
  }
  try {
    const newGroup = new group({
      name,
      description,
      icon,
      userId,
    });
    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (error) {
    next(new ApiError(500, "Error creating group"));
  }
};
export const remove = async (req, res, next) => {
  const { id } = req.body;
  if (!id) {
    return next(new ApiError(400, "groupId is required"));
  }
  try {
    const deletedGroup = await Group.findByIdAndDelete(id);
    if (!deletedGroup) {
      return next(new ApiError(404, "Group not found"));
    }
    res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    next(new ApiError(500, "Error deleting group"));
  }
};
export const edit = async (req, res, next) => {
  const { id, name, description, icon } = req.body;
  if (!id) {
    return next(new ApiError(400, "groupId is required"));
  }
  if (!name && !icon) {
    return next(new ApiError(400, "Some fields are missing"));
  }
  try {
    const updatedGroup = await Task.findByIdAndUpdate(
      id,
      { name, description, icon },
      { new: true },
    );
    if (!updatedGroup) {
      return next(new ApiError(404, "Group not found"));
    }
    res.status(200).json(updatedGroup);
  } catch (error) {
    next(new ApiError(500, "Error updating group"));
  }
};

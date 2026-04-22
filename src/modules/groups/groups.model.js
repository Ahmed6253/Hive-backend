import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

groupSchema.index({ userId: 1 });

const Group = mongoose.model("Group", groupSchema);

export default Group;

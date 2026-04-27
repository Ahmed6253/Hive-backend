import mongoose from "mongoose";
import env from "../src/config/env.js";
import User from "../src/modules/user/user.model.js";
import Group from "../src/modules/groups/groups.model.js";
import Task from "../src/modules/tasks/tasks.model.js";

const tasksData = [
  {
    name: "Finish project report",
    description: "Complete the Q1 project report",
  },
  {
    name: "Email client updates",
    description: "Send weekly updates to client",
  },
  {
    name: "Team meeting preparation",
    description: "Prepare slides for team meeting",
  },
  {
    name: "Review code submissions",
    description: "Review pull requests from team",
  },
  {
    name: "Study algorithms",
    description: "Practice dynamic programming problems",
  },
  {
    name: "Read research papers",
    description: "Read latest ML research papers",
  },
  {
    name: "Complete exercises",
    description: "Finish coding exercises",
  },
  {
    name: "Watch lecture videos",
    description: "Watch advanced math lectures",
  },
  {
    name: "Morning workout",
    description: "30 min cardio session",
  },
  {
    name: "Healthy meal prep",
    description: "Prepare meals for the week",
  },
  {
    name: "Meditation",
    description: "15 min mindfulness practice",
  },
  {
    name: "Checkup appointment",
    description: "Annual doctor checkup",
  },
  {
    name: "Pay bills",
    description: "Pay monthly utility bills",
  },
  {
    name: "Review investments",
    description: "Check portfolio performance",
  },
  {
    name: "Practice guitar scales",
    description: "Practice C major scale",
  },
  {
    name: "Learn new song",
    description: "Learn chorus of new song",
  },
  {
    name: "Listen to music theory",
    description: "Complete music theory course",
  },
  {
    name: "Clean guitar",
    description: "Maintain and clean guitar",
  },
  { name: "Jam session", description: "Practice with friends", difficulty: 2 },
];

const statuses = ["not-started", "in-progress", "completed"];
const difficulties = [1, 2, 3];

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const randomDueDate = () => {
  if (Math.random() > 0.7) return null;
  const days = Math.floor(Math.random() * 30) + 1;
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const seed = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(env.mongodbUri);
    console.log("Connected to MongoDB");

    console.log("Dropping existing collections...");
    await User.deleteMany({});
    await Group.deleteMany({});
    await Task.deleteMany({});
    console.log("Collections dropped");

    const users = [
      {
        _id: new mongoose.Types.ObjectId("69cfe9d796a732f09c4cbf9d"),
        name: "Ahmed",
        email: "ahmed@gmail.com",
        password:
          "$2b$12$rASb0kdhIdHBAF33nU8ZBe9A5VS66jCNtAagXtAwi5711yY2f95by",
      },
      {
        name: "Ali",
        email: "ali@gmail.com",
        password:
          "$2b$12$rASb0kdhIdHBAF33nU8ZBe9A5VS66jCNtAagXtAwi5711yY2f95by",
      },
      {
        name: "Sara",
        email: "sara@gmail.com",
        password:
          "$2b$12$rASb0kdhIdHBAF33nU8ZBe9A5VS66jCNtAagXtAwi5711yY2f95by",
      },
    ];

    const usersGroups = [
      [
        { name: "Work", icon: "work", taskCount: 3 },
        { name: "Study", icon: "graduation", taskCount: 5 },
        { name: "Health", icon: "heart", taskCount: 4 },
        { name: "Finance", icon: "dollar", taskCount: 2 },
        { name: "Hobby", icon: "guitar", taskCount: 5 },
        { name: "Books", icon: "bookOpen", taskCount: 0 },
      ],
      [
        { name: "Office", icon: "work", taskCount: 4 },
        { name: "Learning", icon: "graduation", taskCount: 3 },
        { name: "Fitness", icon: "dumbbell", taskCount: 2 },
        { name: "Projects", icon: "code", taskCount: 5 },
      ],
      [
        { name: "Shopping", icon: "store", taskCount: 3 },
        { name: "Home", icon: "folder", taskCount: 4 },
        { name: "Family", icon: "users", taskCount: 2 },
        { name: "Wellness", icon: "heart", taskCount: 3 },
        { name: "Travel", icon: "globe", taskCount: 0 },
      ],
    ];

    for (let i = 0; i < users.length; i++) {
      const userData = users[i];
      console.log(`Creating user ${userData.name}...`);
      const user = await User.create({
        ...userData,
        authProvider: "local",
      });
      console.log("User created:", user.email);

      const groups = usersGroups[i];
      let taskIndex = 0;

      console.log("Creating groups and tasks...");
      for (const groupData of groups) {
        const group = await Group.create({
          userId: user._id,
          name: groupData.name,
          icon: groupData.icon,
          description: `${groupData.name} tasks`,
        });

        console.log(`  Created group: ${group.name} (${group.icon})`);

        for (let j = 0; j < groupData.taskCount; j++) {
          const task = tasksData[taskIndex % tasksData.length];
          taskIndex++;

          await Task.create({
            userId: user._id,
            groupId: group._id,
            name: task.name,
            description: task.description,
            status: randomFrom(statuses),
            difficulty: randomFrom(difficulties),
            dueDate: randomDueDate(),
            sortOrder: j,
          });
        }

        console.log(`  Created ${groupData.taskCount} tasks for ${group.name}`);
      }
    }

    console.log("\nSeed completed successfully!");
    console.log(
      "Users: ahmed@gmail.com, ali@gmail.com, sara@gmail.com / password",
    );
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seed();

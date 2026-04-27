import { Router } from "express";

import { create, remove, edit, get, sort } from "./tasks.controller.js";

const tasksRoutes = Router();

tasksRoutes.get("/get", get);
tasksRoutes.post("/create", create);
tasksRoutes.delete("/delete", remove);
tasksRoutes.put("/edit", edit);
tasksRoutes.put("/sort", sort);

export default tasksRoutes;

import { Router } from "express";

import { create, remove, edit, get } from "./tasks.controller.js";

const tasksRoutes = Router();

tasksRoutes.get("/get", get);
tasksRoutes.post("/create", create);
tasksRoutes.delete("/delete", remove);
tasksRoutes.put("/edit", edit);

export default tasksRoutes;

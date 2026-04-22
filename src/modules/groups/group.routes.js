import { Router } from "express";

import { create, remove, edit } from "./group.controller.js";

const groupRoutes = Router();

groupRoutes.post("/create", create);
groupRoutes.delete("/delete", remove);
groupRoutes.put("/edit", edit);

export default groupRoutes;

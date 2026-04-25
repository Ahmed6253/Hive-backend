import { Router } from "express";

import { create, remove, edit, get } from "./group.controller.js";

const groupRoutes = Router();

groupRoutes.post("/get", get);
groupRoutes.post("/create", create);
groupRoutes.delete("/delete", remove);
groupRoutes.put("/edit", edit);

export default groupRoutes;

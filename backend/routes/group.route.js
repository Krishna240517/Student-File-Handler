import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { createGroup, joinGroup, leaveGroup, getMyGroups, regenerateCode, getSpecificGroup } from "../controllers/group.controller.js";
const groupRoute = express.Router();

groupRoute.post("/create-group",protect,createGroup);
groupRoute.post("/join-group",protect,joinGroup);
groupRoute.delete("/leave-group/:groupId",protect,leaveGroup);
groupRoute.get("/get-my-groups",protect,getMyGroups);
groupRoute.patch("/regen-code/:groupId",protect,regenerateCode);
groupRoute.get("/get-group/:groupId",protect, getSpecificGroup);

export default groupRoute;
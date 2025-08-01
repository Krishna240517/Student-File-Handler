import express from "express";
import { createGroup, deleteGroup, removeMember, joinGroup, leaveGroup, getMyGroups,  uploadFile, deleteFile, getSignedUrlController, getGroup } from "../controllers/group.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.js";
const groupRoute = express.Router();

/*admin:->
    1. Creating a Group
    2. Deleting a Group
    3. Removing Specific Members
*/
groupRoute.post("/create",protectRoute,createGroup);
groupRoute.delete("/delete/:groupId",protectRoute,deleteGroup);
groupRoute.post("/remove/:groupId/:userId",protectRoute,removeMember);

/*user:->
    1. Joining a Group
    2. Leave a Group
    3. Get all groups user is part of
    4. Get specific Group 
    5. uploading files to a group
*/
groupRoute.post("/join/:groupId",protectRoute, joinGroup);
groupRoute.post("/leave/:groupId",protectRoute, leaveGroup);
groupRoute.get("/mygroups",protectRoute,getMyGroups);
groupRoute.get("/specificGroup/:groupId",protectRoute,getGroup);
groupRoute.post("/upload/:groupId",protectRoute, upload.single("file"),uploadFile);
groupRoute.delete("/deleteFile/:groupId/:fileId",protectRoute, deleteFile);
groupRoute.get("/sign/:groupId/:fileId",protectRoute, getSignedUrlController);


export default groupRoute;
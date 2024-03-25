import { Router } from "express";
import { createNewPosition, editPosition, getAllPositions, getOnePosition } from "../controllers/position.controller.js";







const positionRouter =Router()

positionRouter.post('/position', createNewPosition)
positionRouter.get('/position',getAllPositions)
positionRouter.patch('/position/:position_id',editPosition);
positionRouter.get('/position/:position_id',getOnePosition)






export default positionRouter
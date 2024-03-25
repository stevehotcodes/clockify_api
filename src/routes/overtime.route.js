import {Router} from "express"
import { createNewOvertime, editOvertimeforAnEmployee, getAllOvertimeRecord } from "../controllers/overtime.controller.js"






const overtimeRouter=Router()

overtimeRouter.get('/overtime',getAllOvertimeRecord)
overtimeRouter.post('/overtime',createNewOvertime)
overtimeRouter.put('/overtime/:user_id',editOvertimeforAnEmployee)




export default overtimeRouter
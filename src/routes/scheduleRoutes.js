import { Router } from "express";
import { createNewSchedule, getAllSchedule } from "../controllers/schedule.controller.js";


const scheduleRouter=Router()

scheduleRouter.post('/schedule',createNewSchedule)
scheduleRouter.get('/schedule',getAllSchedule)




export default scheduleRouter
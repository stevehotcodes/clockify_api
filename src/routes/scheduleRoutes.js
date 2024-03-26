import { Router } from "express";
import { createNewSchedule, getAllSchedule, getEmployeesBySchedule } from "../controllers/schedule.controller.js";


const scheduleRouter=Router()

scheduleRouter.post('/schedule',createNewSchedule);
scheduleRouter.get('/schedule',getAllSchedule);
scheduleRouter.get('/schedule/:schedule_id',getEmployeesBySchedule)




export default scheduleRouter
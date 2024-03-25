import { Router } from "express";
import { createTimeIn, createTimeOut, getAttendanceByUserReport, getAttendanceReport, getAttendanceforAUser, getAttendanceforAllUsers } from "../controllers/attendance.controller.js";
import { verifyUserIdentity } from "../middlewares/useAuthMiddleware.js";




const attendanceRouter =Router()

attendanceRouter.post('/attendance/in/:user_id', createTimeIn)
attendanceRouter.patch('/attendance/out/:user_id',createTimeOut)
attendanceRouter.get('/attendance/user', verifyUserIdentity, getAttendanceforAUser)
attendanceRouter.get('/attendance',getAttendanceforAllUsers)
attendanceRouter.get('/attendance/report',getAttendanceReport)
attendanceRouter.get('/attendance/user/report/:user_id',getAttendanceByUserReport);





export default attendanceRouter
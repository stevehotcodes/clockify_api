import { Router } from "express";
import {  editPositionforAnEmployee, editScheduleforAnEmployee, getAllEmployees, getAllUsersbyGender, getLoggedInUser, loginUser, registerNewUser, updateUser } from "../controllers/users.controllers.js";
import { verifyUserIdentity } from "../middlewares/useAuthMiddleware.js";





const userRouter=Router()

userRouter.post('/user',registerNewUser)
userRouter.get('/user', getAllEmployees)
userRouter.post('/login',loginUser)
userRouter.get('/loggedinuser', verifyUserIdentity,getLoggedInUser )
userRouter.put('/user/:user_id',updateUser)
userRouter.get('/user/gender', getAllUsersbyGender);
userRouter.put('/user/schedule/:user_id',editScheduleforAnEmployee)
userRouter.put('/user/position/:user_id',editPositionforAnEmployee)




export default userRouter
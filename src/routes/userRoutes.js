import { Router } from "express";
import { getAllEmployees, getAllUsersbyGender, getLoggedInUser, loginUser, registerNewUser, updateUser } from "../controllers/users.controllers.js";
import { verifyUserIdentity } from "../middlewares/useAuthMiddleware.js";





const userRouter=Router()

userRouter.post('/user',registerNewUser)
userRouter.get('/user', getAllEmployees)
userRouter.post('/login',loginUser)
userRouter.get('/loggedinuser', verifyUserIdentity,getLoggedInUser )
userRouter.put('/user/:user_id',updateUser)
userRouter.get('/user/gender', getAllUsersbyGender);




export default userRouter
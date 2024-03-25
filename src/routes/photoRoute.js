import { Router } from "express";
import { getPhoto, uploadPhoto } from "../controllers/photo.controller.js";






const photoRouter=Router()

photoRouter.post('/photo/:user_id',uploadPhoto);
photoRouter.get('/photo/:user_id', getPhoto)







export default photoRouter
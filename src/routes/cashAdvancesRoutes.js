import { Router } from "express";
import { createCashAdvances, editcashAdvances, getAllCashAdvances } from "../controllers/cashAdvances.controllers.js";





const cashAdvancesRouter=Router()

cashAdvancesRouter.post('/cashadvances', createCashAdvances)
cashAdvancesRouter.get('/cashadvances',getAllCashAdvances)
cashAdvancesRouter.put('/cashadvances/:user_id',editcashAdvances)





export default cashAdvancesRouter
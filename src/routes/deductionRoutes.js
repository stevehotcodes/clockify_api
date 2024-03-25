import { Router } from "express";
import { createNewDeduction, editDeductionforAnEmployee, getAlllDeductions } from "../controllers/deductions.controller.js";




const deductionRouter=Router()

deductionRouter.post('/deduction',createNewDeduction)
deductionRouter.get('/deduction',getAlllDeductions)
deductionRouter.put('/deduction/:user_id', editDeductionforAnEmployee)





export default deductionRouter
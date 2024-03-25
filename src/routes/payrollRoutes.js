import {Router} from 'express'
import { generatePayRoll, getPayRollRecords, getPayRollRecordsforAUser } from '../controllers/payroll.controller.js'
import { verifyUserIdentity } from '../middlewares/useAuthMiddleware.js'







const payrollRouter=Router()

payrollRouter.post('/payroll',generatePayRoll)
payrollRouter.get('/payroll', getPayRollRecords)
payrollRouter.get('/payroll/user/:user_id',  getPayRollRecordsforAUser)






export default payrollRouter
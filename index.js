import express from 'express'
import dotenv from 'dotenv'
import { appPool } from './src/utils/sqlDbConnect.js'
import logger from './src/utils/logger.js'
import bodyParser from 'body-parser'
import cors from 'cors'
import cron from 'node-cron'
import positionRouter from './src/routes/positionRoutes.js'
import scheduleRouter from './src/routes/scheduleRoutes.js'
import userRouter from './src/routes/userRoutes.js'
import { sendWelcomeEmailToNewUsers } from './src/config/mailConfig.js'
import deductionRouter from './src/routes/deductionRoutes.js'
import cashAdvancesRouter from './src/routes/cashAdvancesRoutes.js'
import overtimeRouter from './src/routes/overtime.route.js'
import payrollRouter from './src/routes/payrollRoutes.js'
import { generatePayRoll } from './src/controllers/payroll.controller.js'
import attendanceRouter from './src/routes/attendanceRoute.js'
import photoRouter from './src/routes/photoRoute.js'
dotenv.config()


var corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200 
}




const app=express()
const port =process.env.API_PORT || 3000
//configuring the middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors())


app.get('/health',(req,res)=>{
    logger.info("horray, I am healthy")
    return res.status(200).send({message:"I am healthy"})
})

app.use('/api',positionRouter)
app.use('/api',scheduleRouter)
app.use('/api',userRouter)
app.use('/api',deductionRouter)
app.use('/api',cashAdvancesRouter)
app.use('/api',overtimeRouter)
app.use('/api',payrollRouter)
app.use('/api',attendanceRouter)
app.use('/api',photoRouter)





cron.schedule('*/10 * * * * *', async() => {

    // logger.info("sending email after every five seconds ...............");
//    await  sendWelcomeEmailToNewUsers()
    // logger.info("generate payroll.........")
    // logger.info('generating payroll.............')
    //   await generatePayRoll(req,res)
    // try {
    //     console.log('Generating payroll...');
    //     // Call your function to generate payroll
    //     const payrollResult = await generatePayRoll();
    //     console.log('Payroll generated:', payrollResult);
    // } catch (error) {
    //     console.error('Error generating payroll:', error);
    // }

});


app.listen(port,()=>{
    logger.info(`I am running on http://localhost:${port}.............` )
})
import mssql from 'mssql'
import dotenv from 'dotenv'


dotenv.config()

const { SQL_USER,SQL_PASSWORD,SQL_SERVER,SQL_DB,
    SQL_SERVER_PORT,SQL_ENCRYPT,SQL_TRUST_SERVER_CERTIFICATE } = process.env


const dbConfig={
    user:SQL_USER,
    database:SQL_DB,
    server:SQL_SERVER,
    password:SQL_PASSWORD,
    port:Number(SQL_SERVER_PORT),
    options:{
        encrypt:Boolean(SQL_ENCRYPT),
        trustServerCertificate:Boolean(SQL_TRUST_SERVER_CERTIFICATE) 
    }

}


let appPool
let poolRequest

try {
    appPool=await mssql.connect(dbConfig)
    poolRequest=()=>appPool.request()
    if(appPool){
        console.log("Connected to the database");

    }
    
} catch (error) {
    console.log("error in creating the pool", error)
}

export {poolRequest, appPool}
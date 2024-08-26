import http from 'k6/http'
import{sleep,check} from 'k6'
import { CONTENT_TYPE,BASE_URL } from '../config/environment.variable.js'

const userData=JSON.parse(open('../../___test____/testData/signUpData.json'))
const{userId}=userData

export let options={
    vus:20,
    duration:'1s',
    
}

export default function () {
    
    const params={
        headers:{
            'Content-Type':`${CONTENT_TYPE}`
        }
    }


let response= http.get(`${BASE_URL}/attendance/user/${userId}`,params)
 
check(response,{
    'is status 200?':(r)=>r.status==200
 
})

sleep(1)

}
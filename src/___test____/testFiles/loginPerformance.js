import http from 'k6/http';
import { sleep, check } from 'k6';
import { CONTENT_TYPE,BASE_URL } from '../config/environment.variable.js';

const loginData=JSON.parse(open('../../___test____/testData/loginData.json'))
const{email,password}=loginData


export let options={
    vus:20,
    duration:'1s'
}

export default function () {
    const body= JSON.stringify({     
     email:email,
     password:password
    })

    const params={
        headers:{
            'Content-Type':`${CONTENT_TYPE}`
        }
    }

 

let response= http.post(`${BASE_URL}/login`,params,body)
console.log(response)
check(response,{
    'is status 200?':(response)=>response.status===200,
    'contains "token"': (response)=>response.body.includes("token")
})

sleep(1)

}
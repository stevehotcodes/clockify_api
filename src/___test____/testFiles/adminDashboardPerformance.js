import http from 'k6/http'
import{sleep,check} from 'k6'
import { CONTENT_TYPE,BASE_URL } from '../config/environment.variable'


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


let response= http.get(`${BASE_URL}/user`,params)
 
check(response,{
    'is status 200?':(response)=>response.status==200
 
})

sleep(1)

}
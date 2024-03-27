import http from 'k6/http'
import{sleep,check} from 'k6'

export let options={
    vus:20,
    duration:'1s',
    
}

export default function () {
    

    const params={
        headers:{
            'Content-Type':'application/json'
        }
    }


let response= http.get("http://localhost:3400/api/user",params)
 
check(response,{
    'is status 200?':(response)=>response.status==200
 
})

sleep(1)

}
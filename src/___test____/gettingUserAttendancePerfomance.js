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


let response= http.get("http://localhost:3000/api/attendance/user/6713fc4a-70fd-4497-9a2a-1f94442f50bf",params)
 
check(response,{
    'is status 200?':(r)=>r.status==200
 
})

sleep(1)

}
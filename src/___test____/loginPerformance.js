import http from 'k6/http';
import { sleep, check } from 'k6';



export let options={
    vus:20,
    duration:'1s'
}

export default function () {
    const body= JSON.stringify({
        
     email:"ondiekistephen00@gmail.com ",
     password:"12345678"
    })

    const params={
        headers:{
            'Content-Type':'application/json'
        }
    }


let response= http.post("http://localhost:3000/api/login",body,params)
console.log('Response Body',`${response.body}`)
 
check(response,{
    'is status 200?':(response)=>response.status==200,
    'contains "token"': (response)=>response.body.includes("token")
})

sleep(1)

}
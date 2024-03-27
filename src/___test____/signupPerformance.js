import http from 'k6/http'
import{sleep,check} from 'k6'

export let options={
    vus:1,
    duration:'1s'
}

export default function () {
    const body= JSON.stringify({
        firstname:"stepehen",
        middlename:"omosh",
        lastname:"ondieki",
        identification_number:"yeyhydhdsidsnnn7738dd83yhr3yyueue",
        gender:"Male",
        marital_status:"single",
        date_of_birth:"12/12/1997",
        email:"omosh@twytwxudddwduuuxwehhex.com",
        phone_number:"7777",
        place_of_residence:"Nyeri",
        course_of_study:"Bcom",
        institutiton:"Muranga university",
        language:"English and French",
        technical:"angular, react",
        emergency_person_name:"Andy",
        emergency_phone_number:"0444444",
        relationship:"friend"

 
     })

    const params={
        headers:{
            'Content-Type':'application/json'
        }
    }


let response= http.post("http://localhost:3000/api/user",body,params)
 
check(response,{
    'is status 201?':(response)=>response.status==201,
    'contains "${body.firstname} has been registered successfully"?':response.body.includes(`${body.firstname} has been registered successfully`)
})

sleep(1)

}
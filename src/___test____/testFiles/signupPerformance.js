import http from 'k6/http'
import{sleep,check} from 'k6'
import { CONTENT_TYPE,BASE_URL } from '../config/environment.variable.js'

const signupData= JSON.parse(open('../../___test____/testData/signUpData.json'))


export let options={
    vus:1,
    duration:'1s'
}

const {firstname,middlename,lastname,identification_number,gender,marital_status,date_of_birth,email,phone_number,place_of_residence,course_of_study,institutiton,language,technical,emergency_person_name,emergency_phone_number,relationship}=signupData


export default function () {
    const body= JSON.stringify({
        firstname:firstname,
        middlename:middlename,
        lastname:lastname,
        identification_number:identification_number,
        gender:gender,
        marital_status:marital_status,
        date_of_birth:date_of_birth,
        email:email,
        phone_number:phone_number,
        place_of_residence:place_of_residence,
        course_of_study:course_of_study,
        institutiton:institutiton,
        language:language,
        technical:technical,
        emergency_person_name:emergency_person_name,
        emergency_phone_number:emergency_phone_number,
        relationship:relationship

     })

    const params={
        headers:{
            'Content-Type':`${CONTENT_TYPE}`
        }
    }


let response= http.post(`${BASE_URL}/user`,body,params)
 
check(response,{
    'is status 201?':(response)=>response.status==201
})

sleep(1)

}
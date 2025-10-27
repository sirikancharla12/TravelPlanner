import axios from "axios";
import dotenv from 'dotenv';

dotenv.config();


const amadeusClientId = process.env.AMADEUS_CLIENT_ID;
const amadeusClientSecret = process.env.AMADEUS_CLIENT_SECRET;

let accessToken : string | null = null;
let tokenExpiry : number | null = null;

export async function getAmadeusAccessToken(){
    if(accessToken && tokenExpiry && Date.now()< tokenExpiry){
        return accessToken!;
    }

    const response =await axios.post("https://test.api.amadeus.com/v1/security/oauth2/token", new URLSearchParams({
        
        grant_type: "client_credentials",
        client_id: amadeusClientId!,
        client_secret: amadeusClientSecret!
    }), {
        headers:{
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }
    )
accessToken=response.data.access_token;
tokenExpiry=Date.now()+response.data.expires_in * 60;
return accessToken!;
}
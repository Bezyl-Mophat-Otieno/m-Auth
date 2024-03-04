import { v4 } from "uuid";
import jwt from "jsonwebtoken";
// Will be used to generate and validate tokens and type definitions
const options_to_payload = {
  'audience': 'aud',
  'issuer': 'iss',
  'subject': 'sub',
  'jwtid': 'jti'
};

// will be used to validate the token and type definitions 
const sign_options_schema = {
  expiresIn:"",
  notBefore: "",
  audience:"",
  algorithm:"",
  header: {},
  encoding:"",
  issuer: "",
  subject: "",
  jwtid: "",
  noTimestamp: "",
  keyid:"",
  mutatePayload: true||false,
  allowInsecureKeySizes: true || false,
  allowInvalidAsymmetricKeyTypes:true|| false 
};

const defaultSigningOptions = {
    signingKey: process.env.JWT_SECRET_KEY || process.env.ENV === "production" ? null : "security_not_a_concern",
    issuer: process.env.JWT_ISSUER || "localhost",
    durationInMinutes: Number(process.env.JWT_DURATION || 12*60),
    clockTolerance: Number(process.env.JWT_CLOCK_TOLERANCE ||0),
    ignoreExpiration: false

}

defaultSigningOptions.audience = process.env.JWT_TOKEN_AUDIENCE || defaultSigningOptions.issuer;

const generateToken = (data,opts={})=>{
  // data should not contain sensitive information I.e password .... will be implemented later
  const {signingKey , ...merged} = {...defaultSigningOptions,...opts};

  if(!signingKey) {
    throw new Error("Invalid signing key");
  }

  let refDate = Math.floor(Date.now()/1000);

  let payload = {
    sub: data.userId,
    exp: refDate + merged.durationInMinutes*60,
    nbf: refDate,
    iss: merged.issuer,
    aud:merged.audience,
    jti: v4(),// security against token related attacks
    data
  }
  const token = jwt.sign(payload,signingKey);

  return token;

};


const validateToken = ( token , opts)=>{

  const { signingKey , durationInMinutes , ...merged} = {...defaultSigningOptions,...opts};

  if(!signingKey) {
    throw new Error("Invalid signing key");
  }

  try {

    const payload = jwt.verify(token,signingKey,merged);
    return payload;
    
  } catch (error) {
    console.log(`Error verifying token ${token}`, error);
    throw new Error(error);
    
  }

}


const refreshToken = (token , opts)=>{

 try {
   // Verify the token first 
  const payload = validateToken(token,opts);
  const {data} = payload;

  const freshToken = generateToken(data,opts);

  return {token:freshToken, payload};
  
 } catch (error) {

  console.log(`Error refreshing token ${token}`, error);
  throw new Error(error);
  
 }

}

export {generateToken,validateToken,refreshToken};
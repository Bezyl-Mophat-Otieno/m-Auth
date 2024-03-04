import nodemailer from 'nodemailer';


let config = {
    host:"",
    server:"",
    port:587,
    auth:{
        user:process.env.EMAIL || "",
        pass:process.env.EMAIL_PWD || ""
    }

}

let mailOptions = {
    from:process.env.EMAIL || "",
    to:"",
    subject:"",
    text:"",
    html: "",
    attachments:[]
}


// Creating transporter 
const createTransporter = (config)=>{
    return nodemailer.createTransport(config);
}

const sendMail = async (mailOptions)=>{
const transporter = createTransporter(config);
   
let isValid = false;
 
transporter.verify().then(()=>{
    console.log("Transporter verified");
   isValid = true;
}).catch((error)=>{ 
    isValid = false;
    console.log("Error verifying transporter",error);
    throw new Error(error);
    
}) 

if(!isValid){
    throw new Error("Invalid transporter");
}
 transporter.sendMail(mailOptions,(error,info)=>{
        if(error){
            console.log("Error sending mail",error);
            throw new Error(error);
        }
        console.log("Mail sent",info.response);
        return info
 })

}
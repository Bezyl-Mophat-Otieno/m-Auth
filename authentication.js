import nodemailer from 'nodemailer';


let config = {
    host:process.env.EMAIL_HOST || "",
    server:process.env.EMAIL_SERVER || "",
    port:process.env.EMAIL_PORT || "",
    auth:{
        user:process.env.SYS_ADMIN_EMAIL || "",
        pass:process.env.SYS_ADMIN_EMAIL_PWD || ""
    }

}

let mailOptions = {
    from:process.env.SYS_ADMIN_EMAIL || "",
    to:"",
    subject:"",
    text:"",
    html: "",
    attachments:[]
}

const ENV = {
    host:process.env.EMAIL_HOST || "",
    server:process.env.EMAIL_SERVER || "",
    port:process.env.EMAIL_PORT || "",
    user:process.env.SYS_ADMIN_EMAIL || "",
    pass:process.env.SYS_ADMIN_EMAIL_PWD || ""
}


// Creating transporter 
const createTransporter = (config)=>{

    // checking for environment variables
    for (const key in ENV) {
        if(key==="host" && ENV[key===""]) throw new Error("EMAIL_HOST env not found");
        if(key==="server" && ENV[key===""]) throw new Error("EMAIL_SERVER env not found");
        if(key==="port" && ENV[key===""])throw new Error("EMAIL_PORT env not found");
        if(key==="user" && ENV[key].user ==="") throw new Error ("SYS_ADMIN_EMAIL env not found")
        if(key==="pass"&& ENV[key].pass ==="") throw new Error ("SYS_ADMIN_EMAIL_PWD env not found");
    }
    
    return nodemailer.createTransport(config);
}

const sendMail = async (mailOptions)=>{
    for (const key in mailOptions) {
        if(!(mailOptions instanceof Object)) throw new Error("Create a mail options object with the required properties")
        if (key==="from" && mailOptions[key]==="") throw new Error("From: cannot be empty or undefined") 
        if(key==="to" && !mailOptions[key]) throw new Error("To: cannot be empty or undefined")
        if(key==="subject" && !mailOptions[key]) throw new Error("Subject: cannot be empty or undefined")
    }


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

export {createTransporter , sendMail}
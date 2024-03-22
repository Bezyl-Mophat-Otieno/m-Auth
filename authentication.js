import nodemailer from 'nodemailer';
let mailOptionsSchema = {
   /** The e-mail address of the sender. All e-mail addresses can be plain 'sender@server.com' or formatted 'Sender Name <sender@server.com>' */
    from:process.env.SYS_ADMIN_EMAIL || "",
   /** Comma separated list or an array of recipients e-mail addresses that will appear on the To: field */
    to:"",
   /** The subject of the e-mail */
    subject:"",
   /** The subject of the e-mail */
    text:"",
   /** The HTML version of the message */
    html: "",
   /** An array of attachment objects */
    attachments:[]
}

// Creating transporter helper function
const createTransporter = (config)=>{
    
    return nodemailer.createTransport(config);
}

const sendMail = async (mailOptions)=>{
    let configSchema = {
    host:process.env.EMAIL_HOST || "",
    server:process.env.EMAIL_SERVER || "",
    port:process.env.EMAIL_PORT || "",
    auth:{
        user:process.env.SYS_ADMIN_EMAIL || "",
        pass:process.env.SYS_ADMIN_EMAIL_PWD || ""
    }

}
    const ENV = {
    EMAIL_HOST:process.env.EMAIL_HOST || "",
    EMAIL_SERVER:process.env.EMAIL_SERVER || "",
    EMAIL_PORT:process.env.EMAIL_PORT || "",
    SYS_ADMIN_EMAIL:process.env.SYS_ADMIN_EMAIL || "",
    SYS_ADMIN_EMAIL_PWD:process.env.SYS_ADMIN_EMAIL_PWD || ""
}
    // checking for environment variables
    console.log(configSchema)
    for (const key in ENV) {
        if(!ENV[key]) throw new Error(`${key} env must be set in the environement variables`);
    }
    if(!(mailOptions instanceof Object)) throw new Error("mailOptions must be an object");
    for (const key in mailOptionsSchema) {
        if( !(key in mailOptions)) throw new Error(`mailOptions must have ${key} property`);
    }
    if(mailOptions.text === "" && mailOptions.html === "") throw new Error("text or html content must be set");
    if(mailOptions.attachments && !Array.isArray(mailOptions.attachments)) throw new Error("attachments must be an array");
    
const transporter = createTransporter(configSchema);
let isValid = await transporter.verify();

if(!isValid){
    throw new Error("Invalid transporter");
}
 transporter.sendMail(mailOptions,(error,info)=>{
        if(error){
            console.log("Error sending mail",error);
            throw new Error(error);
        }
        console.log("Mail sent",info.response);
        
 })
}

export {sendMail}
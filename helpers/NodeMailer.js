import nodemailer from "nodemailer";

export async function mail(maileroptions) {

  const transporter = nodemailer.createTransport({
    service: 'hotmail',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.NODE_EMAIL,
      pass: process.env.EMAIL_PASS
    },
  });

  transporter.sendMail(maileroptions, (error,info)=>{
    if(error){
      console.log(error);
      return;
    }
    console.log(info.response);
  });
}



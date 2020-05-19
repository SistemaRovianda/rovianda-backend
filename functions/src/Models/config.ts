export default {
    
    nodemailer:{
        host:"smtp.gmail.com",
        port:"465",
        secure:true,
        auth:{
            user: "@gmail.com",
            pass: ""
        },
        mailOptions:{
            from: "Rovianda <@gmail.com>",
            subject: "Remision"
        }
    }
    
    

}
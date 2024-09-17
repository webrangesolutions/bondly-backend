import { createTransporter } from "../utils/mailer.js";// Not using due to credentials Issue
const emailServices = {
    sendEmail(email, subject, body){
        var mail = createTransporter();
        var mailOptions = {
            from: "Power of Attorney",
            to: email,
            subject: subject,
            html: body
        };
     
        return mail.sendMail(mailOptions)
    }
}

export default emailServices
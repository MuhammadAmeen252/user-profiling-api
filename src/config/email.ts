import sgMail from '@sendgrid/mail';
import accountNotifications  from './views/accountNotifications';

// sgMail.setApiKey(process.env.SENDGRID_API_KEY)
export default function sendNotificationMail (email, subject, message, name) {
    try{
        // sgMail.send({
        //     to: email,
        //     from: process.env.BUSINESS_EMAIL,
        //     subject: subject,
        //     html: accountNotifications(message, name)
        // })
    }
    catch(e){
        console.log("send grid error:", e)
    }
}


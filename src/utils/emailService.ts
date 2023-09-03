import sendNotificationMail from "../config/email"

export const sendAccountVerificationMail = (email, name, emailVerificationToken) => {
    const subject = 'Account verification Email'
    const message = `Thank you for creating your account<br>
        Verify your account by clicking this by going on <link>localhost:8080?emailToken=${emailVerificationToken}</link>`
    sendNotificationMail(email, subject, message, name)
}
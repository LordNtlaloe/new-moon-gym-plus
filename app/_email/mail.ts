'use server'

import nodemailer from "nodemailer"

export async function sendMail({ to, name, subject, body }: { to: string, name: string, subject: string, body: string }) {
    const { SMTP_EMAIL, SMTP_PASSWORD } = process.env

    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: SMTP_EMAIL,
            pass: SMTP_PASSWORD
        }
    })
    //Test email send function
    try {
        const testResult = await transport.verify()
        console.log(testResult);

    } catch (error) {
        console.log(error);
        return null
    }
    //We now send email
    try {
        const sendResult = await transport.sendMail({
            from: SMTP_EMAIL,
            to: to,
            subject: subject,
            html: body
        })
    } catch (error) {
        console.log(error);
    }
}
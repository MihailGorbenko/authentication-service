import nodemailer from 'nodemailer'
import config from 'config'
import Log from './log'

const log = new Log('SendEmail')

export default async function sendEmail(email:string, subject:string, text:string, html: string){

    try {
        const transporter = nodemailer.createTransport({
            host: config.get('emailHost'),
            port: 587,
            secure:false,
            auth: {
                user: config.get('emailUser'),
                pass: config.get('emailPassword')
            }
        })

        await transporter.sendMail({
            from: config.get('emailUser'),
            to: email,
            subject,
            text,
            html
        })
        log.info('Email sent successfully')



    }catch(err:any){
        log.error(`Email not sent ${err?.message}`)
    }
}
import nodemailer from 'nodemailer';

export async function POST(req, res) {
    try {
        const { mailBody } = await req.json();

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.AUTH_EMAIL,
                pass: process.env.AUTH_PASS
            }
        });

        let mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: process.env.RECEIVER_EMAIL,
            subject: 'Multiplication Tables Test Results',
            text: mailBody
        };

        let { status, message } = await new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    reject({ status: false, message: error });
                } else {
                    resolve({ status: true, message: info.response });
                }
            });
        });

        return Response.json({ status, message });
    } 
    catch (error) {
        return Response.json({ status: false, message: error });
    }
}
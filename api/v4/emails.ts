import nodemailer from 'nodemailer';

type EmailOptions = {
    from: string,
    to: string,
    subject?: string,
    text: string,
    html?: string,
}

// TODO: Chnage structure

async function sendEmail({
    from,
    to,
    subject,
    text,
    html
}: EmailOptions) {
  try {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    const account = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: account.user, // generated ethereal user
            pass: account.pass // generated ethereal password
        }
    });

    // setup email data with unicode symbols
    const mailOptions = {
        from: from, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: html // html body
    };

    // send mail with defined transport object
    const info = await transporter.sendMail(mailOptions)

    console.log("Message sent: ", info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: ", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.log(error)

    throw Error(error);
  }
}

export async function sendEmailRememberPassword(toEmail: string) {
    try {
        const mailOptions = {
            from: 'rememeber@internet-store.com',
            to: toEmail,
            text: 'Instruction for restore password',
        }

        await sendEmail(mailOptions);
    } catch (error) {
        throw Error(error);
    }
}
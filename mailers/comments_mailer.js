const nodeMailer = require('../config/nodemailer');
require('dotenv').config();

exports.newComment = (comment) => {
    // console.log('Inside newComment mailer');
    let htmlString = nodeMailer.renderTemplate({ comment: comment }, '/comments/new_comment.ejs');

    nodeMailer.transporter.sendMail({
        from: process.env.GMAIL,
        to: comment.user.email,
        subject: "New Comment Published!",
        html: htmlString
        // html: '<h1>Yup! your comment is now published!!</h1>'
    }, (err, info) => {
        if (err) {
            console.log('Error in sending mail', err);
            return;
        }
        console.log('Message sent', info);
        return;
    });
}
const nodemailer = require('../config/nodemailer');

// thi is another way of exporting a method
exports.newComment = (comment) => {
    
    let htmlString= nodemailer.renderTemplate({comment: comment}, '/comments/new_comments.ejs');

    nodemailer.transporter.sendMail({
        from: 'keshav.learning0508@gmail.com',
        to: comment.user.email,
        subject: "New Comment published!",
        html: htmlString
    }, (err,info) =>{
        if(err){
            console.log(' Error in sending mail', err);
            return;
        }

        console.log('mail delivered', info);
        return;
    });
}
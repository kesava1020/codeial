const fs= require('fs');
const rfs= require('rotating-file-stream');
const path= require('path');

const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log',{
    interval: '1d',
    path: logDirectory
});

const development ={
    name: 'development',
    asset_path: './assets',
    session_cookie_key: 'blahsomething',
    db: 'codeial_development',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth:{
            user: 'keshav.learning0508',
            pass: 'vqsqcwtplmuowzzs' 
        }
    },
    google_client_id: "381676325003-qrbusgdfrn6l8h878599kr9s98ufphro.apps.googleusercontent.com",
    google_client_secret: "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",
    google_callback_url: "http://localhost:8000/users/auth/google/callback",
    jwt_secret: 'codeial',
    morgan: {
        mode: 'dev',
        options: { stream: accessLogStream}
    }
}

const production ={
    name: 'production',
    asset_path: 'public'+process.env.CODEIAL_ASSET_PATH,
    // asset_path: './public/assets',
    session_cookie_key: process.env.CODEIAL_session_cookie_key,
    db: process.env.CODEIAL_db,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth:{
            user: process.env.CODEIAL_gmail_username,
            pass: process.env.CODEIAL_gmail_password 
        }
    },
    google_client_id: process.env.CODEIAL_google_client_id,
    google_client_secret: process.env.CODEIAL_google_client_secret,
    google_callback_url: process.env.CODEIAL_google_callback_url,
    jwt_secret: process.env.CODEIAL_JWT_SECRET,
    morgan: {
        mode: 'combined',
        options: { stream: accessLogStream}
    }
}

module.exports = eval(process.env.CODEIAL_ENVIRONMENT) == undefined ? development: eval(process.env.CODEIAL_ENVIRONMENT);
// module.exports = development;
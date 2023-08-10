
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({ // config mail server
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'ph.hoangloc@gmail.com', //Tài khoản gmail vừa tạo
        pass: 'trdecbcnuzkaduob' //Mật khẩu tài khoản gmail vừa tạo
    },
});

module.exports = transporter
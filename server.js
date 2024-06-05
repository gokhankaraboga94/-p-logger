const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// E-posta gönderme işlevi
const sendEmail = (ip) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.RECIPIENT_EMAIL,
    subject: 'Yeni IP Adresi',
    text: `Yeni bir ziyaretçi IP adresi: ${ip}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('E-posta gönderildi: ' + info.response);
  });
};

// IP adresini kaydet ve e-posta gönder
app.post('/log-ip', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(`Ziyaretçi IP adresi: ${ip}`);
  sendEmail(ip);
  res.send('IP adresiniz kaydedildi.');
});

// Ana sayfa
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} adresinde çalışıyor.`);
});

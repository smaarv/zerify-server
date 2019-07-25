const {Certificates} = require('../models');
const uuidv4 = require('uuid/v4');
const nodemailer = require('nodemailer');

const create = async (req, res) => {
  const {hash, settings} = req.body;
  // if (!hash) {
  //   return res.status(400).send({message: 'Invalid hash'});
  // }

  let hashed = uuidv4();
  console.log(hashed);

  // if (settings) {
  //   return res.hash.send({message: 'you have your hash'});
  // }

  const certificate = await Certificates.create({
    hash: hashed,
    settings,
  });
  console.log('this is the', res);

  // Call our email function to send the email with the generated hash.
  await email(hashed);

  return res.send({hashed});
};

const list = async (req, res) => {
  const certificate = await Certificates.findAll({});

  return res.status(200).send({certificate});
};

const getCertificateByHash = async (req, res) => {
  const {hash} = req.params;

  if (!hash) {
    return res.sendStatus(404);
  }
  try {
    const certificate = await Certificates.findOne({
      where: {
        hash: hash,
      },
      attributes: {
        exclude: ['id', 'hash', 'createdAt', 'updatedAt'],
      },
    });
    if (!certificate) {
      return res.sendStatus(404);
    }
    console.log({certificate});
    return res.send({certificate});
  } catch (err) {
    console.log({err});
    return res.sendStatus(400);
  }
};

// const email = async hashed => {
//   //config email
//   let transporter = nodemailer.createTransport({
//     host: 'smtp.ethereal.email',
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: 'lance.morar98@ethereal.email', // generated ethereal user
//       pass: 'G2x1G7JKQ26b2Xrq53', // generated ethereal password
//     },
//   });

//   // const baseUrl = 'https://zertify.netlify.com';
//   const baseUrl = 'http://localhost:3000/';

//   const urlLink = `${baseUrl}/certificate/sent/${hashed}`;
//   const email = 'camille.charteau@hotmail.fr';

//   let mailOptions = {
//     from: '"Team Zertify" <lance.morar98@ethereal.email>', // sender address
//     to: `${email}`, // list of receivers
//     subject: 'Zertify Certificate Notification', // Subject line
//     text: `Congratulations, click the link to open your certificate: "EXAMPLE"`, // plain text body
//     html: `<b><a href="${urlLink}" >Go to certificate</a></b>`, // html body
//   };
//   // build template email
//   //create link with certificate
//   // sent email

//   // send mail with defined transport object
//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       return console.log(error);
//     }
//     console.log('Message sent: %s', info.messageId);
//     console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
//   });
//   // email().catch(console.error);
// };

module.exports = {
  create,
  list,
  getCertificateByHash,
};

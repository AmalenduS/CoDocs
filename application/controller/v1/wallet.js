const { ObjectId } = require('mongoose').Types;
const fs = require('fs');
const { handleResponse, handleError } = require('../../config/requestHandler');
const {
  addAdmin,
  createUserWallet,
  storeWallet,
  updateWalletCertificate,
  addOrgnameInDb,
} = require('../../services/v1/wallet');
const { encryptCertificates } = require('../../services/v1/encryption');
//const { sendMail, sendMailWithAttachment } = require('../../utils/mail');
const logger = require('../../config/logger');
const x509 = require('x509');
module.exports = {
  enrollAdmin: async (req, res) => {
    try {
      const data = await addAdmin(req.body.orgName);
      handleResponse({ res, data });
    } catch (err) {
      handleError({ res, err });
    }
  },
  registerUser: async ({ body }, res) => {
    try {
      const { orgName, username, passcode } = body;
      const certData = await createUserWallet(orgName, username);
      const encryptCert = await encryptCertificates(
        passcode,
        JSON.stringify(certData.x509Identity),
      );
      const walletDetails = {
        _id: ObjectId(),
        email: certData.username,
        certificate: encryptCert,
      };
      const certs = JSON.stringify(certData.x509Identity);
      const storeWalletData = await storeWallet(walletDetails);
      const mailContent = ` Email: ${username} Registered Successfully, Please Store the Certificate for Recovery`;
      const subject = 'Register User on Doctrace Successfully';
      const attachment = {
        filename: `${walletDetails.email}.id`,
        content: certs,
        contentType: 'text/json',
      };
      const mail = await sendMailWithAttachment(
        username,
        subject,
        mailContent,
        attachment,
      );
      const data = {
        email: certData.username,
        _id: storeWalletData._id,
        mailResponse: mail,
      };
      const addOrgName = await addOrgnameInDb(username, orgName);
      handleResponse({
        res,
        msg: `Successfully Registered ${certData.username} on Hyperledger`,
        data,
      });
    } catch (err) {
      handleError({ res, err: 'Register User Failed', data: err });
    }
  },
  recoverCertificate: async (req, res) => {
    logger.info('Inside recoverCertificate Controller');
    try {
      const { newPasscode, email } = req.body;
      if(req.files.certificate === undefined ) {
        return handleError({
          res,
          statusCode: 404,
          err:'File Not Found',
          data: 'File Has not been Uploaded'
        })
      }

      const filename = req.files.certificate[0].originalname;
      const fileExtension = filename.split('.').indexOf('id');

      if(fileExtension === -1) {
        return handleError({
          res,
          statusCode: 422,
          data: 'The File Should be in .id format'
        })
      }
      
      const { path } = req.files.certificate[0];
      const certificate = fs.readFileSync(path);
      console.log(
        '🚀 ~ file: wallet.js ~ line 73 ~ recoverCertificate: ~ certificate',
        JSON.parse(certificate),
      );
      const cert = JSON.parse(certificate)
      const { commonName } = x509.getSubject(
        cert.credentials.certificate,
      );
      console.log(
        '🚀 ~ file: wallet.js ~ line 75 ~ recoverCertificate: ~ commonName',
        commonName,
      );
      if (commonName === email) {
        const certData = await encryptCertificates(
          newPasscode,
          certificate.toString(),
        );
        const updateCert = await updateWalletCertificate(email, certData);
        const mailContent = `<b> Email: ${email}'s Certificate Recovered Successfully with new Passcode Please Keep the Certificate Safe </b>`;
        const subject = 'Certificate Recovered Successfully';
        const attachment = {
          filename: `${email}.id`,
          content: certificate,
          contentType: 'text/json',
        };
        const mail = await sendMailWithAttachment(
          email,
          subject,
          mailContent,
          attachment,
        );
        const data = { email, _id: updateCert._id, mailResponse: mail };

        return handleResponse({
          res,
          msg: `Successfully Recovered ${email}'s Certificate`,
          data,
        });
      }
      const removeFile = fs.unlinkSync(path);

      return handleError({
        res,
        statusCode: 495,
        err: 'Invalid Certificate',
        data: 'Error Uploading & Verifying the Certificate',
      });
    } catch (error) {
      logger.error(error);
      if(error instanceof SyntaxError) {
        return handleError({
          res,
          statusCode: 495,
          err: `Invalid Certificate`,
          data: 'Error Uploading & Verifying the Certificate',
        });
      }
      handleError({ res, err: 'recoverCertificate Failed', data: error });
    }
  },
};

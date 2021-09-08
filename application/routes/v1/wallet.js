const express = require('express');
const multer = require('multer');

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/';
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const filename = file.originalname;
    const fileExtension = filename.split('.')[2];
    // eslint-disable-next-line prefer-template
    cb(null, filename);
  },
});

const upload = multer({
  // eslint-disable-next-line object-shorthand
  storage: storage,
});

const cpUpload = upload.fields([{ name: 'certificate', maxCount: 1 }]);

const {
  enrollAdmin,
  registerUser,
  // getWalletDetails,
  // updateWallet,
  recoverCertificate,
} = require('../../controller/v1/wallet');

const cognitoValidate = require('../../middleware/auth');

router.post('/enroll-admin', enrollAdmin);
router.post('/register-user', registerUser);
// router.get('/:id', getWalletDetails);
// router.put('/:id', updateWallet);
router.post('/recoverWallet', cpUpload, recoverCertificate);

module.exports = router;

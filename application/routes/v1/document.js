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
    const fileExtension = filename.split('.')[1];
    // eslint-disable-next-line prefer-template
    cb(null, Date.now() + '.' + fileExtension);
  },
});
const cognitoValidate = require('../../middleware/auth');

const upload = multer({
  // eslint-disable-next-line object-shorthand
  storage: storage,
});

const cpUpload = upload.fields([{ name: 'image', maxCount: 1 }]);

const {
  createDocument,
  getDocument,
  getPublicDocument,
  getAllDocuments,
  addDocumentAccess,
  revokeDocumentAccess,
  updateDocument,
  filterDocument,
  deleteDocument,
  getSharedDocument,
  getDocumentVersions,
  createDocumentTag,
  updateDocumentTags,
  removeDocumentTags,
  getDocumentTags,
  updateDocumentVisibilty,
  createAcceptanceDocument,
  getAcceptanceDocument,
} = require('../../controller/v1/document');

router.post('/getPublicDocument', getPublicDocument);

// Cognito Validations
router.use(cognitoValidate.authorizer);
router.use(cognitoValidate.userData);

router.post('/', cpUpload, createDocument);
router.post('/addAccess', addDocumentAccess);
router.post('/revokeAccess', revokeDocumentAccess);
router.put('/update/', cpUpload, updateDocument);
router.post('/getDocument', getDocument);
router.post('/getDocumentVersions', getDocumentVersions);
router.post('/getAllDocument', getAllDocuments);
router.post('/filter', filterDocument);
router.delete('/deleteDocument', deleteDocument);
router.post('/getSharedDocuments', getSharedDocument);
router.post('/createDocumentTag', createDocumentTag);
router.put('/updateDocumentTags', updateDocumentTags);
router.delete('/removeDocumentTags', removeDocumentTags);
router.post('/getDocumentTags', getDocumentTags);
router.post('/updateDocumentVisibilty', updateDocumentVisibilty);
router.post('/createAcceptanceDocument', createAcceptanceDocument);
router.post('/getAcceptanceDocument', getAcceptanceDocument);

module.exports = router;

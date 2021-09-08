/* eslint-disable camelcase */
/* eslint-disable no-undef */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable radix */
/* eslint-disable no-await-in-loop */
/* eslint-disable security/detect-object-injection */
const fs = require('fs')
const QRCode = require('qrcode')
const { handleResponse, handleError } = require('../../config/requestHandler')

const {
	addOnChainData,
	queryDocument,
	addAccessControl,
	revokeAccessControl,
	base64Encode,
	getPath,
	convertData,
	deleteDocument,
	querySharedDocument,
	addChildID,
	queryAllDocuments,
	convertMultipleData,
	createTags,
	updateDocumentTags,
	removeDocumentTags,
	getDocumentsFromTags,
	filterDocumentsWithTags,
	filterDocumentsWithoutTags,
	convertFilterData,
	getDocumentTags,
	queryPublicDocument,
	updateDocumentVisibilty,
	getDocumentTagsByEmail,
	createAcceptanceDocument,
	queryAcceptanceDocument,
} = require('../../services/v1/document')

const { getWallet } = require('../../services/v1/wallet')
const { decryptCertificates } = require('../../services/v1/encryption')
const logger = require('../../config/logger')

module.exports.createDocument = async (req, res) => {
	try {
		console.log(
			'🚀 ~ file: document.js ~ line 322 ~ module.exports.getSharedDocument= ~ req.user',
			req.user
		)
		console.log(
			'🚀 ~ file: document.js ~ line 321 ~ module.exports.getSharedDocument= ~ req.body',
			req.body
		)
		if (req.user.blockchain_orgname != 'receiverOrg') {
			const {
				name,
				category,
				status,
				version,
				attributes,
				metadata,
				isPublic,
				ownedBy,
				passcode,
				superAdmin,
				receiverEmail,
			} = req.body
			const { email, blockchain_orgname } = req.user
			const documentId = Math.floor(100000000 + Math.random() * 900000000)
			const dateCreated = new Date().toISOString()
			const issuedBy = email
			// Create path dynamically image fetch
			const onchainData = {
				Attributes: attributes,
				Metadata: metadata,
			}
			/*
      let onchainImages = await QRCode.toDataURL(JSON.stringify(onchainData));

            if (req.files && req.files.image != null) {
              logger.info('Inside Create Thumbnail')
              const path = await getPath(JSON.stringify(req.files.image[0].path));
              // eslint-disable-next-line security/detect-non-literal-fs-filename
              const bitmap = await fs.readFileSync(path);
              // Encode the image in base64
              onchainImages = await base64Encode(bitmap);
              // const image = await base64Decode(imageB64, 'img123.jpeg');
            }
      */
			const onchainDataStr = JSON.stringify(onchainData)
			const onchainDataB64 = await base64Encode(onchainDataStr)
			const onchainImages = 'Temp Data'
			const wallet = await getWallet(email)
			console.log('passcode', passcode)
			const identity = await decryptCertificates(passcode, wallet.certificate)
			console.log('identiy', identity)
			if (identity.err) {
				return handleError({
					res,
					statusCode: 405,
					err: 'Wrong Passcode!',
					data: identity.msg,
				})
			}
			const result1 = await addOnChainData(
				JSON.parse(identity),
				blockchain_orgname,
				email,
				[
					String(documentId),
					onchainDataB64,
					name,
					category,
					null,
					null,
					status,
					issuedBy,
					ownedBy,
					version,
					dateCreated,
					dateCreated,
					onchainImages,
					isPublic,
				]
			)

			// const emails = JSON.stringify([req.user.superProvider.email]);
			const emails = JSON.stringify([superAdmin, receiverEmail])
			const accessData = await addAccessControl(
				JSON.parse(identity),
				blockchain_orgname,
				email,
				[documentId, emails]
			)
			return handleResponse({
				res,
				msg: `Document ${documentId} created!`,
				data: {
					msg: result1.toString(),
					documentId,
					addAccess: accessData.toString(),
				},
			})
		}
		return handleError({
			res,
			statusCode: 401,
			err: "You're not authorize to perform this action!",
		})
	} catch (err) {
		console.log(err)
		return handleError({ res, err: 'Something went wrong ', data: err })
	}
}

// eslint-disable-next-line consistent-return
module.exports.getDocument = async (req, res) => {
	try {
		console.log('req.user --> ', req.user)
		console.log('req.body --> ', req.body)
		const { passcode, documentId } = req.body
		const { email, blockchain_orgname } = req.user
		const wallet = await getWallet(email)
		const identity = await decryptCertificates(passcode, wallet.certificate)
		console.log(
			'==> ',
			passcode,
			documentId,
			email,
			blockchain_orgname,
			wallet,
			identity
		)

		if (identity.err) {
			return handleError({
				res,
				statusCode: 405,
				err: 'Wrong Passcode!',
				data: identity.msg,
			})
		}
		const data = await queryDocument(
			JSON.parse(identity),
			blockchain_orgname,
			email,
			documentId
		)

		const obj = await convertData(data)
		return handleResponse({
			res,
			msg: `Document details of ${documentId}`,
			data: obj,
		})
	} catch (err) {
		return handleError({ res, err: 'Something went wrong ', data: err })
	}
}

module.exports.getPublicDocument = async (req, res) => {
	try {
		console.log('docuemnt id -> ', req.body)

		const { documentId } = req.body
		// const { email, blockchain_orgname } = req.user;

		const blockchain_orgname = 'providerOrg'
		const email = 'harsh.gupta1@solulab.co'
		const passcode = '123@123'
		const wallet = await getWallet(email)
		const identity = await decryptCertificates(passcode, wallet.certificate)
		if (identity.err) {
			return handleError({
				res,
				statusCode: 405,
				err: 'Wrong Passcode!',
				data: identity.msg,
			})
		}
		const data = await queryDocument(
			JSON.parse(identity),
			blockchain_orgname,
			email,
			documentId
		)

		const obj = await convertData(data)
		return handleResponse({
			res,
			msg: `Document details of ${documentId}`,
			data: obj,
		})
	} catch (err) {
		return handleError({ res, err: 'Something went wrong ', data: err })
	}
}

module.exports.getDocumentVersions = async (req, res) => {
	try {
		const { passcode, documentId } = req.body
		console.log(
			'🚀 ~ file: document.js ~ line 234 ~ module.exports.getDocumentVersions= ~ req.body',
			req.body
		)
		console.log('Test');
		const { email, blockchain_orgname } = req.user
		console.log(
			'🚀 ~ file: document.js ~ line 236 ~ module.exports.getDocumentVersions= ~ req.user',
			req.user
		)
		const wallet = await getWallet(email)
		const identity = await decryptCertificates(passcode, wallet.certificate)
		if (identity.err) {
			return handleError({
				res,
				statusCode: 405,
				err: 'Wrong Passcode!',
				data: identity.msg,
			})
		}
		const documents = {}
		let data = await queryDocument(
			JSON.parse(identity),
			blockchain_orgname,
			email,
			documentId
		)
		let obj = await convertData(data)
		documents[0] = obj
		// eslint-disable-next-line eqeqeq
		for (let i = 1; obj.ParentDocumentID != ''; i++) {
			data = await queryDocument(
				JSON.parse(identity),
				blockchain_orgname,
				email,
				obj.ParentDocumentID
			)
			obj = await convertData(data)
			documents[i] = obj
		}

		return handleResponse({
			res,
			msg: `Document details of ${documentId}`,
			data: documents,
		})
	} catch (err) {
		return handleError({ res, err: 'Something went wrong ', data: err })
	}
}

module.exports.getAllDocuments = async (req, res) => {
	try {
		const { passcode } = req.body
		console.log(
			'🚀 ~ file: document.js ~ line 287 ~ module.exports.getAllDocuments= ~ req.body',
			req.body
		)
		const { email, blockchain_orgname } = req.user
		console.log(
			'🚀 ~ file: document.js ~ line 288 ~ module.exports.getAllDocuments= ~ req.user',
			req.user
		)
		const wallet = await getWallet(email)
		const identity = await decryptCertificates(passcode, wallet.certificate)
		if (identity.err) {
			return handleError({
				res,
				statusCode: 405,
				err: 'Wrong Passcode!',
				data: identity.msg,
			})
		}
		const data = await queryAllDocuments(
			JSON.parse(identity),
			blockchain_orgname,
			email
		)
		const obj = await convertMultipleData(data)
		return handleResponse({ res, msg: 'All Documents:', data: obj })
	} catch (err) {
		return handleError({ res, err: 'Something went wrong ', data: err })
	}
}

module.exports.getSharedDocument = async (req, res) => {
	try {
		const { passcode } = req.body
		const { email, blockchain_orgname } = req.user
		console.log(
			'🚀 ~ file: document.js ~ line 322 ~ module.exports.getSharedDocument= ~ req.user',
			req.user
		)
		console.log(
			'🚀 ~ file: document.js ~ line 321 ~ module.exports.getSharedDocument= ~ req.body',
			req.body
		)
		const wallet = await getWallet(email)
		const identity = await decryptCertificates(passcode, wallet.certificate)
		if (identity.err) {
			return handleError({
				res,
				statusCode: 405,
				err: 'Wrong Passcode!',
				data: identity.msg,
			})
		}
		const data = await querySharedDocument(
			JSON.parse(identity),
			blockchain_orgname,
			email
		)
		const obj = await convertMultipleData(data)
		return handleResponse({
			res,
			msg: `Shared Documents of user: ${email}`,
			data: obj,
		})
	} catch (err) {
		return handleError({ res, err: 'Something went wrong ', data: err })
	}
}

module.exports.addDocumentAccess = async (req, res) => {
	try {
		console.log('req.body', req.body)
		const { addEmail, documentId, passcode } = req.body
		const { email, blockchain_orgname } = req.user
		console.log(
			'🚀 ~ file: document.js ~ line 322 ~ module.exports.getSharedDocument= ~ req.user',
			req.user
		)
		console.log(
			'🚀 ~ file: document.js ~ line 321 ~ module.exports.getSharedDocument= ~ req.body',
			req.body
		)
		const wallet = await getWallet(email)
		const identity = await decryptCertificates(passcode, wallet.certificate)
		// converting the array to string because access can be given to multiple users at a time
		if (identity.err) {
			return handleError({
				res,
				statusCode: 405,
				err: 'Wrong Passcode!',
				data: identity.msg,
			})
		}
		const emails = JSON.stringify([addEmail])
		const data = await addAccessControl(
			JSON.parse(identity),
			blockchain_orgname,
			email,
			[documentId, emails]
		)

		return handleResponse({ res, data })
	} catch (err) {
		console.log('error --> ', err)

		return handleError({ res, err: 'Something went wrong ', data: err })
	}
}

module.exports.revokeDocumentAccess = async (req, res) => {
	try {
		const { removeEmail, documentId, passcode } = req.body
		const { email, blockchain_orgname } = req.user
		console.log(
			'🚀 ~ file: document.js ~ line 322 ~ module.exports.getSharedDocument= ~ req.user',
			req.user
		)
		console.log(
			'🚀 ~ file: document.js ~ line 321 ~ module.exports.getSharedDocument= ~ req.body',
			req.body
		)
		const wallet = await getWallet(email)
		const identity = await decryptCertificates(passcode, wallet.certificate)
		if (identity.err) {
			return handleError({
				res,
				statusCode: 405,
				err: 'Wrong Passcode!',
				data: identity.msg,
			})
		}
		// converting the array to string because access can be given to multiple users at a time
		const emails = JSON.stringify([removeEmail])
		const data = await revokeAccessControl(
			JSON.parse(identity),
			blockchain_orgname,
			email,
			[documentId, emails]
		)

		return handleResponse({ res, data })
	} catch (err) {
		return handleError({ res, err: 'Something went wrong ', data: err })
	}
}

// eslint-disable-next-line consistent-return
module.exports.updateDocument = async (req, res) => {
	try {
		console.log('req.user ->', req.user)
		console.log(
			'🚀 ~ file: document.js ~ line 322 ~ module.exports.getSharedDocument= ~ req.user',
			req.user
		)
		console.log(
			'🚀 ~ file: document.js ~ line 321 ~ module.exports.getSharedDocument= ~ req.body',
			req.body
		)
		if (req.user.blockchain_orgname != 'receiverOrg') {
			const { documentId } = req.query
			const {
				name,
				category,
				status,
				attributes,
				metadata,
				isPublic,
				issuedBy,
				ownedBy,
				passcode,
			} = req.body
			const { email, blockchain_orgname } = req.user
			const wallet = await getWallet(email)
			const identity = await decryptCertificates(passcode, wallet.certificate)
			if (identity.err) {
				return handleError({
					res,
					statusCode: 405,
					err: 'Wrong Passcode!',
					data: identity.msg,
				})
			}
			const data = await queryDocument(
				JSON.parse(identity),
				blockchain_orgname,
				email,
				documentId
			)
			const obj = await convertData(data)
			const newVersion = (parseInt(obj.Version) + 1).toString()
			if (Boolean(obj.ChildDocumentID) === true) {
				return handleError({
					res,
					statusCode: 503,
					err: 'Something went wrong',
					data: 'Cannot Update This Document, This Document is not latest!! Please Update the Latest one',
				})
			}

			const query = {
				field: '',
				value: '',
			}
			if (documentId) {
				;(query.field = '_id'), (query.value = documentId)
			} else {
				;(query.field = 'email'), (query.value = email)
			}

			if (obj.isPublic === isPublic || isPublic == null) {
				logger.info('Inside Update Service If condition')
				const updatedDocumentData = {
					_id: Math.floor(100000000 + Math.random() * 900000000),
					DocumentName: name || obj.DocumentName,
					DocumentCategory: category || obj.DocumentCategory,
					ParentDocumentId: documentId,
					ChildDocumentId: null,
					DocumentStatus: status || obj.DocumentStatus,
					IssuedBy: issuedBy || obj.IssuedBy,
					OwnedBy: ownedBy || obj.OwnedBy,
					Version: newVersion,
					DateCreated: obj.DateCreated,
					DateUpdated: new Date().toISOString(),
				}

				const onchainImages = data.thumbnails
				/*
        if (req.files && req.files.image != null) {
          // Create path dynamically image fetch
          const path = await getPath(JSON.stringify(req.files.image[0].path));
          // eslint-disable-next-line security/detect-non-literal-fs-filename
          const bitmap = fs.readFileSync(path);

          // Encode the image in base64
          onchainImages = await base64Encode(bitmap);
        }
        */
				const onchainData = {
					Attributes: attributes || obj.onChainData.Attributes,
					Metadata: metadata || obj.onChainData.Metadata,
				}

				const onchainDataStr = JSON.stringify(onchainData)
				const onchainDataB64 = await base64Encode(onchainDataStr)

				const result = await addOnChainData(
					JSON.parse(identity),
					blockchain_orgname,
					email,
					[
						String(updatedDocumentData._id),
						onchainDataB64,
						updatedDocumentData.DocumentName,
						updatedDocumentData.DocumentCategory,
						updatedDocumentData.ParentDocumentId,
						updatedDocumentData.ChildDocumentId,
						updatedDocumentData.DocumentStatus,
						updatedDocumentData.IssuedBy,
						updatedDocumentData.OwnedBy,
						updatedDocumentData.Version,
						updatedDocumentData.DateCreated,
						updatedDocumentData.DateUpdated,
						onchainImages,
						isPublic,
					]
				)

				const childId = updatedDocumentData._id
				const result1 = await addChildID(
					JSON.parse(identity),
					blockchain_orgname,
					email,
					[String(documentId), childId]
				)

				const emails = JSON.stringify(obj.Access)
				const accessData = await addAccessControl(
					JSON.parse(identity),
					blockchain_orgname,
					email,
					[childId, emails]
				)

				const query = {
					field: '',
					value: '',
				}
				if (documentId) {
					;(query.field = '_id'), (query.value = documentId)
				} else {
					;(query.field = 'email'), (query.value = email)
				}
				let getTags
				getTags = await getDocumentTags(query)
				if (getTags === null) {
					const response = {
						UpdateDocument: result.toString(),
						AddAccess: accessData.toString(),
						AddChildDocument: result1.toString(),
						documentId: childId,
					}
					return handleResponse({
						res,
						msg: `Document ${updatedDocumentData._id} updated!`,
						data: response,
					})
				}
				const tagDetails = {
					_id: childId,
					email,
					tags: getTags,
				}

				const createTag = await createTags(tagDetails)
				if (createTag.err) {
					if (createTag.err.code === 11000) {
						return handleError({
							res,
							statusCode: 400,
							err: 'Tag already exist!',
							data: createTag.err,
						})
					}
					if (createTag.err.message) {
						return handleError({
							res,
							statusCode: 400,
							err: createTag.err.message,
							data: createTag.err,
						})
					}
					return handleError({ res, statusCode: 400, data: createTag.err })
				}
				const response = {
					UpdateDocument: result.toString(),
					AddAccess: accessData.toString(),
					AddChildDocument: result1.toString(),
					documentId: childId,
					AddTags: createTag,
				}
				return handleResponse({
					res,
					msg: `Document ${updatedDocumentData._id} updated!`,
					data: response,
				})
			}
			return handleError({
				res,
				statusCode: 401,
				err: 'Public Visibility Mismatch',
			})
		}
		return handleError({
			res,
			statusCode: 401,
			err: "You're not authorize to perform this action!",
		})
	} catch (err) {
		return handleError({ res, err: 'Something went wrong ', data: err })
	}
}

module.exports.filterDocument = async (req, res) => {
	try {
		const { filters, tags, passcode } = req.body
		const { email, blockchain_orgname } = req.user
		console.log(
			'🚀 ~ file: document.js ~ line 322 ~ module.exports.getSharedDocument= ~ req.user',
			req.user
		)
		console.log(
			'🚀 ~ file: document.js ~ line 321 ~ module.exports.getSharedDocument= ~ req.body',
			req.body
		)
		const keys = []
		const values = []
		const documentIds = []
		const wallet = await getWallet(email)
		const identity = await decryptCertificates(passcode, wallet.certificate)
		if (identity.err) {
			return handleError({
				res,
				statusCode: 405,
				err: 'Wrong Passcode!',
				data: identity.msg,
			})
		}
		for (const item in filters) {
			keys.push(item)
			values.push(filters[item])
		}
		if (tags.length <= 0) {
			const filter = await filterDocumentsWithoutTags(
				JSON.parse(identity),
				blockchain_orgname,
				email,
				keys,
				values
			)
			if (filter.length <= 0) {
				return handleError({
					res,
					err: 'No Documents Found With These Filters',
					data: filter,
				})
			}
			const obj = await convertFilterData(filter)
			return handleResponse({
				res,
				msg: 'Filtered Documents without Tags',
				data: obj,
			})
		}
		const documentId = await getDocumentsFromTags(email, tags)
		if (documentId.length <= 0) {
			return handleError({
				res,
				err: 'No Documents Found With These Filters',
				data: documentId,
			})
		}
		documentId.forEach((element) => {
			documentIds.push(element._id)
		})
		const filter = await filterDocumentsWithTags(
			JSON.parse(identity),
			blockchain_orgname,
			email,
			documentIds,
			keys,
			values
		)
		if (filter.length <= 0) {
			return handleError({
				res,
				err: 'No Documents Found With These Filters',
				data: filter,
			})
		}
		const obj = await convertFilterData(filter)
		return handleResponse({
			res,
			msg: 'Filtered Documents with Tags',
			data: obj,
		})
	} catch (error) {
		return handleError({ res, err: 'Something went wrong ', data: error })
	}
}

module.exports.deleteDocument = async (req, res) => {
	logger.info('Inside Delete Document Controller')
	try {
		console.log(
			'🚀 ~ file: document.js ~ line 322 ~ module.exports.getSharedDocument= ~ req.user',
			req.user
		)
		console.log(
			'🚀 ~ file: document.js ~ line 321 ~ module.exports.getSharedDocument= ~ req.body',
			req.body
		)
		if (req.user.blockchain_orgname != 'receiverOrg') {
			const { passcode, documentId } = req.body
			const { email, blockchain_orgname } = req.user
			const wallet = await getWallet(email)
			const identity = await decryptCertificates(passcode, wallet.certificate)
			if (identity.err) {
				return handleError({
					res,
					statusCode: 405,
					err: 'Wrong Passcode!',
					data: identity.msg,
				})
			}
			const deleteDoc = await deleteDocument(
				JSON.parse(identity),
				blockchain_orgname,
				email,
				String(documentId)
			)
			return handleResponse({
				res,
				msg: `Document with ${documentId} is deleted`,
				data: deleteDoc.toString(),
			})
		}
		return handleError({
			res,
			statusCode: 401,
			err: "You're not authorize to perform this action!",
		})
	} catch (error) {
		logger.error(error)
		return handleError({ res, err: 'Something went wrong ', data: error })
	}
}

module.exports.createDocumentTag = async (req, res) => {
	logger.info('Inside createDocumentTag service')
	try {
		const { documentId, tags } = req.body
		const { email } = req.user
		console.log(
			'🚀 ~ file: document.js ~ line 322 ~ module.exports.getSharedDocument= ~ req.user',
			req.user
		)
		console.log(
			'🚀 ~ file: document.js ~ line 321 ~ module.exports.getSharedDocument= ~ req.body',
			req.body
		)
		const tagDetails = {
			documentId,
			email,
			tags,
		}
		const result = await createTags(tagDetails)
		if (result.err) {
			if (result.err.code === 11000) {
				return handleError({
					res,
					statusCode: 400,
					err: 'Tag already exist!',
					data: result.err,
				})
			}
			if (result.err.message) {
				return handleError({
					res,
					statusCode: 400,
					err: result.err.message,
					data: result.err,
				})
			}
			return handleError({ res, statusCode: 400, data: result.err })
		}
		return handleResponse({
			res,
			msg: 'Tag added successfully',
			data: result,
		})
	} catch (error) {
		return handleError({ res, err: 'Something went wrong ', data: error })
	}
}

module.exports.updateDocumentTags = async (req, res) => {
	logger.info('Inside updateTags Controller')
	try {
		const { documentId, tags } = req.body
		const { email } = req.user
		console.log(
			'🚀 ~ file: document.js ~ line 322 ~ module.exports.getSharedDocument= ~ req.user',
			req.user
		)
		console.log(
			'🚀 ~ file: document.js ~ line 321 ~ module.exports.getSharedDocument= ~ req.body',
			req.body
		)
		const updateTags = await updateDocumentTags(documentId, tags, email)
		return handleResponse({
			res,
			msg: 'Tags Updated Successfully',
			data: updateTags,
		})
	} catch (error) {
		logger.error(error)
		return handleError({ res, err: 'Something went wrong ', data: error })
	}
}

module.exports.removeDocumentTags = async (req, res) => {
	logger.info('Inside updateTags Controller')
	try {
		const { documentId, tags } = req.body
		const { email } = req.user
		console.log(
			'🚀 ~ file: document.js ~ line 322 ~ module.exports.getSharedDocument= ~ req.user',
			req.user
		)
		console.log(
			'🚀 ~ file: document.js ~ line 321 ~ module.exports.getSharedDocument= ~ req.body',
			req.body
		)
		const removeTags = await removeDocumentTags(documentId, tags, email)
		return handleResponse({
			res,
			msg: 'Tags Updated Successfully',
			data: removeTags,
		})
	} catch (error) {
		logger.error(error)
		return handleError({ res, err: 'Something went wrong ', data: error })
	}
}

module.exports.getDocumentTags = async (req, res) => {
	logger.info('Inside getDocumentTags Controller')
	try {
		const { documentId } = req.body
		const { email } = req.user
		console.log(
			'🚀 ~ file: document.js ~ line 322 ~ module.exports.getSharedDocument= ~ req.user',
			req.user
		)
		console.log(
			'🚀 ~ file: document.js ~ line 321 ~ module.exports.getSharedDocument= ~ req.body',
			req.body
		)
		// let query = {
		//   field: "", value: ""
		// }
		// if (documentId) {
		//   query.field = "documentId",
		//     query.value = documentId
		// }
		// else {
		//   query.field = "email",
		//     query.value = email
		// }
		const removeTags = await getDocumentTagsByEmail(documentId, email)
		return handleResponse({
			res,
			msg: `Tags of the document ${documentId}`,
			data: removeTags,
		})
	} catch (error) {
		logger.error(error)
		return handleError({ res, err: 'Something went wrong ', data: error })
	}
}

module.exports.updateDocumentVisibilty = async (req, res) => {
	try {
		//  const { passcode } = req.body;
		const { email, blockchain_orgname } = req.user
		const { isPublic, documentId, passcode } = req.body
		console.log(
			'🚀 ~ file: document.js ~ line 322 ~ module.exports.getSharedDocument= ~ req.user',
			req.user
		)
		console.log(
			'🚀 ~ file: document.js ~ line 321 ~ module.exports.getSharedDocument= ~ req.body',
			req.body
		)
		const wallet = await getWallet(email)
		const identity = await decryptCertificates(passcode, wallet.certificate)
		if (identity.err) {
			return handleError({
				res,
				statusCode: 405,
				err: 'Wrong Passcode!',
				data: identity.msg,
			})
		}
		const result1 = await updateDocumentVisibilty(
			JSON.parse(identity),
			blockchain_orgname,
			email,
			[String(documentId), isPublic]
		)
		return handleResponse({
			res,
			msg: `Updated Document Visiblity of: ${email}`,
			data: result1.toString(),
		})
	} catch (err) {
		return handleError({ res, err: 'Something went wrong ', data: err })
	}
}

module.exports.createAcceptanceDocument = async (req, res) => {
	try {
		const {
			documentId,
			documentMetadata,
			documentTemplate,
			ownedBy,
			passcode,
		} = req.body
		const { email, blockchain_orgname } = req.user
		console.log(
			'🚀 ~ file: document.js ~ line 322 ~ module.exports.getSharedDocument= ~ req.user',
			req.user
		)
		console.log(
			'🚀 ~ file: document.js ~ line 321 ~ module.exports.getSharedDocument= ~ req.body',
			req.body
		)
		const acceptanceDocumentNumber = Math.floor(
			100000000 + Math.random() * 900000000
		)
		const version = '1'
		const dateCreated = new Date().toISOString()
		issuedBy = email
		// Create path dynamically image fetch

		const metaData = JSON.stringify(documentMetadata)
		console.log(
			'🚀 ~ file: document.js ~ line 873 ~ module.exports.createAcceptanceDocument= ~ metaData',
			metaData
		)
		const metaDataB64 = await base64Encode(metaData)

		const templateData = JSON.stringify(documentTemplate)
		console.log(
			'🚀 ~ file: document.js ~ line 877 ~ module.exports.createAcceptanceDocument= ~ templateData',
			templateData
		)
		const templateDataB64 = await base64Encode(templateData)

		const wallet = await getWallet(email)
		console.log('passcode', passcode)

		const identity = await decryptCertificates(passcode, wallet.certificate)
		console.log('identiy', identity)
		if (identity.err) {
			return handleError({
				res,
				statusCode: 405,
				err: 'Wrong Passcode!',
				data: identity.msg,
			})
		}
		const result1 = await createAcceptanceDocument(
			JSON.parse(identity),
			blockchain_orgname,
			email,
			[
				String(acceptanceDocumentNumber),
				documentId,
				metaDataB64,
				templateDataB64,
				issuedBy,
				ownedBy,
				version,
				dateCreated,
			]
		)

		return handleResponse({
			res,
			msg: `Acceptance Document ${acceptanceDocumentNumber} created!`,
			data: {
				msg: result1.toString(),
				acceptanceDocumentNumber,
			},
		})
	} catch (err) {
		console.log(err)
		return handleError({ res, err: 'Something went wrong ', data: err })
	}
}

module.exports.getAcceptanceDocument = async (req, res) => {
	try {
		console.log('req.user --> ', req.user)
		const { passcode, documentId } = req.body
		const { email, blockchain_orgname } = req.user
		console.log(
			'🚀 ~ file: document.js ~ line 322 ~ module.exports.getSharedDocument= ~ req.user',
			req.user
		)
		console.log(
			'🚀 ~ file: document.js ~ line 321 ~ module.exports.getSharedDocument= ~ req.body',
			req.body
		)
		const wallet = await getWallet(email)
		const identity = await decryptCertificates(passcode, wallet.certificate)
		console.log(
			'==> ',
			passcode,
			documentId,
			email,
			blockchain_orgname,
			wallet,
			identity
		)

		if (identity.err) {
			return handleError({
				res,
				statusCode: 405,
				err: 'Wrong Passcode!',
				data: identity.msg,
			})
		}
		const data = await queryAcceptanceDocument(
			JSON.parse(identity),
			blockchain_orgname,
			email,
			documentId
		)
		console.log(
			'🚀 ~ file: document.js ~ line 960 ~ module.exports.getAcceptanceDocument= ~ data',
			data
		)
		const documentMetadata = await JSON.parse(
			Buffer.from(data.documentMetadata, 'base64').toString('ascii')
		)
		const documentTemplate = await JSON.parse(
			Buffer.from(data.documentTemplate, 'base64').toString('ascii')
		)
		const resp = {
			AcceptanceDocumentNumber: data.acceptanceDocumentNumber,
			DocumentNumber: data.DocumentNumber,
			DocumentMetadata: documentMetadata,
			DocumentTemplate: documentTemplate,
			IssuedBy: data.issuedBy,
			OwnedBy: data.ownedBy,
			Version: data.version,
			DateCreated: data.dateCreated,
		}
		return handleResponse({
			res,
			msg: `Acceptance Document details of ${documentId}`,
			data: resp,
		})
	} catch (err) {
		return handleError({ res, err: 'Something went wrong ', data: err })
	}
}

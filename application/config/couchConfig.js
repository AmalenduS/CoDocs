module.exports = {
  DocumentChaincode: {
    channelName: 'doctracechannel',
    contractName: 'doctrace',
    functionNames: {
      createDocument: 'CreateDocument',
      queryDocument: 'QueryDocument',
      queryDocumentVersions: 'QueryDocumentVersions',
      queryAllDocuments: 'QueryAllDocuments',
      addDocumentAccess: 'AddDocumentAccess',
      revokeDocumentAccess: 'RevokeDocumentAccess',
      deleteDocument: 'DeleteDocument',
      queryDocumentsUsingMangoQuery: 'QueryDocumentsUsingMangoQuery',
      updateChildID: 'UpdateChildID',
      updateIsPublic: 'UpdateIsPublic',
      createAcceptanceDocument: 'CreateAcceptanceDocument',
      queryAcceptanceDocument: 'QueryAcceptanceDocument',
    },
  },
  CouchDBWalletConfig: {
    url: process.env.DOCTRACE_COUCHDB_WALLET_URL,
    db: 'document',
  },
};

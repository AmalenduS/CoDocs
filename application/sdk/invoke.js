const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const logger = require('../config/logger');
const { CouchDBWalletConfig } = require('../config/couchConfig');
const buffer = require('buffer').Buffer;

module.exports = {
  invokeChaincode: async (
    identity,
    org,
    username,
    channelName,
    contractName,
    functionName,
    arguments,
  ) => {
    try {
      // load the network configuration
      const ccpPath = path.resolve(
        __dirname,
        'connection',
        `connection-${org}.json`,
      );
      let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

      // Create a new file system based wallet for managing identities.
      const wallet = await Wallets.newCouchDBWallet(
        CouchDBWalletConfig.url,
        org.toLowerCase(),
      );
      await wallet.put(username, identity);
      logger.info(
        'Identity Temporarily Stored in CouchDB Wallet for transaction',
      );
      // Check to see if we've already enrolled the user.
      if (!identity) {
        logger.info(
          'An identity for the user',
          username,
          'does not exist in the wallet',
        );
        logger.info('Run the registerUser.js application before retrying');
        throw 'An identity for the user does not exist in the wallet';
      }

      // Create a new gateway for connecting to our peer node.
      const gateway = new Gateway();
      await gateway.connect(ccp, {
        wallet,
        identity: username,
        discovery: { enabled: true, asLocalhost: process.env.asLocalhost },
      });

      // Get the network (channel) our contract is deployed to.
      const network = await gateway.getNetwork(channelName);

      // Get the contract from the network.
      const contract = network.getContract(contractName);

      // // Submit the specified transaction.
      // let data = await contract.submitTransaction(functionName, ...arrayOfArgs);

      const documentJSONObject = {
        DocumentNumber: arguments[0],
        DocumentObject: arguments[1],
        Thumbnails: arguments[2],
        Public: arguments[3],
      };

      var transientInput = {
        document: buffer.from(JSON.stringify(documentJSONObject)),
      };

      const result = await contract
        .createTransaction(functionName)
        .setTransient(transientInput)
        .submit('[]');

      // Disconnect from the gateway.
      await gateway.disconnect();
      await wallet.remove(username);
      logger.info('Temporary Identity Removed From CouchDB Wallet');
      logger.info(
        `User : ${username}, successfully submitted transaction on the blockchain.`,
      );

      return result;
    } catch (error) {
      logger.error(`Failed to submit transaction: ${error}`);
      return error;
    }
  },

  createDocument: async (
    identity,
    org,
    username,
    channelName,
    contractName,
    functionName,
    arguments,
  ) => {
    logger.info('Inside createDocument SDK');
    try {
      // load the network configuration
      const ccpPath = path.resolve(
        __dirname,
        'connection',
        `connection-${org}.json`,
      );
      let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

      // Create a new file system based wallet for managing identities.
      const wallet = await Wallets.newCouchDBWallet(
        CouchDBWalletConfig.url,
        org.toLowerCase(),
      );
      await wallet.put(username, identity);
      logger.info(
        'Identity Temporarily Stored in CouchDB Wallet for transaction',
      );
      // Check to see if we've already enrolled the user.
      if (!identity) {
        logger.info(
          'An identity for the user',
          username,
          'does not exist in the wallet',
        );
        logger.info('Run the registerUser.js application before retrying');
        throw 'An identity for the user does not exist in the wallet';
      }

      // Create a new gateway for connecting to our peer node.
      const gateway = new Gateway();
      await gateway.connect(ccp, {
        wallet,
        identity: username,
        discovery: { enabled: true, asLocalhost: process.env.asLocalhost },
      });

      // Get the network (channel) our contract is deployed to.
      const network = await gateway.getNetwork(channelName);

      // Get the contract from the network.
      const contract = network.getContract(contractName);

      const documentJSONObject = {
        DocumentNumber: arguments[0],
        DocumentObject: arguments[1],
        DocumentName: arguments[2],
        DocumentCategory: arguments[3],
        ParentDocumentID: arguments[4],
        ChildDocumentID: arguments[5],
        DocumentStatus: arguments[6],
        IssuedBy: arguments[7],
        OwnedBy: arguments[8],
        Version: arguments[9],
        DateCreated: arguments[10],
        DateUpdated: arguments[11],
        Thumbnails: arguments[12],
        Public: arguments[13],
      };

      var transientInput = {
        document: buffer.from(JSON.stringify(documentJSONObject)),
      };

      const result = await contract
        .createTransaction(functionName)
        .setTransient(transientInput)
        .submit('[]');

      // Disconnect from the gateway.
      await gateway.disconnect();
      await wallet.remove(username);
      logger.info('Temporary Identity Removed From CouchDB Wallet');
      logger.info(
        `User : ${username}, successfully submitted transaction on the blockchain.`,
      );

      return result;
    } catch (error) {
      logger.error(`Failed to submit transaction: ${error}`);
      return error;
    }
  },
  deleteDocument: async (
    identity,
    org,
    username,
    channelName,
    contractName,
    functionName,
    documentNumber,
  ) => {
    try {
      // load the network configuration
      const ccpPath = path.resolve(
        __dirname,
        'connection',
        `connection-${org}.json`,
      );
      let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

      // Create a new file system based wallet for managing identities.
      const wallet = await Wallets.newCouchDBWallet(
        CouchDBWalletConfig.url,
        org.toLowerCase(),
      );
      await wallet.put(username, identity);
      logger.info(
        'Identity Temporarily Stored in CouchDB Wallet for transaction',
      );
      // Check to see if we've already enrolled the user.
      if (!identity) {
        logger.info(
          'An identity for the user',
          username,
          'does not exist in the wallet',
        );
        logger.info('Run the registerUser.js application before retrying');
        throw 'An identity for the user does not exist in the wallet';
      }

      // Create a new gateway for connecting to our peer node.
      const gateway = new Gateway();
      await gateway.connect(ccp, {
        wallet,
        identity: username,
        discovery: { enabled: true, asLocalhost: process.env.asLocalhost },
      });

      // Get the network (channel) our contract is deployed to.
      const network = await gateway.getNetwork(channelName);

      // Get the contract from the network.
      const contract = network.getContract(contractName);

      // // Submit the specified transaction.
      // let data = await contract.submitTransaction(functionName, ...arrayOfArgs);

      const documentJSONObject = { documentNumber };
      var transientInput = {
        document_delete: buffer.from(JSON.stringify(documentJSONObject)),
      };

      const result = await contract
        .createTransaction(functionName)
        .setTransient(transientInput)
        .submit('[]');

      // Disconnect from the gateway.
      await gateway.disconnect();
      await wallet.remove(username);
      logger.info('Temporary Identity Removed From CouchDB Wallet');
      logger.info(
        `User : ${username}, successfully submitted transaction on the blockchain.`,
      );

      return result;
    } catch (error) {
      logger.error(`Failed to submit transaction: ${error}`);
      return error;
    }
  },

  accessControl: async (
    identity,
    org,
    username,
    channelName,
    contractName,
    functionName,
    arguments,
  ) => {
    try {
      // load the network configuration
      const ccpPath = path.resolve(
        __dirname,
        'connection',
        `connection-${org}.json`,
      );
      let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

      // Create a new file system based wallet for managing identities.
      const wallet = await Wallets.newCouchDBWallet(
        CouchDBWalletConfig.url,
        org.toLowerCase(),
      );
      await wallet.put(username, identity);
      logger.info(
        'Identity Temporarily Stored in CouchDB Wallet for transaction',
      );
      const arrayOfArgs = Object.values(arguments);
      // Check to see if we've already enrolled the user.
      if (!identity) {
        logger.info(
          'An identity for the user',
          username,
          'does not exist in the wallet',
        );
        logger.info('Run the registerUser.js application before retrying');
        throw 'An identity for the user does not exist in the wallet';
      }

      // Create a new gateway for connecting to our peer node.
      const gateway = new Gateway();
      await gateway.connect(ccp, {
        wallet,
        identity: username,
        discovery: { enabled: true, asLocalhost: process.env.asLocalhost },
      });

      // Get the network (channel) our contract is deployed to.
      const network = await gateway.getNetwork(channelName);

      // Get the contract from the network.
      const contract = network.getContract(contractName);

      // // Submit the specified transaction.
      const result = await contract.submitTransaction(
        functionName,
        ...arrayOfArgs,
      );

      //const result = await contract.submitTransaction(functionName, arguments[0], arguments[1])

      // Disconnect from the gateway.
      await gateway.disconnect();
      await wallet.remove(username);
      logger.info('Temporary Identity Removed From CouchDB Wallet');
      logger.info(
        `User : ${username}, successfully submitted transaction on the blockchain.`,
      );

      return result;
    } catch (error) {
      logger.error(`Failed to submit transaction: ${error}`);
      return error;
    }
  },

  invokeFunction: async (
    identity,
    org,
    username,
    channelName,
    contractName,
    functionName,
    arguments,
  ) => {
    try {
      // load the network configuration
      const ccpPath = path.resolve(
        __dirname,
        'connection',
        `connection-${org}.json`,
      );
      let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

      // Create a new file system based wallet for managing identities.
      const wallet = await Wallets.newCouchDBWallet(
        CouchDBWalletConfig.url,
        org.toLowerCase(),
      );
      await wallet.put(username, identity);
      logger.info(
        'Identity Temporarily Stored in CouchDB Wallet for transaction',
      );
      const arrayOfArgs = Object.values(arguments);
      // Check to see if we've already enrolled the user.
      if (!identity) {
        logger.info(
          'An identity for the user',
          username,
          'does not exist in the wallet',
        );
        logger.info('Run the registerUser.js application before retrying');
        throw 'An identity for the user does not exist in the wallet';
      }

      // Create a new gateway for connecting to our peer node.
      const gateway = new Gateway();
      await gateway.connect(ccp, {
        wallet,
        identity: username,
        discovery: { enabled: true, asLocalhost: process.env.asLocalhost },
      });

      // Get the network (channel) our contract is deployed to.
      const network = await gateway.getNetwork(channelName);

      // Get the contract from the network.
      const contract = network.getContract(contractName);

      // // Submit the specified transaction.
      const result = await contract.submitTransaction(
        functionName,
        ...arrayOfArgs,
      );

      //const result = await contract.submitTransaction(functionName, arguments[0], arguments[1])

      // Disconnect from the gateway.
      await gateway.disconnect();
      await wallet.remove(username);
      logger.info('Temporary Identity Removed From CouchDB Wallet');
      logger.info(
        `User : ${username}, successfully submitted transaction on the blockchain.`,
      );

      return result;
    } catch (error) {
      logger.error(`Failed to submit transaction: ${error}`);
      return error;
    }
  },
  createAcceptanceDocument: async (
    identity,
    org,
    username,
    channelName,
    contractName,
    functionName,
    arguments,
  ) => {
    logger.info('Inside createDocument SDK');
    try {
      // load the network configuration
      const ccpPath = path.resolve(
        __dirname,
        'connection',
        `connection-${org}.json`,
      );
      let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

      // Create a new file system based wallet for managing identities.
      const wallet = await Wallets.newCouchDBWallet(
        CouchDBWalletConfig.url,
        org.toLowerCase(),
      );
      await wallet.put(username, identity);
      logger.info(
        'Identity Temporarily Stored in CouchDB Wallet for transaction',
      );
      // Check to see if we've already enrolled the user.
      if (!identity) {
        logger.info(
          'An identity for the user',
          username,
          'does not exist in the wallet',
        );
        logger.info('Run the registerUser.js application before retrying');
        throw 'An identity for the user does not exist in the wallet';
      }

      // Create a new gateway for connecting to our peer node.
      const gateway = new Gateway();
      await gateway.connect(ccp, {
        wallet,
        identity: username,
        discovery: { enabled: true, asLocalhost: process.env.asLocalhost },
      });

      // Get the network (channel) our contract is deployed to.
      const network = await gateway.getNetwork(channelName);

      // Get the contract from the network.
      const contract = network.getContract(contractName);

      const documentJSONObject = {
        AcceptanceDocumentNumber: arguments[0],
        DocumentNumber: arguments[1],
        DocumentMetadata: arguments[2],
        DocumentTemplate: arguments[3],
        IssuedBy: arguments[4],
        OwnedBy: arguments[5],
        Version: arguments[6],
        DateCreated: arguments[7],
      };

      var transientInput = {
        document: buffer.from(JSON.stringify(documentJSONObject)),
      };

      const result = await contract
        .createTransaction(functionName)
        .setTransient(transientInput)
        .submit('[]');

      // Disconnect from the gateway.
      await gateway.disconnect();
      await wallet.remove(username);
      logger.info('Temporary Identity Removed From CouchDB Wallet');
      logger.info(
        `User : ${username}, successfully submitted transaction on the blockchain.`,
      );

      return result;
    } catch (error) {
      logger.error(`Failed to submit transaction: ${error}`);
      return error;
    }
  },
};

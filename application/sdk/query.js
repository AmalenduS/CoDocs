/* eslint-disable security/detect-non-literal-fs-filename */
/* eslint-disable no-console */
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const logger = require('../config/logger');
const { CouchDBWalletConfig } = require('../config/couchConfig');

module.exports = {

  queryPublic: async (org, username, channelName, contractName, functionName, uniqueId) => {
    try {
      // load the network configuration
      // Change the folder name to live/staging to connect the SDK to respective Server
      const ccpPath = path.resolve(__dirname, 'connection', `connection-${org}.json`);
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
  
      // Create a new file system based wallet for managing identities.
      const walletPath = path.join(process.cwd(), 'wallet');
      const wallet = await Wallets.newFileSystemWallet(walletPath);
      console.log(`Wallet path: ${walletPath}`);
  
      // Check to see if we've already enrolled the user.
      const identity = await wallet.get(username);
      if (!identity) {
      //   logger.info('An identity for the user ',username,' does not exist in the wallet');
      //   logger.info('Run the registerUser.js application before retrying');
        throw `An identity for the user: ${username}, does not exist in the wallet`;
      }
  
      // Create a new gateway for connecting to our peer node.
      const gateway = new Gateway();
      await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: true, asLocalhost: process.env.asLocalhost } });
  
      // Get the network (channel) our contract is deployed to.
      const network = await gateway.getNetwork(channelName);
  
      // Get the contract from the network.
      const contract = network.getContract(contractName);
  
      /* -----------------QueryWallet Details
              await contract.evaluateTransaction('QueryWalletData','UniqueId')
      */
      const result = await contract.evaluateTransaction(functionName, uniqueId);
      //logger.info(`Transaction has been evaluated, result is: ${result.toString()}`);
      return result.toString();
    } catch (error) {
      logger.error(`Failed to evaluate transaction: ${error}`);
      throw error;
    }
  },

  queryDetails: async (identity, org, username, channelName, contractName, functionName, uniqueId) => {
    logger.info('Inside Query Details SDK');
    try {
      // load the network configuration
      const ccpPath = path.resolve(__dirname, 'connection', `connection-${org}.json`);
      const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

      // Create a new file system based wallet for managing identities.
      const wallet = await Wallets.newCouchDBWallet(CouchDBWalletConfig.url, org.toLowerCase());
      await wallet.put(username, identity);
      // Check to see if we've already enrolled the user.
      if (!identity) {
        logger.info('An identity for the user "appUser" does not exist in the wallet');
        logger.info('Run the registerUser.js application before retrying');
        throw `An identity for the user: ${username}, does not exist in the wallet`;
      }

      // Create a new gateway for connecting to our peer node.
      const gateway = new Gateway();
      await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: true, asLocalhost: process.env.asLocalhost } });

      // Get the network (channel) our contract is deployed to.
      const network = await gateway.getNetwork(channelName);

      // Get the contract from the network.
      const contract = network.getContract(contractName);

      // Evaluate the specified transaction.
      const result = await contract.evaluateTransaction(functionName, uniqueId);
      await wallet.remove(username);
      // logger.info(`Transaction has been evaluated, result is: ${result.toString()}`);
      return result.toString();
    } catch (error) {
      logger.error(`Failed to evaluate transaction: ${error}`);
      throw error;
    }
  },

  getDocumentsFromMangoQuery : async (identity, org, username, channelName, contractName, functionName, arguments) => {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, 'connection', `connection-${org}.json`);
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const wallet = await Wallets.newCouchDBWallet(CouchDBWalletConfig.url, org.toLowerCase());
        await wallet.put(username, identity);
        logger.info('Identity Temporarily Stored in CouchDB Wallet for transaction');
        const arrayOfArgs = Object.values(arguments);
        // Check to see if we've already enrolled the user.
        if (!identity) {
            logger.info('An identity for the user', username, 'does not exist in the wallet');
            logger.info('Run the registerUser.js application before retrying');
            throw 'An identity for the user does not exist in the wallet';
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: true, asLocalhost: process.env.asLocalhost } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(channelName);
        // Get the contract from the network.
        const contract = network.getContract(contractName);
        // // Submit the specified transaction.
        const result = await contract.evaluateTransaction(functionName, ...arrayOfArgs);
  
        //const result = await contract.submitTransaction(functionName, arguments[0], arguments[1])

        // Disconnect from the gateway.
        await gateway.disconnect();
        await wallet.remove(username);
        logger.info('Temporary Identity Removed From CouchDB Wallet');
        logger.info(`User : ${username}, successfully submitted transaction on the blockchain.`);

        return result

    } catch (error) {
        logger.error(`Failed to submit transaction: ${error}`);
        return error;
    } 
  },
}

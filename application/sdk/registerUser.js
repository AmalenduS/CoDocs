const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');
const { Wallets } = require('fabric-network');
// eslint-disable-next-line node/no-unpublished-require
const logger = require('../config/logger');
// eslint-disable-next-line node/no-unpublished-require
const { CouchDBWalletConfig } = require('../config/couchConfig');


logger.info('1st run');

module.exports.registerUser = async (org, username) => {
	logger.info('module');
  try {
    // Change the folder name to live/staging to connect the SDK to respective Server
    const ccpPath = path.resolve(__dirname, 'connection', `connection-${org}.json`);
	  logger.info('ccpPath');

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // Create a new CA client for interacting with the CA.
    const caURL = ccp.certificateAuthorities[`ca.${org}.codocs.com`].url;
    const ca = new FabricCAServices(caURL);

logger.info('2nd run');

	  
    // Couchdb wallet
    const wallet = await Wallets.newCouchDBWallet(CouchDBWalletConfig.url, org.toLowerCase());
    console.log(`Wallet path: ${wallet}`);


    // Check to see if we've already enrolled the user.
    const userIdentity = await wallet.get(username);
    console.log("userIdentity =>", userIdentity)
    if (userIdentity) {
      logger.info('An identity for the user ', username, ' already exists in the wallet');
      return `An identity for the user: ${username}, already exists in hyperledger.`;
    }
    logger.info('continue if user already exists.');
    // Check to see if we've already enrolled the admin user.
	
	  logger.info('3rd run');

	
    
    const adminIdentity = await wallet.get('admin');
    if (!adminIdentity) {
    //   logger.info('An identity for the admin user "admin" does not exist in the wallet');
    //   logger.info('Run the enrollAdmin.js before retrying');
      throw 'An identity for the admin user "admin" does not exist in the wallet';
    }

    // build a user object for authenticating with the CA
    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, 'admin');

    // Register the user, enroll the user, and import the new identity into the wallet.
    const secret = await ca.register({
      affiliation: 'org1.department1',
      enrollmentID: username,
      role: 'client',
    }, adminUser);
    const enrollment = await ca.enroll({
      enrollmentID: username,
      enrollmentSecret: secret,
    });
    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: `${org}MSP`,
      type: 'X.509',
    };
    logger.info('Successfully registered and enrolled admin user ', username, ' and imported it into the wallet');
    return {username, x509Identity};
  } catch (error) {
    throw error;
  }
};

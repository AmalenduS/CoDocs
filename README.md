CODOCS

This repository contains following subrepositories

    application
    ca-network
    chaincode
    explorer
    fabric-network

Note: This README presumes that you have installed all the prerequisites of Hyperledger Fabric.
Before starting the network make sure you run the following commands

docker volume prune
docker network prune
docker system prune

These commands will clear all the unnecessary volumes & networks which is present in your docker cache.
Step by Step Guide

Follow the step by step guide to start the network and set up the node server
CA-NETWORK

Go to the ca-network directory and follow the commands:

cd ca-network

sudo ./clean.sh

This command will delete all the previously created certificates.

./network.sh

This command will start the Certificate Authority containers of admin, provier, patient and Orderer organizations and start generating the certificates of the above mentioned organizations.

Now, we are done with the CA containers. go back to one directory.

cd ..

FABRIC-NETWORK

Go to the fabric-network directory and follow the commands:

cd network

sudo rm -rf crypto-config/*

This command will delete all the previously generated certificates.

sudo cp -rvf ../ca-network/organizations/* crypto-config/

This command will copy everything from the ca-network's organizations directory to crypto-config.

./artifact.sh

This command will generate all the channel related artifacts for the CODOCS Network.

docker-compose -f docker-compose-cli.yaml -f docker-compose-etcdraft2.yaml -f docker-compose-couchdb.yaml up -d

This command will start all the peers, orderers and couchdb containers for the network.

Now, we are done with the network stuff. Go back to one directory.

cd ..

Before entering into Application directory, Execute the following commands.

cp network/crypto-config/peerOrganizations/admin.codocs.com/connection-admin.json application/sdk/connection/
cp network/crypto-config/peerOrganizations/provider.codocs.com/connection-provider.json application/sdk/connection/
cp network/crypto-config/peerOrganizations/patient.codocs.com/connection-patient.json application/sdk/connection/

This command will copy all organization's json file into the connection directory.
APPLICATION

Go to the Application directory and follow th steps.

cd application

In the application directory create one file with name .env. This file will contain all the environment values which could be used in entire project. Paste the following values in your .env file.

CODOCS_COUCHDB_WALLET_URL=http://admin:adminpw@127.0.0.1:9984
CODOCS_MONGO_URL=mongodb://127.0.0.1:27017/codocs

Now, we need to add all the containers IP & Domain name into our host file. If you are using Ubuntu then,

sudo vim /etc/hosts/
press i

127.0.0.1 peer0.admin.codocs.com
127.0.0.1 peer0.provider.codocs.com
127.0.0.1 peer0.patient.codocs.com
127.0.0.1 peer1.admin.codocs.com
127.0.0.1 peer1.provider.codocs.com
127.0.0.1 peer1.patient.codocs.com
127.0.0.1 orderer.codocs.com
127.0.0.1 orderer2.codocs.com
127.0.0.1 orderer3.codocs.com
127.0.0.1 orderer4.codocs.com
127.0.0.1 orderer5.codocs.com
127.0.0.1 ca.admin.codocs.com
127.0.0.1 ca.provider.codocs.com
127.0.0.1 ca.patient.codocs.com
127.0.0.1 ca_admin
127.0.0.1 ca_provider
127.0.0.1 ca_patient
127.0.0.1 ca_orderer

press esc,
then press :wq!

If you are using Windows then,

1. press the windows key.
2. Type Notepad in the search field.
3. In the search results, right-click Notepad and select Run as administrator.
4. From Notepad, open the following file:
    c:\Windows\System32\Drivers\etc\hosts
5. Make the necessary changes to the file.
    In this step, you need to copy all the domains & IP which I just mentioned in the above step.
6. Save the file & Exit.

Now, go back to the application folder

cd application

then, execute the following commands

npm install
npm start

These commands will install all the dependencies & devdependencies which is mentioned in package.json file and second command will start the node server on port 3000.

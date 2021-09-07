#!/bin/bash
export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=${PWD}/configtx
export VERBOSE=false

if [ -d "organizations/peerOrganizations" ]; then
  rm -Rf organizations/peerOrganizations && rm -Rf organizations/ordererOrganizations
fi

echo
echo "##########################################################"
echo "##### Generate certificates using Fabric CA's ############"
echo "##########################################################"

docker-compose -f docker-compose-ca.yaml up -d

export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/patient.codocs.com/

. organizations/fabric-ca/registerEnroll.sh

sleep 10

echo "##########################################################"
echo "############ Create Patient Identities ######################"
echo "##########################################################"

createpatient

echo "##########################################################"
echo "############ Create Provider Identities ######################"
echo "##########################################################"

createprovider

echo "##########################################################"
echo "############ Create Admin Identities ######################"
echo "##########################################################"

createadmin

echo "##########################################################"
echo "############ Create Orderer Org Identities ###############"
echo "##########################################################"

createOrderer

echo
echo "Generate CCP files for patient, provider and admin"
./organizations/ccp-generate.sh

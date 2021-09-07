#!/bin/bash

export CORE_PEER_LOCALMSPID=patientMSP
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/patient.codocs.com/peers/peer0.patient.codocs.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/patient.codocs.com/users/Admin@patient.codocs.com/msp
export CORE_PEER_ADDRESS=peer0.patient.codocs.com:7051
export ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/codocs.com/orderers/orderer.codocs.com/msp/tlscacerts/tlsca.codocs.com-cert.pem

peer channel create -f channel-artifacts/codocschannel.tx -c codocschannel -o orderer.codocs.com:7050 --tls --cafile $ORDERER_CA
peer channel join -b codocschannel.block
peer channel update -o orderer.codocs.com:7050 -c codocschannel -f channel-artifacts/patientAnchor.tx --tls --cafile $ORDERER_CA

export CORE_PEER_LOCALMSPID=providerMSP
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/provider.codocs.com/peers/peer0.provider.codocs.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/provider.codocs.com/users/Admin@provider.codocs.com/msp
export CORE_PEER_ADDRESS=peer0.provider.codocs.com:9051
export ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/codocs.com/orderers/orderer.codocs.com/msp/tlscacerts/tlsca.codocs.com-cert.pem

peer channel join -b codocschannel.block
peer channel update -o orderer.codocs.com:7050 -c codocschannel -f channel-artifacts/providerAnchor.tx --tls --cafile $ORDERER_CA

export CORE_PEER_LOCALMSPID=adminMSP
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/admin.codocs.com/peers/peer0.admin.codocs.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/admin.codocs.com/users/Admin@admin.codocs.com/msp
export CORE_PEER_ADDRESS=peer0.admin.codocs.com:11051
export ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/codocs.com/orderers/orderer.codocs.com/msp/tlscacerts/tlsca.codocs.com-cert.pem

peer channel join -b codocschannel.block
peer channel update -o orderer.codocs.com:7050 -c codocschannel -f channel-artifacts/adminAnchor.tx --tls --cafile $ORDERER_CA

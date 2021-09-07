peer lifecycle chaincode package wallet.tar.gz --path github.com/hyperledger/fabric-samples/chaincode/wallet --lang golang --label $1

export CORE_PEER_LOCALMSPID=patientMSP
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/patient.codocs.com/peers/peer0.patient.codocs.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/patient.codocs.com/users/Admin@patient.codocs.com/msp
export CORE_PEER_ADDRESS=peer0.patient.codocs.com:7051
export ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/codocs.com/orderers/orderer.codocs.com/msp/tlscacerts/tlsca.codocs.com-cert.pem

peer lifecycle chaincode install wallet.tar.gz
export CCID=$(peer lifecycle chaincode queryinstalled | cut -d ' ' -f 3 | sed s/.$// | grep $1)
peer lifecycle chaincode approveformyorg --package-id $CCID --channelID codocschannel --name wallet --version 1 --sequence $2 --waitForEvent --tls --cafile $ORDERER_CA
peer lifecycle chaincode checkcommitreadiness --channelID codocschannel --name wallet --version 1  --sequence $2 --tls --cafile $ORDERER_CA

export CORE_PEER_LOCALMSPID=providerMSP
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/provider.codocs.com/peers/peer0.provider.codocs.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/provider.codocs.com/users/Admin@provider.codocs.com/msp
export CORE_PEER_ADDRESS=peer0.provider.codocs.com:9051
export ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/codocs.com/orderers/orderer.codocs.com/msp/tlscacerts/tlsca.codocs.com-cert.pem

peer lifecycle chaincode install wallet.tar.gz
export CCID=$(peer lifecycle chaincode queryinstalled | cut -d ' ' -f 3 | sed s/.$// | grep $1)
peer lifecycle chaincode approveformyorg --package-id $CCID --channelID codocschannel --name wallet --version 1 --sequence $2 --waitForEvent --tls --cafile $ORDERER_CA
peer lifecycle chaincode checkcommitreadiness --channelID codocschannel --name wallet --version 1  --sequence $2 --tls --cafile $ORDERER_CA

export CORE_PEER_LOCALMSPID=adminMSP
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/admin.codocs.com/peers/peer0.admin.codocs.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/admin.codocs.com/users/Admin@admin.codocs.com/msp
export CORE_PEER_ADDRESS=peer0.admin.codocs.com:9051
export ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/codocs.com/orderers/orderer.codocs.com/msp/tlscacerts/tlsca.codocs.com-cert.pem

peer lifecycle chaincode install wallet.tar.gz
export CCID=$(peer lifecycle chaincode queryinstalled | cut -d ' ' -f 3 | sed s/.$// | grep $1)
peer lifecycle chaincode approveformyorg --package-id $CCID --channelID codocschannel --name wallet --version 1 --sequence $2 --waitForEvent --tls --cafile $ORDERER_CA
peer lifecycle chaincode checkcommitreadiness --channelID codocschannel --name wallet --version 1  --sequence $2 --tls --cafile $ORDERER_CA

export CORE_PEER_LOCALMSPID=patientMSP
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/patient.codocs.com/peers/peer0.patient.codocs.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/patient.codocs.com/users/Admin@patient.codocs.com/msp
export CORE_PEER_ADDRESS=peer0.patient.codocs.com:7051
export ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/codocs.com/orderers/orderer.codocs.com/msp/tlscacerts/tlsca.codocs.com-cert.pem

peer lifecycle chaincode commit -o orderer.codocs.com:7050 --channelID codocschannel --name wallet --version 1 --sequence $2 --tls true --cafile $ORDERER_CA --peerAddresses peer0.patient.codocs.com:7051 --peerAddresses peer0.provider.codocs.com:9051  --tlsRootCertFiles ./crypto/peerOrganizations/patient.codocs.com/peers/peer0.patient.codocs.com/tls/ca.crt --tlsRootCertFiles ./crypto/peerOrganizations/provider.codocs.com/peers/peer0.provider.codocs.com/tls/ca.crt

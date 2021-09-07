#!/bin/bash
rm -rf channel-artifacts/*
export FABRIC_CFG_PATH=$PWD
configtxgen -outputBlock channel-artifacts/genesis.block -channelID ordererchannel -profile OrdererChannel
configtxgen -outputCreateChannelTx channel-artifacts/codocschannel.tx -channelID codocschannel -profile codocschannel
configtxgen --outputAnchorPeersUpdate channel-artifacts/patientAnchor.tx -channelID codocschannel -profile codocschannel -asOrg patientMSP
configtxgen --outputAnchorPeersUpdate channel-artifacts/providerAnchor.tx -channelID codocschannel -profile codocschannel -asOrg providerMSP
configtxgen --outputAnchorPeersUpdate channel-artifacts/adminAnchor.tx -channelID codocschannel -profile codocschannel -asOrg adminMSP

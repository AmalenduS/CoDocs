#!/bin/bash

function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function json_ccp {
    local PP=$(one_line_pem $5)
    local CP=$(one_line_pem $6)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${P1PORT}/$3/" \
        -e "s/\${CAPORT}/$4/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        organizations/ccp-template.json
}

ORG=patient
P0PORT=7051
P1PORT=8051
CAPORT=7054
PEERPEM=organizations/peerOrganizations/patient.codocs.com/tlsca/tlsca.codocs.com-cert.pem
CAPEM=organizations/peerOrganizations/patient.codocs.com/ca/ca.codocs.com-cert.pem

echo "$(json_ccp $ORG $P0PORT $P1PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/patient.codocs.com/connection-patient.json

echo "Generated CCP files for patient"

ORG=provider
P0PORT=9051
P1PORT=10051
CAPORT=8054
PEERPEM=organizations/peerOrganizations/provider.codocs.com/tlsca/tlsca.provider.codocs.com-cert.pem
CAPEM=organizations/peerOrganizations/provider.codocs.com/ca/ca.provider.codocs.com-cert.pem

echo "$(json_ccp $ORG $P0PORT $P1PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/provider.codocs.com/connection-provider.json

echo "Generated CCP files for provider"

ORG=admin
P0PORT=11051
P1PORT=12051
CAPORT=9054
PEERPEM=organizations/peerOrganizations/admin.codocs.com/tlsca/tlsca.codocs.com-cert.pem
CAPEM=organizations/peerOrganizations/admin.codocs.com/ca/ca.codocs.com-cert.pem

echo "$(json_ccp $ORG $P0PORT $P1PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/admin.codocs.com/connection-admin.json

echo "Generated CCP files for admin"

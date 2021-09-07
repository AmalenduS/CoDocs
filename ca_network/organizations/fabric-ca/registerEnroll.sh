
function createpatient {

  echo
	echo "Enroll the CA admin"
  echo
	mkdir -p organizations/peerOrganizations/patient.codocs.com/

	export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/patient.codocs.com/

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:7054 --caname ca-patient --tls.certfiles ${PWD}/organizations/fabric-ca/patient/tls-cert.pem
  set +x

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-patient.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-patient.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-patient.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-patient.pem
    OrganizationalUnitIdentifier: orderer' > ${PWD}/organizations/peerOrganizations/patient.codocs.com/msp/config.yaml

  echo
	echo "Register peer0"
  echo
  set -x
	fabric-ca-client register --caname ca-patient --id.name peer0 --id.secret peer0pw --id.type peer --id.attrs '"hf.Registrar.Roles=peer"' --tls.certfiles ${PWD}/organizations/fabric-ca/patient/tls-cert.pem
  set +x

  echo
	echo "Register peer1"
  echo
  set -x
	fabric-ca-client register --caname ca-patient --id.name peer1 --id.secret peer1pw --id.type peer --id.attrs '"hf.Registrar.Roles=peer"' --tls.certfiles ${PWD}/organizations/fabric-ca/patient/tls-cert.pem
  set +x

  echo
  echo "Register user"
  echo
  set -x
  fabric-ca-client register --caname ca-patient --id.name user1 --id.secret user1pw --id.type client --id.attrs '"hf.Registrar.Roles=client"' --tls.certfiles ${PWD}/organizations/fabric-ca/patient/tls-cert.pem
  set +x

  echo
  echo "Register the org admin"
  echo
  set -x
  fabric-ca-client register --caname ca-patient --id.name patientadmin --id.secret patientadminpw --id.type admin --id.attrs '"hf.Registrar.Roles=admin"' --tls.certfiles ${PWD}/organizations/fabric-ca/patient/tls-cert.pem
  set +x

	mkdir -p organizations/peerOrganizations/patient.codocs.com/peers
  mkdir -p organizations/peerOrganizations/patient.codocs.com/peers/peer0.patient.codocs.com
  mkdir -p organizations/peerOrganizations/patient.codocs.com/peers/peer1.patient.codocs.com

  echo
  echo "## Generate the peer0 msp"
  echo
  set -x
	fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7054 --caname ca-patient -M ${PWD}/organizations/peerOrganizations/patient.codocs.com/peers/peer0.patient.codocs.com/msp --csr.hosts peer0.patient.codocs.com --tls.certfiles ${PWD}/organizations/fabric-ca/patient/tls-cert.pem
  set +x

  cp ${PWD}/organizations/peerOrganizations/patient.codocs.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/patient.codocs.com/peers/peer0.patient.codocs.com/msp/config.yaml

  echo
  echo "## Generate the peer1 msp"
  echo
  set -x
	fabric-ca-client enroll -u https://peer1:peer1pw@localhost:7054 --caname ca-patient -M ${PWD}/organizations/peerOrganizations/patient.codocs.com/peers/peer1.patient.codocs.com/msp --csr.hosts peer1.patient.codocs.com --tls.certfiles ${PWD}/organizations/fabric-ca/patient/tls-cert.pem
  set +x

  cp ${PWD}/organizations/peerOrganizations/patient.codocs.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/patient.codocs.com/peers/peer1.patient.codocs.com/msp/config.yaml

  echo
  echo "## Generate the peer0-tls certificates"
  echo
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7054 --caname ca-patient -M ${PWD}/organizations/peerOrganizations/patient.codocs.com/peers/peer0.patient.codocs.com/tls --enrollment.profile tls --csr.hosts peer0.patient.codocs.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/patient/tls-cert.pem
  set +x


  cp ${PWD}/organizations/peerOrganizations/patient.codocs.com/peers/peer0.patient.codocs.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/patient.codocs.com/peers/peer0.patient.codocs.com/tls/ca.crt
  cp ${PWD}/organizations/peerOrganizations/patient.codocs.com/peers/peer0.patient.codocs.com/tls/signcerts/* ${PWD}/organizations/peerOrganizations/patient.codocs.com/peers/peer0.patient.codocs.com/tls/server.crt
  cp ${PWD}/organizations/peerOrganizations/patient.codocs.com/peers/peer0.patient.codocs.com/tls/keystore/* ${PWD}/organizations/peerOrganizations/patient.codocs.com/peers/peer0.patient.codocs.com/tls/server.key

  mkdir ${PWD}/organizations/peerOrganizations/patient.codocs.com/msp/tlscacerts
  cp ${PWD}/organizations/peerOrganizations/patient.codocs.com/peers/peer0.patient.codocs.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/patient.codocs.com/msp/tlscacerts/ca.crt

  mkdir ${PWD}/organizations/peerOrganizations/patient.codocs.com/tlsca
  cp ${PWD}/organizations/peerOrganizations/patient.codocs.com/peers/peer0.patient.codocs.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/patient.codocs.com/tlsca/tlsca.codocs.com-cert.pem

  mkdir ${PWD}/organizations/peerOrganizations/patient.codocs.com/ca
  cp ${PWD}/organizations/peerOrganizations/patient.codocs.com/peers/peer0.patient.codocs.com/msp/cacerts/* ${PWD}/organizations/peerOrganizations/patient.codocs.com/ca/ca.codocs.com-cert.pem

  echo
  echo "## Generate the peer1-tls certificates"
  echo
  set -x
  fabric-ca-client enroll -u https://peer1:peer1pw@localhost:7054 --caname ca-patient -M ${PWD}/organizations/peerOrganizations/patient.codocs.com/peers/peer1.patient.codocs.com/tls --enrollment.profile tls --csr.hosts peer1.patient.codocs.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/patient/tls-cert.pem
  set +x


  cp ${PWD}/organizations/peerOrganizations/patient.codocs.com/peers/peer1.patient.codocs.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/patient.codocs.com/peers/peer1.patient.codocs.com/tls/ca.crt
  cp ${PWD}/organizations/peerOrganizations/patient.codocs.com/peers/peer1.patient.codocs.com/tls/signcerts/* ${PWD}/organizations/peerOrganizations/patient.codocs.com/peers/peer1.patient.codocs.com/tls/server.crt
  cp ${PWD}/organizations/peerOrganizations/patient.codocs.com/peers/peer1.patient.codocs.com/tls/keystore/* ${PWD}/organizations/peerOrganizations/patient.codocs.com/peers/peer1.patient.codocs.com/tls/server.key

  mkdir -p organizations/peerOrganizations/patient.codocs.com/users
  mkdir -p organizations/peerOrganizations/patient.codocs.com/users/User1@patient.codocs.com

  echo
  echo "## Generate the user msp"
  echo
  set -x
	fabric-ca-client enroll -u https://user1:user1pw@localhost:7054 --caname ca-patient -M ${PWD}/organizations/peerOrganizations/patient.codocs.com/users/User1@patient.codocs.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/patient/tls-cert.pem
  set +x

  mkdir -p organizations/peerOrganizations/patient.codocs.com/users/Admin@patient.codocs.com

  echo
  echo "## Generate the org admin msp"
  echo
  set -x
	fabric-ca-client enroll -u https://patientadmin:patientadminpw@localhost:7054 --caname ca-patient -M ${PWD}/organizations/peerOrganizations/patient.codocs.com/users/Admin@patient.codocs.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/patient/tls-cert.pem
  set +x

  cp ${PWD}/organizations/peerOrganizations/patient.codocs.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/patient.codocs.com/users/Admin@patient.codocs.com/msp/config.yaml

}


function createprovider {

  echo
	echo "Enroll the CA admin"
  echo
	mkdir -p organizations/peerOrganizations/provider.codocs.com/

	export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/provider.codocs.com/
#  rm -rf $FABRIC_CA_CLIENT_HOME/fabric-ca-client-config.yaml
#  rm -rf $FABRIC_CA_CLIENT_HOME/msp

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:8054 --caname ca-provider --tls.certfiles ${PWD}/organizations/fabric-ca/provider/tls-cert.pem
  set +x

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-provider.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-provider.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-provider.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-provider.pem
    OrganizationalUnitIdentifier: orderer' > ${PWD}/organizations/peerOrganizations/provider.codocs.com/msp/config.yaml

  echo
	echo "Register peer0"
  echo
  set -x
	fabric-ca-client register --caname ca-provider --id.name peer0 --id.secret peer0pw --id.type peer --id.attrs '"hf.Registrar.Roles=peer"' --tls.certfiles ${PWD}/organizations/fabric-ca/provider/tls-cert.pem
  set +x

  echo
	echo "Register peer1"
  echo
  set -x
	fabric-ca-client register --caname ca-provider --id.name peer1 --id.secret peer1pw --id.type peer --id.attrs '"hf.Registrar.Roles=peer"' --tls.certfiles ${PWD}/organizations/fabric-ca/provider/tls-cert.pem
  set +x

  echo
  echo "Register user"
  echo
  set -x
  fabric-ca-client register --caname ca-provider --id.name user1 --id.secret user1pw --id.type client --id.attrs '"hf.Registrar.Roles=client"' --tls.certfiles ${PWD}/organizations/fabric-ca/provider/tls-cert.pem
  set +x

  echo
  echo "Register the org admin"
  echo
  set -x
  fabric-ca-client register --caname ca-provider --id.name provideradmin --id.secret provideradminpw --id.type admin --id.attrs '"hf.Registrar.Roles=admin"' --tls.certfiles ${PWD}/organizations/fabric-ca/provider/tls-cert.pem
  set +x

	mkdir -p organizations/peerOrganizations/provider.codocs.com/peers
  mkdir -p organizations/peerOrganizations/provider.codocs.com/peers/peer0.provider.codocs.com
  mkdir -p organizations/peerOrganizations/provider.codocs.com/peers/peer1.provider.codocs.com

  echo
  echo "## Generate the peer0 msp"
  echo
  set -x
	fabric-ca-client enroll -u https://peer0:peer0pw@localhost:8054 --caname ca-provider -M ${PWD}/organizations/peerOrganizations/provider.codocs.com/peers/peer0.provider.codocs.com/msp --csr.hosts peer0.provider.codocs.com --tls.certfiles ${PWD}/organizations/fabric-ca/provider/tls-cert.pem
  set +x

  cp ${PWD}/organizations/peerOrganizations/provider.codocs.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/provider.codocs.com/peers/peer0.provider.codocs.com/msp/config.yaml

  echo
  echo "## Generate the peer1 msp"
  echo
  set -x
	fabric-ca-client enroll -u https://peer1:peer1pw@localhost:8054 --caname ca-provider -M ${PWD}/organizations/peerOrganizations/provider.codocs.com/peers/peer1.provider.codocs.com/msp --csr.hosts peer1.provider.codocs.com --tls.certfiles ${PWD}/organizations/fabric-ca/provider/tls-cert.pem
  set +x

  cp ${PWD}/organizations/peerOrganizations/provider.codocs.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/provider.codocs.com/peers/peer1.provider.codocs.com/msp/config.yaml


  echo
  echo "## Generate the peer0-tls certificates"
  echo
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:8054 --caname ca-provider -M ${PWD}/organizations/peerOrganizations/provider.codocs.com/peers/peer0.provider.codocs.com/tls --enrollment.profile tls --csr.hosts peer0.provider.codocs.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/provider/tls-cert.pem
  set +x


  cp ${PWD}/organizations/peerOrganizations/provider.codocs.com/peers/peer0.provider.codocs.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/provider.codocs.com/peers/peer0.provider.codocs.com/tls/ca.crt
  cp ${PWD}/organizations/peerOrganizations/provider.codocs.com/peers/peer0.provider.codocs.com/tls/signcerts/* ${PWD}/organizations/peerOrganizations/provider.codocs.com/peers/peer0.provider.codocs.com/tls/server.crt
  cp ${PWD}/organizations/peerOrganizations/provider.codocs.com/peers/peer0.provider.codocs.com/tls/keystore/* ${PWD}/organizations/peerOrganizations/provider.codocs.com/peers/peer0.provider.codocs.com/tls/server.key

  mkdir ${PWD}/organizations/peerOrganizations/provider.codocs.com/msp/tlscacerts
  cp ${PWD}/organizations/peerOrganizations/provider.codocs.com/peers/peer0.provider.codocs.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/provider.codocs.com/msp/tlscacerts/ca.crt

  mkdir ${PWD}/organizations/peerOrganizations/provider.codocs.com/tlsca
  cp ${PWD}/organizations/peerOrganizations/provider.codocs.com/peers/peer0.provider.codocs.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/provider.codocs.com/tlsca/tlsca.provider.codocs.com-cert.pem

  mkdir ${PWD}/organizations/peerOrganizations/provider.codocs.com/ca
  cp ${PWD}/organizations/peerOrganizations/provider.codocs.com/peers/peer0.provider.codocs.com/msp/cacerts/* ${PWD}/organizations/peerOrganizations/provider.codocs.com/ca/ca.provider.codocs.com-cert.pem


  echo
  echo "## Generate the peer1-tls certificates"
  echo
  set -x
  fabric-ca-client enroll -u https://peer1:peer1pw@localhost:8054 --caname ca-provider -M ${PWD}/organizations/peerOrganizations/provider.codocs.com/peers/peer1.provider.codocs.com/tls --enrollment.profile tls --csr.hosts peer1.provider.codocs.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/provider/tls-cert.pem
  set +x


  cp ${PWD}/organizations/peerOrganizations/provider.codocs.com/peers/peer1.provider.codocs.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/provider.codocs.com/peers/peer1.provider.codocs.com/tls/ca.crt
  cp ${PWD}/organizations/peerOrganizations/provider.codocs.com/peers/peer1.provider.codocs.com/tls/signcerts/* ${PWD}/organizations/peerOrganizations/provider.codocs.com/peers/peer1.provider.codocs.com/tls/server.crt
  cp ${PWD}/organizations/peerOrganizations/provider.codocs.com/peers/peer1.provider.codocs.com/tls/keystore/* ${PWD}/organizations/peerOrganizations/provider.codocs.com/peers/peer1.provider.codocs.com/tls/server.key

  # mkdir ${PWD}/organizations/peerOrganizations/provider.codocs.com/msp/tlscacerts
  # cp ${PWD}/organizations/peerOrganizations/provider.codocs.com/peers/peer0.provider.codocs.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/provider.codocs.com/msp/tlscacerts/ca.crt

  # mkdir ${PWD}/organizations/peerOrganizations/provider.codocs.com/tlsca
  # cp ${PWD}/organizations/peerOrganizations/provider.codocs.com/peers/peer0.provider.codocs.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/provider.codocs.com/tlsca/tlsca.provider.codocs.com-cert.pem

  # mkdir ${PWD}/organizations/peerOrganizations/provider.codocs.com/ca
  # cp ${PWD}/organizations/peerOrganizations/provider.codocs.com/peers/peer0.provider.codocs.com/msp/cacerts/* ${PWD}/organizations/peerOrganizations/provider.codocs.com/ca/ca.provider.codocs.com-cert.pem

  mkdir -p organizations/peerOrganizations/provider.codocs.com/users
  mkdir -p organizations/peerOrganizations/provider.codocs.com/users/User1@provider.codocs.com

  echo
  echo "## Generate the user msp"
  echo
  set -x
	fabric-ca-client enroll -u https://user1:user1pw@localhost:8054 --caname ca-provider -M ${PWD}/organizations/peerOrganizations/provider.codocs.com/users/User1@provider.codocs.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/provider/tls-cert.pem
  set +x

  mkdir -p organizations/peerOrganizations/provider.codocs.com/users/Admin@provider.codocs.com

  echo
  echo "## Generate the org admin msp"
  echo
  set -x
	fabric-ca-client enroll -u https://provideradmin:provideradminpw@localhost:8054 --caname ca-provider -M ${PWD}/organizations/peerOrganizations/provider.codocs.com/users/Admin@provider.codocs.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/provider/tls-cert.pem
  set +x

  cp ${PWD}/organizations/peerOrganizations/provider.codocs.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/provider.codocs.com/users/Admin@provider.codocs.com/msp/config.yaml

}


function createadmin {

  echo
	echo "Enroll the CA admin"
  echo
	mkdir -p organizations/peerOrganizations/admin.codocs.com/

	export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/admin.codocs.com/

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:9054 --caname ca-admin --tls.certfiles ${PWD}/organizations/fabric-ca/admin/tls-cert.pem
  set +x

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-admin.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-admin.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-admin.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-admin.pem
    OrganizationalUnitIdentifier: orderer' > ${PWD}/organizations/peerOrganizations/admin.codocs.com/msp/config.yaml

  echo
	echo "Register peer0"
  echo
  set -x
	fabric-ca-client register --caname ca-admin --id.name peer0 --id.secret peer0pw --id.type peer --id.attrs '"hf.Registrar.Roles=peer"' --tls.certfiles ${PWD}/organizations/fabric-ca/admin/tls-cert.pem
  set +x

  echo
	echo "Register peer1"
  echo
  set -x
	fabric-ca-client register --caname ca-admin --id.name peer1 --id.secret peer1pw --id.type peer --id.attrs '"hf.Registrar.Roles=peer"' --tls.certfiles ${PWD}/organizations/fabric-ca/admin/tls-cert.pem
  set +x

  echo
  echo "Register user"
  echo
  set -x
  fabric-ca-client register --caname ca-admin --id.name user1 --id.secret user1pw --id.type client --id.attrs '"hf.Registrar.Roles=client"' --tls.certfiles ${PWD}/organizations/fabric-ca/admin/tls-cert.pem
  set +x

  echo
  echo "Register the org admin"
  echo
  set -x
  fabric-ca-client register --caname ca-admin --id.name adminadmin --id.secret adminadminpw --id.type admin --id.attrs '"hf.Registrar.Roles=admin"' --tls.certfiles ${PWD}/organizations/fabric-ca/admin/tls-cert.pem
  set +x

	mkdir -p organizations/peerOrganizations/admin.codocs.com/peers
  mkdir -p organizations/peerOrganizations/admin.codocs.com/peers/peer0.admin.codocs.com
  mkdir -p organizations/peerOrganizations/admin.codocs.com/peers/peer1.admin.codocs.com

  echo
  echo "## Generate the peer0 msp"
  echo
  set -x
	fabric-ca-client enroll -u https://peer0:peer0pw@localhost:9054 --caname ca-admin -M ${PWD}/organizations/peerOrganizations/admin.codocs.com/peers/peer0.admin.codocs.com/msp --csr.hosts peer0.admin.codocs.com --tls.certfiles ${PWD}/organizations/fabric-ca/admin/tls-cert.pem
  set +x

  cp ${PWD}/organizations/peerOrganizations/admin.codocs.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/admin.codocs.com/peers/peer0.admin.codocs.com/msp/config.yaml

  echo
  echo "## Generate the peer1 msp"
  echo
  set -x
	fabric-ca-client enroll -u https://peer1:peer1pw@localhost:9054 --caname ca-admin -M ${PWD}/organizations/peerOrganizations/admin.codocs.com/peers/peer1.admin.codocs.com/msp --csr.hosts peer1.admin.codocs.com --tls.certfiles ${PWD}/organizations/fabric-ca/admin/tls-cert.pem
  set +x

  cp ${PWD}/organizations/peerOrganizations/admin.codocs.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/admin.codocs.com/peers/peer1.admin.codocs.com/msp/config.yaml

  echo
  echo "## Generate the peer0-tls certificates"
  echo
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:9054 --caname ca-admin -M ${PWD}/organizations/peerOrganizations/admin.codocs.com/peers/peer0.admin.codocs.com/tls --enrollment.profile tls --csr.hosts peer0.admin.codocs.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/admin/tls-cert.pem
  set +x


  cp ${PWD}/organizations/peerOrganizations/admin.codocs.com/peers/peer0.admin.codocs.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/admin.codocs.com/peers/peer0.admin.codocs.com/tls/ca.crt
  cp ${PWD}/organizations/peerOrganizations/admin.codocs.com/peers/peer0.admin.codocs.com/tls/signcerts/* ${PWD}/organizations/peerOrganizations/admin.codocs.com/peers/peer0.admin.codocs.com/tls/server.crt
  cp ${PWD}/organizations/peerOrganizations/admin.codocs.com/peers/peer0.admin.codocs.com/tls/keystore/* ${PWD}/organizations/peerOrganizations/admin.codocs.com/peers/peer0.admin.codocs.com/tls/server.key

  mkdir ${PWD}/organizations/peerOrganizations/admin.codocs.com/msp/tlscacerts
  cp ${PWD}/organizations/peerOrganizations/admin.codocs.com/peers/peer0.admin.codocs.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/admin.codocs.com/msp/tlscacerts/ca.crt

  mkdir ${PWD}/organizations/peerOrganizations/admin.codocs.com/tlsca
  cp ${PWD}/organizations/peerOrganizations/admin.codocs.com/peers/peer0.admin.codocs.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/admin.codocs.com/tlsca/tlsca.codocs.com-cert.pem

  mkdir ${PWD}/organizations/peerOrganizations/admin.codocs.com/ca
  cp ${PWD}/organizations/peerOrganizations/admin.codocs.com/peers/peer0.admin.codocs.com/msp/cacerts/* ${PWD}/organizations/peerOrganizations/admin.codocs.com/ca/ca.codocs.com-cert.pem

  echo
  echo "## Generate the peer1-tls certificates"
  echo
  set -x
  fabric-ca-client enroll -u https://peer1:peer1pw@localhost:9054 --caname ca-admin -M ${PWD}/organizations/peerOrganizations/admin.codocs.com/peers/peer1.admin.codocs.com/tls --enrollment.profile tls --csr.hosts peer1.admin.codocs.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/admin/tls-cert.pem
  set +x


  cp ${PWD}/organizations/peerOrganizations/admin.codocs.com/peers/peer1.admin.codocs.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/admin.codocs.com/peers/peer1.admin.codocs.com/tls/ca.crt
  cp ${PWD}/organizations/peerOrganizations/admin.codocs.com/peers/peer1.admin.codocs.com/tls/signcerts/* ${PWD}/organizations/peerOrganizations/admin.codocs.com/peers/peer1.admin.codocs.com/tls/server.crt
  cp ${PWD}/organizations/peerOrganizations/admin.codocs.com/peers/peer1.admin.codocs.com/tls/keystore/* ${PWD}/organizations/peerOrganizations/admin.codocs.com/peers/peer1.admin.codocs.com/tls/server.key

  mkdir -p organizations/peerOrganizations/admin.codocs.com/users
  mkdir -p organizations/peerOrganizations/admin.codocs.com/users/User1@admin.codocs.com

  echo
  echo "## Generate the user msp"
  echo
  set -x
	fabric-ca-client enroll -u https://user1:user1pw@localhost:9054 --caname ca-admin -M ${PWD}/organizations/peerOrganizations/admin.codocs.com/users/User1@admin.codocs.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/admin/tls-cert.pem
  set +x

  mkdir -p organizations/peerOrganizations/admin.codocs.com/users/Admin@admin.codocs.com

  echo
  echo "## Generate the org admin msp"
  echo
  set -x
	fabric-ca-client enroll -u https://adminadmin:adminadminpw@localhost:9054 --caname ca-admin -M ${PWD}/organizations/peerOrganizations/admin.codocs.com/users/Admin@admin.codocs.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/admin/tls-cert.pem
  set +x

  cp ${PWD}/organizations/peerOrganizations/admin.codocs.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/admin.codocs.com/users/Admin@admin.codocs.com/msp/config.yaml

}


function createOrderer {

  echo
	echo "Enroll the CA admin"
  echo
	mkdir -p organizations/ordererOrganizations/codocs.com

	export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/ordererOrganizations/codocs.com
#  rm -rf $FABRIC_CA_CLIENT_HOME/fabric-ca-client-config.yaml
#  rm -rf $FABRIC_CA_CLIENT_HOME/msp

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:10054 --caname ca-orderer --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  set +x

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-10054-ca-orderer.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-10054-ca-orderer.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-10054-ca-orderer.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-10054-ca-orderer.pem
    OrganizationalUnitIdentifier: orderer' > ${PWD}/organizations/ordererOrganizations/codocs.com/msp/config.yaml


  echo
	echo "Register orderer"
  echo
  set -x
	fabric-ca-client register --caname ca-orderer --id.name orderer --id.secret ordererpw --id.type orderer --id.attrs '"hf.Registrar.Roles=orderer"' --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  set +x

  echo
	echo "Register ordere2"
  echo
  set -x
	fabric-ca-client register --caname ca-orderer --id.name orderer2 --id.secret orderer2pw --id.type orderer --id.attrs '"hf.Registrar.Roles=orderer"' --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  set +x

  echo
	echo "Register orderer3"
  echo
  set -x
	fabric-ca-client register --caname ca-orderer --id.name orderer3 --id.secret orderer3pw --id.type orderer --id.attrs '"hf.Registrar.Roles=orderer"' --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  set +x

  echo
	echo "Register orderer4"
  echo
  set -x
	fabric-ca-client register --caname ca-orderer --id.name orderer4 --id.secret orderer4pw --id.type orderer --id.attrs '"hf.Registrar.Roles=orderer"' --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  set +x

  echo
	echo "Register orderer5"
  echo
  set -x
	fabric-ca-client register --caname ca-orderer --id.name orderer5 --id.secret orderer5pw --id.type orderer --id.attrs '"hf.Registrar.Roles=orderer"' --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  set +x

  echo
  echo "Register the orderer admin"
  echo
  set -x
  fabric-ca-client register --caname ca-orderer --id.name ordererAdmin --id.secret ordererAdminpw --id.type admin --id.attrs '"hf.Registrar.Roles=admin"' --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  set +x

	mkdir -p organizations/ordererOrganizations/codocs.com/orderers
  mkdir -p organizations/ordererOrganizations/codocs.com/orderers/codocs.com

  mkdir -p organizations/ordererOrganizations/codocs.com/orderers/orderer.codocs.com
  mkdir -p organizations/ordererOrganizations/codocs.com/orderers/orderer2.codocs.com
  mkdir -p organizations/ordererOrganizations/codocs.com/orderers/orderer3.codocs.com
  mkdir -p organizations/ordererOrganizations/codocs.com/orderers/orderer4.codocs.com
  mkdir -p organizations/ordererOrganizations/codocs.com/orderers/orderer5.codocs.com

  echo
  echo "## Generate the orderer msp"
  echo
  set -x
	fabric-ca-client enroll -u https://orderer:ordererpw@localhost:10054 --caname ca-orderer -M ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer.codocs.com/msp --csr.hosts orderer.codocs.com --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  set +x

  cp ${PWD}/organizations/ordererOrganizations/codocs.com/msp/config.yaml ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer.codocs.com/msp/config.yaml

  echo
  echo "## Generate the orderer2 msp"
  echo
  set -x
	fabric-ca-client enroll -u https://orderer2:orderer2pw@localhost:10054 --caname ca-orderer -M ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer2.codocs.com/msp --csr.hosts orderer2.codocs.com --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  set +x

  cp ${PWD}/organizations/ordererOrganizations/codocs.com/msp/config.yaml ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer2.codocs.com/msp/config.yaml

  echo
  echo "## Generate the orderer3 msp"
  echo
  set -x
	fabric-ca-client enroll -u https://orderer3:orderer3pw@localhost:10054 --caname ca-orderer -M ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer3.codocs.com/msp --csr.hosts orderer3.codocs.com --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  set +x

  cp ${PWD}/organizations/ordererOrganizations/codocs.com/msp/config.yaml ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer3.codocs.com/msp/config.yaml

  echo
  echo "## Generate the orderer4 msp"
  echo
  set -x
	fabric-ca-client enroll -u https://orderer4:orderer4pw@localhost:10054 --caname ca-orderer -M ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer4.codocs.com/msp --csr.hosts orderer4.codocs.com --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  set +x

  cp ${PWD}/organizations/ordererOrganizations/codocs.com/msp/config.yaml ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer4.codocs.com/msp/config.yaml

  echo
  echo "## Generate the orderer5 msp"
  echo
  set -x
	fabric-ca-client enroll -u https://orderer5:orderer5pw@localhost:10054 --caname ca-orderer -M ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer5.codocs.com/msp --csr.hosts orderer5.codocs.com --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  set +x

  cp ${PWD}/organizations/ordererOrganizations/codocs.com/msp/config.yaml ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer5.codocs.com/msp/config.yaml

  echo
  echo "## Generate the orderer-tls certificates"
  echo
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@localhost:10054 --caname ca-orderer -M ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer.codocs.com/tls --enrollment.profile tls --csr.hosts orderer.codocs.com --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  set +x

  cp ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer.codocs.com/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer.codocs.com/tls/ca.crt
  cp ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer.codocs.com/tls/signcerts/* ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer.codocs.com/tls/server.crt
  cp ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer.codocs.com/tls/keystore/* ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer.codocs.com/tls/server.key

  mkdir ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer.codocs.com/msp/tlscacerts
  cp ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer.codocs.com/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer.codocs.com/msp/tlscacerts/tlsca.codocs.com-cert.pem

  mkdir ${PWD}/organizations/ordererOrganizations/codocs.com/msp/tlscacerts
  cp ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer.codocs.com/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/codocs.com/msp/tlscacerts/tlsca.codocs.com-cert.pem

  echo
  echo "## Generate the orderer2-tls certificates"
  echo
  set -x
  fabric-ca-client enroll -u https://orderer2:orderer2pw@localhost:10054 --caname ca-orderer -M ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer2.codocs.com/tls --enrollment.profile tls --csr.hosts orderer2.codocs.com --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  set +x

  cp ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer2.codocs.com/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer2.codocs.com/tls/ca.crt
  cp ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer2.codocs.com/tls/signcerts/* ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer2.codocs.com/tls/server.crt
  cp ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer2.codocs.com/tls/keystore/* ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer2.codocs.com/tls/server.key

  echo
  echo "## Generate the orderer3-tls certificates"
  echo
  set -x
  fabric-ca-client enroll -u https://orderer3:orderer3pw@localhost:10054 --caname ca-orderer -M ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer3.codocs.com/tls --enrollment.profile tls --csr.hosts orderer3.codocs.com --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  set +x

  cp ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer3.codocs.com/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer3.codocs.com/tls/ca.crt
  cp ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer3.codocs.com/tls/signcerts/* ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer3.codocs.com/tls/server.crt
  cp ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer3.codocs.com/tls/keystore/* ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer3.codocs.com/tls/server.key

  echo
  echo "## Generate the orderer4-tls certificates"
  echo
  set -x
  fabric-ca-client enroll -u https://orderer4:orderer4pw@localhost:10054 --caname ca-orderer -M ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer4.codocs.com/tls --enrollment.profile tls --csr.hosts orderer4.codocs.com --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  set +x

  cp ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer4.codocs.com/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer4.codocs.com/tls/ca.crt
  cp ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer4.codocs.com/tls/signcerts/* ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer4.codocs.com/tls/server.crt
  cp ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer4.codocs.com/tls/keystore/* ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer4.codocs.com/tls/server.key

  echo
  echo "## Generate the orderer5-tls certificates"
  echo
  set -x
  fabric-ca-client enroll -u https://orderer5:orderer5pw@localhost:10054 --caname ca-orderer -M ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer5.codocs.com/tls --enrollment.profile tls --csr.hosts orderer5.codocs.com --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  set +x

  cp ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer5.codocs.com/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer5.codocs.com/tls/ca.crt
  cp ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer5.codocs.com/tls/signcerts/* ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer5.codocs.com/tls/server.crt
  cp ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer5.codocs.com/tls/keystore/* ${PWD}/organizations/ordererOrganizations/codocs.com/orderers/orderer5.codocs.com/tls/server.key

  mkdir -p organizations/ordererOrganizations/codocs.com/users
  mkdir -p organizations/ordererOrganizations/codocs.com/users/Admin@patient.codocs.com

  echo
  echo "## Generate the admin msp"
  echo
  set -x
	fabric-ca-client enroll -u https://ordererAdmin:ordererAdminpw@localhost:10054 --caname ca-orderer -M ${PWD}/organizations/ordererOrganizations/codocs.com/users/Admin@patient.codocs.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  set +x

  cp ${PWD}/organizations/ordererOrganizations/codocs.com/msp/config.yaml ${PWD}/organizations/ordererOrganizations/codocs.com/users/Admin@patient.codocs.com/msp/config.yaml

}

const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const window = require('window');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
  'shoe aim vanish become effort toward market polar busy radio aware useless',
  'https://rinkeby.infura.io/v3/92523f9b1b8641d5b2d63bcd7f312f9d'
);
const web3 = new Web3(provider);

const deploy = async() => {
  const accounts = await web3.eth.getAccounts();
  console.log("Contract deloy form account ",accounts[0]);
  const result = await new web3.eth.Contract(JSON.parse(interface))
  .deploy({data: '0x'+ bytecode})
  .send({from: accounts[0]});

  console.log(interface);
  console.log("Contract Deploy ho gaya hai",result.options.address);
};
//0x02ce2E48dd7A8540Db0B508b4b526A49f2e135bd
deploy();

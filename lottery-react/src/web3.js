// import Web3 from 'web3';
// const web3 = new Web3(window.web3.currentProvider);
//
// export default web3;
import Web3 from 'web3'

let web3

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  web3 = new Web3(window.web3.currentProvider)
} else {
  const provider = new Web3.providers.HttpProvider(
    'https://rinkeby.infura.io/v3/92523f9b1b8641d5b2d63bcd7f312f9d'
  )
  web3 = new Web3(provider)
}

export default web3

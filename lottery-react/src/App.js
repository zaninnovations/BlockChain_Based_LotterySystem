//import React,{Component} from 'react';
import React,{Component} from 'react';
// import logo from './logo.svg';
import './App.css';
import Web3 from 'web3'
import web3 from './web3';
import lottery from './lottery';
// import Web3 from 'web3';
// const web3 = new Web3(window.web3.currentProvider);

class App extends Component {

//constructor (props) {
//   super(props);
//   this.state = {manager:''};
// }

state = {
  manager:'',
//acounts:[],
  players:[],
  balance:'',
  value:'',
  message: ''
};

async componentDidMount(){
  if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      try {
        // Request account access if needed
        await window.ethereum.enable()
        // Acccounts now exposed
      } catch (error) {
        // User denied account access..
      }
    }
    // Legacy dapp brow sers...
    else if (window.web3) {
      window.web3 = new Web3(this.web3.currentProvider)
    }
    // Non-dapp browsers...
    else {
      alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }

  const manager = await lottery.methods.manager().call();
  const accounts = await web3.eth.getAccounts();
  const players = await lottery.methods.getPlayers().call();
  const balance = await web3.eth.getBalance(lottery.options.address);


  this.setState({ manager, players, balance });
}

onSubmit = async event => {
    event.preventDefault();
    this.setState({message:"Waiting for Trasanction Success...."});

    const accounts = await web3.eth.getAccounts();
    console.log(accounts);

    await lottery.methods.enter().send({
    from: accounts[0],
    value: web3.utils.toWei(this.state.value,'ether')
  });
  this.setState({message:"You have been entered !"});
};

onClick = async () => {
  const accounts = await web3.eth.getAccounts();
  this.setState({message:"Waiting for Transaction Success...."});
  await lottery.methods.pickwinner().send({
    from: accounts[0]
  });
  console.log(accounts[0]);
  this.setState({message:'The Winner Has been Picked....'});

};
render() {


//web3.eth.getAccounts().then(console.log);
//console.log(web3.version);
  return (
    <div>
    <h1>Lottery Contract Created By {this.state.manager}</h1>
    <p>This contract is managed by {this.state.manager}. There are currently {this.state.players.length} entered,
    competing to win {web3.utils.fromWei(this.state.balance,'ether')} ether! </p>
    <hr />
    <form onSubmit = {this.onSubmit}>
    <h2> Want to try your luck</h2>
    <div>
    <label>Amount of ether you want to spend </label>
    <input
    value = {this.state.value}
    onChange = {event => this.setState({value:event.target.value})}
    />
    </div>
    <button> Enter </button>
    </form>
    <hr/>
    <button onClick ={this.onClick}> Pick a Winner </button>
    <h3> {this.state.message} </h3>
    </div>
  );
}
}
export default App;

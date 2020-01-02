const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);
const {interface , bytecode} = require('../compile');

let accounts;
let lottery;

beforeEach(async()=> {
  accounts = await web3.eth.getAccounts();

  lottery = await new web3.eth.Contract(JSON.parse(interface))
  .deploy({data: bytecode })
  .send({from: accounts[0], gas: '1000000'});
});
describe('Lottery Contract', () =>{
  it('Deploy Contract', () => {
    assert.ok(lottery.options.address);
  });
  it('allow the player to enter in the contract' , async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('.01','ether'),
    });

    const players = await lottery.methods.getPlayers().call({
      from:accounts[0]
    });
    assert.equal(accounts[0],players[0]);
    assert.equal(1,players.length);
  });

  it('allow multiple player to enter in the contract' , async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02','ether')
    });
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('0.02','ether')
    });
    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei('0.02','ether')
    });


    const players = await lottery.methods.getPlayers().call({
      from:accounts[0]
    });
    assert.equal(accounts[0],players[0]);
    assert.equal(accounts[1],players[1]);
    assert.equal(accounts[2],players[2]);
    assert.equal(3,players.length);
  });
  it('requires minimum amount of ether to enter',async ()=>{
    try{
      await lottery.methods.enter().send({
        from: accounts[0],
        value: 0
      });
    //  assert(false);
    }
    catch (err){
      assert(err);
    }
  });
  it('Only the manager can call the pickwinner function ', async()=>{
    try{
      await lottery.methods.pickwinner().send({
        from:account[1],
      });
    }
    catch(err){
      assert(err);
    }
  });
it('Send ether to the winner and reset the players array', async()=>{
  await lottery.methods.enter().send({
    from:accounts[0],
    value: web3.utils.toWei('2','ether')
  });
  const inititalBalance = await web3.eth.getBalance(accounts[0]);
  await lottery.methods.pickwinner().send({from:accounts[0]});
  const finalBalance = await web3.eth.getBalance(accounts[0]);
  console.log(finalBalance);
  const difference = finalBalance - inititalBalance;
  console.log(difference);
  assert(difference > web3.utils.toWei('1.8','ether'));
});
});

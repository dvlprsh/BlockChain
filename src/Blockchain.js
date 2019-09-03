const localIpV4Address = require("local-ipv4-address");
const Bootstrap = require("./Bootstrap");
const Server = require("./Server");
const Client = require("./Client");
const Block = require("./block/Block");
const utils=require("./utils");
const {Worker} = require('worker_threads');

const MemPool = require("./tx/MemPool");


class Blockchain {
 static GENESIS_BLOCK = new Block(
 "0000000000000000000000000000000000000000000000000000000000000000",
 "0000000000000000000000000000000000000000000000000000000000000000",
 "00000fffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
 1231006505,
 429293
 // TODO: valid nonce
 );
 constructor() {
  this.blocks = [Blockchain.GENESIS_BLOCK];
  this.initializing = true;
  this.memPool = new MemPool();
 }


 start = async () => {
  this._startServer();
  this.clients = [];
  const bootstrap = new Bootstrap("http://192.168.35.2");
  const myAddr = await localIpV4Address();
  const ipAddrs = await bootstrap.fetch();
  for (const addr of ipAddrs) {
    if (myAddr !== addr) {
      const client = this._startClient(addr);
      this.clients.push(client);
    }
  }
 };

 _startServer = () => {
  this.server = new Server();
  this.server.on("getheaders", this._onGetheaders);
  this.server.on("headers", this._onHeaders);
  this.server.on("getdata", this._onGetdata);
  this.server.on("block", this._onBlock);
  this.server.on("tx", this._onTx); //0903
  this.server.start();
 };


 _startClient = addr => {
  const client = new Client("ws://" + addr + ":43210");
  client.on("getheaders", this._onGetheaders);
  client.on("headers", this._onHeaders);
  client.on("getdata", this._onGetdata);
  client.on("block", this._onBlock);
  client.on("tx", this._onTx); //0903
  client.on("connected", () => {
      client.sendMessage("getheaders", null);  //다른 노드들이랑 연결이 되자마자 getHeaders메세지 날림 (헤더 받아오기)
    });
  client.connect();
  return client;
 };

 _addBlock = block => {
  this.blocks.push(block);
  utils.log("Blockchain", "Block Height: " + this.blocks.length);
 };


 _onGetheaders = connection => {
  const headers = [];
  // TODO: prepare headers
  let current_block;
  let current_header;
  for(let i=0; i<this.blocks.length; i++){
   current_block=this.blocks[i];
   current_header=current_block.header();
   headers.push(current_header);

  }

  
  this.server.sendMessage(connection, "headers", headers);
 };

 _onHeaders = (connection, data) => {
  if (this.initializing) {
   const newHeaders = [];
   let prevHash = null;
   for (const header of data) {
    const block = Block.from(header);
    if (prevHash != null && block.prevHash !== prevHash) {
     return;
    }
    prevHash = block.hash();
    newHeaders.push(block);
   }
   if (this.blocks.length < data.length) {
    this.blocks = newHeaders;
   }
  }
 };

 _onGetdata = (connection, invs) => {
  for (const inv of invs) {
   const hash = inv.hash;
   for (const block of this.blocks) {
    if (block.hash() === hash && block.txs.length > 0) {
     this.server.sendMessage(connection, "block", block);
    }
   }
  }
 };
 _onBlock = (connection, data) => {
  const newBlock = Block.from(data);
  if (newBlock.validate()) {
   const lastBlock = this.blocks[this.blocks.length - 1];
   if (lastBlock.hash() === newBlock.prevHash) {
    this._addBlock(newBlock);
    if (this.initializing) {
     this.initializing = false;
     utils.log("Blockchain", "Finished downloading headers");

     this.startMining();

     const invs = [];
     for (const block of this.blocks) {
      invs.push({
       type: 2,
       hash: block.hash()
      });
     }
     this.server.sendMessage(connection, "getdata", invs);
    } else {
     this.stopMining();
     this.startMining();
    }
   } else if (!this.initializing) {
    const hash = newBlock.hash();
    for (let i = 0; i < this.blocks.length; i++) {
     if (this.blocks[i].txs.length === 0 && this.blocks[i].hash() === hash) {
      this.blocks[i] = newBlock;
     }
    }
   }
  }
 };

 startMining = () => {
  this.stopMining();
  utils.log("Blockchain", "Starting mining...");
  this.worker = new Worker("./src/block/MiningWorker.js", {
   workerData: {
    blocks: this.blocks
   }
  });
  this.worker.on("message", object => {
   const newBlock = Block.from(object);
   let lastBlock = this.blocks[this.blocks.length - 1];
   if (lastBlock.hash() === newBlock.prevHash) {
    this._addBlock(newBlock);
    utils.log("Blockchain", "Mined: " + newBlock.hash());
    for (const client of this.clients) {
     client.sendMessage("block", newBlock);
    }
   }
  })
 };
 stopMining = () => {
  if (this.worker) {
   utils.log("Blockchain", "Stopping mining...");
   this.worker.terminate();
  }
 }

 _onTx = (connection, data) => {
  const tx = Tx.from(data);
  if (tx.validate()) {
   this.memPool.addTx(tx);
   for (const client of this.clients) {
    client.sendMessage("tx", tx);
   }
  }
 };

//connection--응답
 //블록 내용을 알고 있을 때에만 block 데이터를 보내줘야 함
 /*
 _onGetdata = (connection, invs) => {
  for (const inv of invs) {
   const hash = inv.hash;
   for (const block of this.blocks) {
    if (block.hash() === hash) {
     this.server.on("getdata", this._onGetdata);
    }
   }
  }
 };
*/
 /*
 _onBlock = (connection, data) => {
  const newBlock = Block.from(data);
  if (newBlock.validate()) {
   //lastBlock--로컬의 마지막 블록


   const lastBlock = this.blocks[this.blocks.length - 1];
   if (lastBlock.hash() === newBlock.prevHash) {
    this._addBlock(newBlock);
    //헤더가 initializing 중인지
    if (this.initializing) {
     //이 조건에서만 헤더 다운로드가 완료되었는지 알 수 있는것
     this.initializing = false;
     utils.log("Blockchain", "Finished downloading headers");
     // TODO: send getdata message
     const invArr=[];

     //let inv={type:2, hash: newBlock.hash()};
     let inv;
     let curr_block;
     for(let i=0; i< this.blocks.length; i++){
      curr_block=Block.from(this.blocks[i]);
      inv={type:2, hash: curr_block.hash()}; //해쉬값은 헤더의 헤쉬값이나 블록 전체의 해쉬값이나 같다
      invArr.push(inv);
     }

     this.server.sendMessage(connection, "getdata", invArr);
    }
   } else if (!this.initializing) {
  // TODO: replace header with newBlock
    let index=0;
    for (const block of this.blocks) {
     index++;
     if (block.hash() === newBlock.prevHash) {
      this.blocks[index]=(newBlock);
      console.log("testlog---header pushed");
     }

    }

   }
  }

 };*/
}

/**/
module.exports = Blockchain;
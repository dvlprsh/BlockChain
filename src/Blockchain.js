const localIpV4Address = require("local-ipv4-address");
const Bootstrap = require("./Bootstrap");
const Server = require("./Server");
const Client = require("./Client");
const Block = require("./block/Block");
const utils=require("./utils");
const {Worker} = require('worker_threads');
const Tx=require("./tx/Tx");
const MemPool = require("./tx/MemPool");
const NodeRSA = require("node-rsa");

class Blockchain {
 static GENESIS_BLOCK = new Block(
 "0000000000000000000000000000000000000000000000000000000000000000",
 "0000000000000000000000000000000000000000000000000000000000000000",
 "00008fffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
 1231006505,
 429293
 // TODO: valid nonce
 );
 constructor(privateKey) {
  this.blocks = [Blockchain.GENESIS_BLOCK];
  this.initializing = true;
  this.memPool = new MemPool();

  this.key = new NodeRSA();
  this.key.importKey(Buffer.from(privateKey, "hex"), "pkcs1-private-der");

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
  client.on("tx", this._onTx); //0903 //거래가 생성됐을때 전파
  client.on("connected", () => {
      client.sendMessage("getheaders", null);  //다른 노드들이랑 연결이 되자마자 getHeaders메세지 날림 (헤더 받아오기)
    });
  client.connect();
  return client;
 };


 _addBlock = block => {
  this.blocks.push(block);
  for (const tx of block.txs) {
   for (const input of tx.inputs) {
    this.memPool.removeTx(input.txHash);
   }
   this.memPool.addTx(tx);
  }
  for (const client of this.clients) {
   client.sendMessage("block", block);
  }
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
  console.log("onBlock validate test :"+newBlock.validate(this.memPool));
  if (newBlock.validate(this.memPool)) {
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
  const publicKey = this.key.exportKey("pkcs8-publicder").toString("hex");
  const coinbase = Tx.createCoinbase(publicKey);

  const txs = [coinbase].concat(this.memPool.getTxs());
  this.worker = new Worker("./src/block/MiningWorker.js", {
   workerData: {
    blocks: this.blocks,
    txs:txs
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
   this.memPool.addTx(tx, true);
   for (const client of this.clients) {
    client.sendMessage("tx", tx);
   }
   if (this.worker) {
    const publicKey = this.key.exportKey("pkcs8-publicder").toString("hex");
    const coinbase = Tx.createCoinbase(publicKey);
    const txs = [coinbase].concat(this.memPool.getTxs());
    this.worker.postMessage(txs);
   }
  }
 };


}

/**/
module.exports = Blockchain;
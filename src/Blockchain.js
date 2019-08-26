const localIpV4Address = require("local-ipv4-address");
const Bootstrap = require("./Bootstrap");
const Server = require("./Server");
const Client = require("./Client");
const Block = require("./block/Block");
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
  this.server.start();
 };


 _startClient = addr => {
  const client = new Client("ws://" + addr + ":43210");
  client.on("getheaders", this._onGetheaders);
  client.on("headers", this._onHeaders);
  client.on("getdata", this._onGetdata);
  client.on("block", this._onBlock);
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
    if (block.hash() === hash) {
     this.server.on("getdata", this._onGetdata);
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
      inv={type:2, hash: curr_block.hash()};
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

 };
}

/**/
module.exports = Blockchain;
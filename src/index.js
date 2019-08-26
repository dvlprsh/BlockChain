



/////////////////////////////0820
const Blockchain = require("./Blockchain");
const blockchain = new Blockchain();
blockchain.start();
/////////////////////////////0820



/*const Bootstrap = require("./Bootstrap");
(async () => {
    const bootstrap = new Bootstrap("http://192.168.35.2");
    const ipAddrs = await bootstrap.fetch();
    console.log(ipAddrs);
})();    //http://192.168.35.2에서 주소 리스트 가져오기*/

/*
const Server=require("./Server");

const server=new Server();
server.start();    서버 실행test*/


/*
const Bootstrap = require("./Bootstrap");
const Server = require("./Server");
const Client = require("./Client");
const Block=require(".block/Block");
const localIpV4Address = require("local-ipv4-address");
// TODO: Start server


const server=new Server();
server.start();

//Client

//const client=new Client();
(async () => {
    const bootstrap = new Bootstrap("http://192.168.35.2");
    const myAddr = await localIpV4Address();
    const ipAddrs = await bootstrap.fetch();
    // TODO: Connect to other nodes

    for (let addr of ipAddrs) {
        //console.log(myAddr+'shtest');
        // expected output: 1

        if(myAddr !== addr){
            const client=new Client("ws://"+addr+":43210");
            client.connect();
        }
        //client.connect();
        //break; // closes iterator, triggers return
    }






})();

*/
/*
//pow
const Block=require('./block/Block');
const block = new Block(
    "0000000000000000000000000000000000000000000000000000000000000000",
    "0000000000000000000000000000000000000000000000000000000000000000",
    "00000fffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    1231006505
);
console.log(block.pow());


//pow

 */



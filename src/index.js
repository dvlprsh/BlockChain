//0903 script test
const Tx= require("./tx/Tx");
const Input = require("./tx/Input");
const Output = require("./tx/Output");
const Script = require("./tx/Script");
const ScriptRunner=require("./tx/ScriptRunner");
const PUB_KEY="30820222300d06092a864886f70d01010105000382020f003082020a0282020100d5e0fa8ca0868b154ef8b9f56b70ad4074c7c9925e661e26e3a7b87700310e632f856bc8b5ac9a39697b9b39956f5f55a19f3cb0efba8c09d7dacd54a511ab3ee1bb67b5d64721a08a2e05550a733ee777fcbff5c4467c67421375d91f0f019e1c75938ae9a6bd25455d91c1386aaaca13eb2a94f813192b857c7fcbc1676a1eb4be747c3bab725d0088c7f3caf876e72dfe85c400ab0d10326094a4606fe46e325b84c579c5f5cd3a99c2ce74cdcc0b7b23f9e99f60bbf5a2b661e98fcfcd15a06b8745dc37d366a5eab073105ad770af95461cd542d0472bae0fb196bf371df8711380cb23a48a459ff4904e4e6dfa56aa4e571b1b488b5a6b869fd084af509865339e4fd99c7b4730bb6d601491937beafce9423982949935a4c6972af7315fd8522a87f9dc8382140d6988520a1c33f5e36f0363f1abea538f9d078c5b91087e29f1bb84632a61795b20628ef19952867800d10bcebc420187749db5407070e0303fb56ebbd34b9a36bd932c5fb5024b0f8479d067cb227318cb5c176c8f0723ac6b23a90e5fa2e9056d06cfd3b8089074e46fdaf9d466c5325353e1912042cdfa792fe9313a988a24de5856730bf665f2827f739f7dab8f984ea8d8aa2f7cad9f942bfa669c419b423ae51bf58fe7dee81ad512c2dc54905f7d4a4bd5f9ec5d0f0451fb099b2e85246ee5d3cccd9b3e2eef1c008c016108e5e0d0b1bbb10203010001";
const PRIV_KEY="308209290201000282020100d5e0fa8ca0868b154ef8b9f56b70ad4074c7c9925e661e26e3a7b87700310e632f856bc8b5ac9a39697b9b39956f5f55a19f3cb0efba8c09d7dacd54a511ab3ee1bb67b5d64721a08a2e05550a733ee777fcbff5c4467c67421375d91f0f019e1c75938ae9a6bd25455d91c1386aaaca13eb2a94f813192b857c7fcbc1676a1eb4be747c3bab725d0088c7f3caf876e72dfe85c400ab0d10326094a4606fe46e325b84c579c5f5cd3a99c2ce74cdcc0b7b23f9e99f60bbf5a2b661e98fcfcd15a06b8745dc37d366a5eab073105ad770af95461cd542d0472bae0fb196bf371df8711380cb23a48a459ff4904e4e6dfa56aa4e571b1b488b5a6b869fd084af509865339e4fd99c7b4730bb6d601491937beafce9423982949935a4c6972af7315fd8522a87f9dc8382140d6988520a1c33f5e36f0363f1abea538f9d078c5b91087e29f1bb84632a61795b20628ef19952867800d10bcebc420187749db5407070e0303fb56ebbd34b9a36bd932c5fb5024b0f8479d067cb227318cb5c176c8f0723ac6b23a90e5fa2e9056d06cfd3b8089074e46fdaf9d466c5325353e1912042cdfa792fe9313a988a24de5856730bf665f2827f739f7dab8f984ea8d8aa2f7cad9f942bfa669c419b423ae51bf58fe7dee81ad512c2dc54905f7d4a4bd5f9ec5d0f0451fb099b2e85246ee5d3cccd9b3e2eef1c008c016108e5e0d0b1bbb102030100010282020100d5227eebf6e83cdfbe33f534919dd6b8fde73e836319068120aaba13b4982e4b3f470933198068ac3fe6d2b81ea7beec59c492b98c1c6d833d9d28b36a4fe24426b517d3c8365857607c1e0a3200c8b5e80772d01a89575d9b2643715c171b389209c53f503a3e114f3fc089398c6aa8381348faed00333c00a921bd4dfd9d6dfe163184bffdc958ceb87ff1fdd97ebc40447ccee70f8e540eafda50b85da8d8fbcbe1d2dcd81e6c2732a5441278271765de6324a213c71b30cbe964d450738252bbf530f41499d19813f944a10eb5d4f0d4a3eb05c6b041cc508809243d6752b18b15b16a3e19b14552f2677ff17e7d5332222181bcbd9d493d100a60c468e2e8a106e97f9d096d0813a1333197997fc31fe5ff599d872afc9b80ac4868a6b0119fa2d0ddc13610f7109184a06018e2a794502591188d053d52103aee86d4b53c5945d6e26f2af38018b7ac80ba8ec853fcf6bca0a0fb62ae39844502fa76ee21f8c2483ba8170c321acaeb451d4f54f32ab2da2b41f143bca240959e60b411d5b4126564383ff8ad2111851bde0eb1902f4b216e302a535dfc3e611ecd4d5200f137aeb21c3379d57f68e9e7de94cfeee676f59c24ec888518d12ac99b9bc5e3cff6bf9327c3466ad1a9b687ee57e826e9367bc289c0f64a1878779fb4b5840e42600f22f1f00cfa521665e446f9037d7de1c08994ac9374abc79bc8d454010282010100ed6461364b82aba0f3d91b6faf006b61124ca53496048c4b6bb23f1d6ef9e1607907ccc88b7aebc31ccd381b2dc2ce4f6200ca50b77c97dd40af2c450a5907d2044b055cad83f933170e2768837872cbb85e82b13313fade790383fd8abd774968dee730535f8a0997a06bb0b9ea83aaf490e619d363e78cc5b85d9587d2da95e286fcb5d7c6cebd9f78907d9b71b9ea4bef3924019636329b5c4fd6d34674f1a47b4ef8ffad91f42e179cd8bb210618889435ff4c976f22128e7200ccf891a36e7e6c57842f1e9a12ffde30c9f2687ea0f486c0349bece6957022d154ec99dde972559163d63e49b44eee596f8378b9a599833ddda71d4eb6ab0041425901c10282010100e6a4c53dd1653b7c6f960207cd405649b1a38b3214cbd3469e781155990431ea18d82dbbc3885a46ca50e4a4c2487bcdd2618184fdb8e88268af7ca26b71517af0c769de55b4f1a8f1e67e45c28015ebb71651f22abd0ab9c471c8a05f5707b2e51f7690bdd33dec2d64779dcdc2154a8f6d857061652e3af5d07c48288efd83f6ef46d7d8e7a73bf3d6e11b28c3e07d4b6bfe3a26e1de6d054d9bef94774c4dfbdf66aa3cb9cd936fc501be3b20f82153ce4594aa3e83de342f6a10568c7a04fcd4f5a88387c9bb076b9018fab4e5ca744c41bfa100cccb93acf2e16e9d690511cc7d521a07a277566966c1a45040b854e3c1630fb0d90dd7f819139dd255f102820100508d4527454c1baccbd199abb5f8307789dc141ad9e4c52e3a670b5f936e9af93f585436a08d9f3e5fa18b2e3dc2e27ab1488f5e0044f8cb0ccde3f9b15f3076251ac7c100e7cd4176cb48b8001478ef83aa1e32bea042fa069a18c989b06cafae3424c29327d2111b30461a7b9b85fe166aac898adf558cc0f2a45ebeeddf5a08b9c13a7af36ce78f1b3bfc4328bdeb30c505e09fe13696c97cf36273e26e80284de7283aa9cce2cc591ad1b7fda6b1e0765a343ceb0dbcc40b2dc7f3c54cb5e62263e4f6677ebccd41a14570e11e700971afdfbc7a4452a1d6a119e2f53de8bcf41cf0eead9e092873b81104f3d99d3501f8349fe7badc20c3b99c6b4504810282010100cd2bc8161cbe9bf32ee4577c0f36eb4b750d51d6c42f290bca0e6f0521305d22ace52991bcf7ffaeb76ccc685037e082106312af7670d5cca4496f6aa07f568731c782c2f8a514d04017d53e432e63d1a2b5e541b289261068d2fb30c67f09e736f10d2ce6e01256956ea905a4b2c0f3e9b0f8a226d1b61556f4168aae21bd1d763e165c0ea4cbdc8626216b6291149300d3d97c6b7843bfe196cf5f8947b28630c7e3710ec20e40d88d7ce6777cf59dd80a47555f386b5ff0363978bd350b9a823b0328db90a08092b239a62ee75aff05038cfd65c0eb6d313a097946481ad31aa938d61f37a96bd55fbfbc046a2b988e536885b1c094e53eb881be34879651028201002696f39e7fdf93409b6745565d19b681cb401077d1ed6a6b1de8a75cf30ec60ca02c8e4709d73925584218211064ff22f326f222bccbe51920ca9b9e1c4f0253292d2504115cffdf0f381443f7843565e17d70fac02a46e2214a0c2d79e3d86e173885ca5751231dec5cd179db7b1dc2c171eb8a4dc2a1312ed7a3d79af9ed2d2977d75edb35ff7699f71d6c309fa019ff551090fb55c15f2e51138706a0ba1f537f61034f44af54d281cdb509af1d4e07c0dde666607ec061b215dd2ad2b1aa60775d49b429193b53febc5f13688dc2f6de09786e2a4190944d8ee7ab84e46eaff6ba23570985bc14878bbc8de9ae4b48fda6a5970fbf49922aef0838185b07";

const Hashes = require("jshashes");
const Blockchain = require("./Blockchain");
const blockchain = new Blockchain(PRIV_KEY);
blockchain.start();


const {Worker} = require('worker_threads');
const worker = new Worker("./src/CLIWorker.js");
worker.on("message", data => {
    if (data.action === "getBalance") {
        const balance = blockchain.getBalance();
        console.log(balance / 10 ** 8);
    } else if (data.action === "sendTransaction") {
        const txHash = blockchain.sendTx(data.amount * (10 ** 8),
            data.to);
        console.log(txHash);
    }
});





/*0905 check validation of signature
const pubKeyHash = new Hashes.RMD160().hex(new Hashes.SHA256().hex(PUB_KEY));
const outputTx = new Tx([new Input("0000000000000000000000000000000000000000000000000000000000000000", 0, new Script())], [new Output(100, new Script([Script.OP_DUP, Script.OP_HASH160, pubKeyHash, Script.OP_EQUALVERIFY, Script.OP_CHECKSIG]))]);
outputTx.toHex();
outputTx.sign(PRIV_KEY);

const inputTx = new Tx([new Input(outputTx.hash(), 0, new Script())], [new Output(100, new Script([Script.OP_DUP, Script.OP_HASH160, pubKeyHash, Script.OP_EQUALVERIFY, Script.OP_CHECKSIG]))]);
inputTx.sign(PRIV_KEY);

const runner = new ScriptRunner(outputTx.outputs[0], inputTx.inputs[0], inputTx);
console.log(runner.run());

//0905 check validation of signature*/

/*
const inputs = [new Input("0000000000000000000000000000000000000000000000000000000000000000", 0, new Script())];
const outputs = [new Output(100, new Script([Script.OP_DUP, Script.OP_HASH160, "0000000000000000000000000000000000000000000000000000000000000000", Script.OP_EQUALVERIFY, Script.OP_CHECKSIG]))];
const tx = new Tx(inputs, outputs);
console.log(tx.sign(PRIV_KEY));
//script.values[0]--signature
//script.values[1]--publicKey
console.log(tx.inputs[0].script.values[1]);
//0903 script test


 */
/*
/////////////////////////////0820
const Blockchain = require("./Blockchain");
const blockchain = new Blockchain();
blockchain.start();
/////////////////////////////0820*/



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



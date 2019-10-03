const NodeRSA = require("node-rsa");
const Hashes = require("jshashes");
const key = new NodeRSA({ b: 4096 }); //235----> 4096 변경
const privateKey = key.exportKey("pkcs1-private-der").toString("hex"); //16진수 형태 privateKey
const publicKey = key.exportKey("pkcs8-public-der").toString("hex");
const address = "0x" + new Hashes.RMD160().hex(new Hashes.SHA256().hex(publicKey));
console.log("PrivKey: " + privateKey);
console.log("PubKey: " + publicKey);
console.log("Address: " + address);



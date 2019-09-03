const WebSocketClient = require("websocket").client;
const NodeRSA = require("node-rsa");
const utils = require("./utils");
const PubKey="30820222300d06092a864886f70d01010105000382020f003082020a02820201008d950b0dad01201770100822d3818df31bfaf72431383819195849bf054c6621c3b7a0cb73485fa399f7f47527f2c6064259a9e9f0c4f468635e7a3feef6ad53ebfa9009a3c249f9ccdd54d4354ac9ecef31a2b31bdb0ffe3b74560f5fc93a99e2f65d8ff40e684033c99add375eac413db08414b3ec7f187107b3e9a3cd448b0bdf804af62774fdff315bcc254c3520271e54ed66fe252acb73f09c5bf07788509731bee0f8e26ae33a6f9997dbf0d70d8362f9578f95b0e1661751ecf93ad182cea27e2f3a70bc05fcc8af0253c50f8f5a756e120469da6eb9796dcc387fa3c760004e3a33e6905d44aa7012cc0f38177263397030282359745445da91ac5381d8c13b03c52493d9b9205c80ace92565e2610d515a2d2ef9299ccbec3230f00b19ef89d241c52d25b0ec86acc1bbe4a63a158d6534446e8277a3fb1cece6c3503dfc74442ea2ca5bc30a895eedbe12a2be1e567e25256ff6b522b33f214507e4fffcc4f98ed2389ce0690a1b4b63e006067384f64ed6ec203ce347183c3286d531de7d26848fb747a91ee0d82bce4698a9f67b9b88cdd8a0f818060d66acbd970b594e078b91d8842edfa3590493b8b9593f5e1e32d76c82d6b7e1fe36e733431def8c97418b9244c0e8e77d040298d8a95820e5cbb234f647d4c95ec3286e104e50f52cc8b1407ae6cb7251d189ebd1fd104b606570907808a244a988da9d0203010001";
const PrivKey="3082092902010002820201008d950b0dad01201770100822d3818df31bfaf72431383819195849bf054c6621c3b7a0cb73485fa399f7f47527f2c6064259a9e9f0c4f468635e7a3feef6ad53ebfa9009a3c249f9ccdd54d4354ac9ecef31a2b31bdb0ffe3b74560f5fc93a99e2f65d8ff40e684033c99add375eac413db08414b3ec7f187107b3e9a3cd448b0bdf804af62774fdff315bcc254c3520271e54ed66fe252acb73f09c5bf07788509731bee0f8e26ae33a6f9997dbf0d70d8362f9578f95b0e1661751ecf93ad182cea27e2f3a70bc05fcc8af0253c50f8f5a756e120469da6eb9796dcc387fa3c760004e3a33e6905d44aa7012cc0f38177263397030282359745445da91ac5381d8c13b03c52493d9b9205c80ace92565e2610d515a2d2ef9299ccbec3230f00b19ef89d241c52d25b0ec86acc1bbe4a63a158d6534446e8277a3fb1cece6c3503dfc74442ea2ca5bc30a895eedbe12a2be1e567e25256ff6b522b33f214507e4fffcc4f98ed2389ce0690a1b4b63e006067384f64ed6ec203ce347183c3286d531de7d26848fb747a91ee0d82bce4698a9f67b9b88cdd8a0f818060d66acbd970b594e078b91d8842edfa3590493b8b9593f5e1e32d76c82d6b7e1fe36e733431def8c97418b9244c0e8e77d040298d8a95820e5cbb234f647d4c95ec3286e104e50f52cc8b1407ae6cb7251d189ebd1fd104b606570907808a244a988da9d0203010001028202006ef599fe13d247f6566b1a154131cdaff403d1e0d97a37ece3c21fb9c74b42d7bf6d9065226a5c19f9b72c2d0d2be52a4ea1bada8f49ac4a8b6625e52940c64279349be2122758969f89eecb89209df444d9dfab036fc1aefba58734f15ae1c46cedac11ffb1b2de6e37d858fae60595f3e4fcfec4abda47ab7ddff081e183907db3a1f61dc87a95fd840f6f84e39ed71e115579e137d8a51b6237f632cfd8be4a7ad40fc67d07e5c143b0e6ecef00676a3dc839a5f7efd6fa2f6aa3585753539372a242c67cc4917717cfa7e8e9020dd9c98932c48814f58dc56a7734902ae88e7e9c7eb27aae7e01baa8e0c0ba904ae3855062599c4438c008bd6b298af544225f34e1e64e595b6ed51ca568e75a348020597e6e9997a06b4e3989c5be2e129096ddd50677addb5ee9b719602a9531d88099b41c2dc0ab84885a270cc37f7edd523cd9cdc3a450c9c32fde237dc282ea9834b2b1aaa84dfa9acce919cb57bd9f1e2ccf48f63406f7931d8084cee770a541ec9f69d36ce7ce0bc7bcf3bf5596fe8fc7313051d475cea484bce5d4a4687296ae3c177963a9a8e0a562782898499eed5704ad391e298bcfb516afc3ad485bfff7b6f6173d12c3aad541db65afd2fbb7e86e100c7aba8dc39724d762a36913311b662a25441ae7ca2d2cd9b7f8fbe32b71d0e788b7d6bea2ef167faf88a1c487c6047ad4dde66c9a83d3313e5ab90282010100f0ad0d331b714338876408320e30cdfb5a9fb4e0751f53f81c298eb6e60b7b13a0c166dd2acad30043fcdf1f99d32377db9f6e02ef2cc3a0a5bce152cfe8e6cfeff2a67e185cc38f281c902c629c5b7497f85d49a5e424ce3513d0b6de70011fe7e8a284e47e380e6249fbb4992bcc6850332c5680876e23d7405baeba652257cb7bf503b42e46de89badd7cfc842df82ba958f417adbe09a9442c9a16d004a4949da9250cb29ea518155cad85ecdadbd0a6a61a9c0ca29398fa387411186510db849fccacf566c7a3e032f1c58a8aba22f9660c8dfaf6e16156253a9134ba1ce720c381680d5d1c8297d3768b5955c4025342f6bc6a8bdb4e0c67223558453702820101009698cab4206dcccafa35609a9fe09a43485021c2607101896333ce9a5d9feaf5928fba25ffac09511cf86a7e1d5e83b557e7a13f4a1be4f5fd3f4ebcb8bdf5ca805b794f3f0ab11ae4c292294ad995929f68158229668103318acb40ad9640c8016b25d431ddc4a27d868088fbdefeac5ec20880cc1c90f2f9ab63325a172c766e687a6e50758ab0ac55b0f5c0e9659b4c2e3ca45d7fea1a3f27bb5bb4fb13a05aec751124e2aeaa164147feaeaa85bc095cd76994337d14298fd0d69f287b0daebab7101bed7d443388749abded3a5db1e5fb505afcf873c53eefbfe4a631360931469d57172e61f62081cf6bf73af0030d904d6ddac578557e300a88c1c8cb0282010100d3629ada4d7b10586109e9ecd4ebe6aea2acecf7cbc6e54060b3db6626ece47f9bcce224d4c5e9c72cefb7a510bd1244de7fcbe705dce24181f0405334cad196c69fefbd86764b48bc294233c9b49cdaedf335344f60ef36b205a2664b3e42ae9c48861d84769b937e9e8e55d3c6553535638cc8b900ba2afe8ec737d2fcaaca43adaec83f03fa38d0ed7045aba008a414ed1b74e02b386351e8cfe7d2ab87b869d383d147b2c686287df2b5719053b587302769edaf67478db00fcf59887c93eeca30745b60fa91d40c41927a37319b44c699ebe2f40ecc6b6a772e5684e2062ab66b20889c5c30833f087af0ef58d5dc58f6d2b1303f8031afd111899aeac70282010072c66856f81036f0cbd93a931e1e73f3ab7d46fd79bb26ccaacaa53f88f384833cfc45870860f988d4678fe226480e617b6991bf46a013d456fa94ebc8711e8f035cb40beda41c6ebec27bdaf4acf80e1367a45cdb68c012cb0358fd264f4978257ca00c25253be40b7f231f43b724aa025e2754e23b334dbb731fdb14466d20a5ed02c26897ece7d1b04d7a3f58a293c56fc7d00d629becfd0d2f0229e0e1886943a5c537337ca32ceafc0fe2d71badc004fe37fd3770b0992c7ea1d4136a157781de5b6cad87b71eff74bf2ad94e8e7233316280b6243537b34bce185981500999809411f81ce5944c1a2317ca09253b6e6ef8542d542aee1d8a47bd0ad4190282010100839acfa382e91b4bd60ce67bfdc48d82d86be8778f5c83c0a5aa839e693db1dba1c734783b35a28ad234b60ea1795fa86cc5cfa01cb08a32caeb4065d55cee2c163e8d49942259b53e57a723aa1b9a5809071c7b1378a8ab4a21dd8d00a766c243618b9a7054b0fd51756a9df9013727d00b9a5af822b4094f9af94f8d1258c2cbc4a59eccbc1e723e351b57219a84cbaec7e81962d3ed4c4c50f0e9b276ca3d1acfbcc82516871be67db3d320f66dd494820d0a088b4f5530fb8b4d158b4a35fdac321bebb6994ce4c2862163a17668b386dd1d0c17376245e93f7dd045414af35261045ee23e2463bfc9cade4b2338142e638bd4631853ddcaeacd716eabf8";
//0808
//const genkey = require("./scripts/genkey");

//0808

class Client {
    // TODO
    constructor(hostname) {
        this.hostname = hostname;
        this.listeners = {};
    }


    on = (type, listener) => {
        this.listeners[type] = listener;
    };

    connect = () => {
        // TODO
        this.client = new WebSocketClient();
        this.client.on("connectFailed", error => {
            utils.log("Client", "Connection Error: " + error.toString());
        });
        this.client.on("connect", this._onConnect);
        this.client.connect(this.hostname, "dnext-chain");
    };
    //_onConnect: 리스너
    _onConnect = connection => {
        // TODO
        utils.log("Client", "Connected (" + connection.remoteAddress + ")");
        connection.on("error", (error) => {
            utils.log("Client", "Error: " + error.toString());
        });
        connection.on("close", () => {
            utils.log("Client", "Connection closed");
        });
        connection.on("message", this._onMessage);



        this.connection = connection;
        if (this.listeners["connected"]) {
            this.listeners["connected"](connection);
        }

    };


/*out
    _sendMessage = connection => {
        const data = {
            publicKey: PubKey,
            cipher: this._encrypt("Hello")
        };
        connection.sendUTF(JSON.stringify(data))
    };

    _encrypt = plain => {
        // TODO

        const key = new NodeRSA();
        const text=plain;
        //const publicKey = Buffer.from(data.publicKey, "hex");
        const privateKey = Buffer.from(PrivKey, "hex");
        key.importKey(privateKey, "pkcs1-private-der");
        const encrypted = key.encryptPrivate(Buffer.from(text, "utf8"));
        //console.log('encrypted: ', encrypted);
        //const decrypted = key.decrypt(encrypted, 'utf8');
        //console.log('decrypted: ', decrypted);
        return encrypted.toString("hex");
    };
out*/


/*out3
    _sendMessage = connection => {
        const data = {
            publicKey: PubKey,
            plain: "Hello",
            signature: this._sign("Hello")
        };
        connection.sendUTF(JSON.stringify(data))
    };

 out3*/



    sendMessage = (type, value) => {
        if (this.connection && this.connection.connected) {
            const data = {
                type: type,
                value: value
            };
            this.connection.sendUTF(JSON.stringify(data));
            utils.log("Client", "Sent: " + JSON.stringify(data) + " to " +
                this.connection.remoteAddress);
        }
    };
    _sign = plain => {
        const key = new NodeRSA();
        const privateKey = Buffer.from(PrivKey, "hex");
        key.importKey(privateKey, "pkcs1-private-der");

        // TODO
        /*key.sign(buffer, [encoding], [source_encoding]);*/
        const text=plain;
        //const publicKey = Buffer.from(data.publicKey, "hex");

        //const encrypted = key.encryptPrivate(Buffer.from(text, "utf8"));
        const signiture=key.sign(Buffer.from(plain, "utf8"));
        return signiture.toString("hex");
    };


/*out2
    //_onMessage : 리스너
    _onMessage = message => {
        // TODO
        const msg = JSON.parse(message.utf8Data);
        utils.log("Client", "Received: " + msg);

    };

 out2*/

    _onMessage = message => {
        const data = JSON.parse(message.utf8Data);
        utils.log("Client", "Received: " + message.utf8Data);
        if (this.listeners[data.type]) {
            this.listeners[data.type](this.connection, data.value);
        }
    };


}


module.exports = Client;
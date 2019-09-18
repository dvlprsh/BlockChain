const Hashes = require("jshashes");
const NodeRSA = require("node-rsa");

const Input = require("./Input");
const Output = require("./Output");
const Script = require("../tx/Script");
const ScriptRunner = require("./ScriptRunner");
const utils = require("../utils");

class Tx {
    static from(object) {
        const inputs = [];
        for (const input of object.inputs) {
            inputs.push(Input.from(input));
        }
        const outputs = [];
        for (const output of object.outputs) {
            outputs.push(Output.from(output));
        }
        return new Tx(inputs, outputs);
    }

    constructor(inputs = [], outputs = []) {
        this.inputs = inputs;
        this.outputs = outputs;
    }

    toHex() {
        let data = "";
        for (const input of this.inputs) {
            data += input.toHex();
        }
        for (const output of this.outputs) {
            data += output.toHex();
        }
        return data;
    }

    hash() {
        return new Hashes.SHA256().hex(this.toHex());
    }

    validate(memPool) {

        const txs=memPool.getTxs();
        for (const input of this.inputs) {
            // TODO: find utxo in memPool
            // TODO: run scripts




        }
        return true;
    }

    sign(privateKey) {
        const key = new NodeRSA();
        key.importKey(Buffer.from(privateKey, "hex"), "pkcs1-private-der");

        const rawTransaction = this.toHex();
        const signature = key.sign(Buffer.from(rawTransaction, "hex")).toString("hex");
        const publicKey = key.exportKey("pkcs8-public-der").toString("hex");
        for (const input of this.inputs) {
            input.script.values.push(signature);
            input.script.values.push(publicKey);
        }
        return signature;
    }

    static createCoinbase(publicKey) {
        const input = new Input(
            "0000000000000000000000000000000000000000000000000000000000000000",
            -1,
            new Script()
        );
        const pubKeyHash = new Hashes.RMD160().hex(new Hashes.SHA256().hex(publicKey));
        const script = new Script([
            Script.OP_DUP,
            Script.OP_HASH160,
            pubKeyHash,
            Script.OP_EQUALVERIFY,
            Script.OP_CHECKSIG
        ]);
        const output = new Output(50 * 10 ** 8, script);
        const tx = new Tx([input], [output]);
        return tx;
    }



}


//


//

module.exports = Tx;
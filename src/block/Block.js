const Hashes = require("jshashes");
const utils = require("../utils");
const Tx=require("../tx/Tx");
class Block {
    static from(object) {
        const txs = [];
        for (const tx of object.txs) {
            txs.push(Tx.from(tx));
        }
        return new Block(object.prevHash, object.merkleRoot,
            object.difficulty, object.timestamp, object.nonce, txs);
    }

//논스 ==> 4byte
    constructor(prevHash, merkleRoot, difficulty, timestamp, nonce = 0, txs = []){
        this.prevHash = prevHash;
        this.merkleRoot = merkleRoot;
        this.difficulty = difficulty;
        this.timestamp = timestamp;
        this.nonce = nonce;
        this.txs = txs;
    };


    header(){
        return new Block(
            this.prevHash,
            this.merkleRoot,
            this.difficulty,
            this.timestamp,
            this.nonce
        );
    } ;
    toHex() {
        let data = "";
        data += this.prevHash;
        data += this.merkleRoot;
        data += this.difficulty;
        data += utils.toHex(this.timestamp, 8);
        data += utils.toHex(this.nonce, 8);

        return data;
    } ;
    hash() {
        return new Hashes.SHA256().hex(this.toHex());
    };
    pow() {
        const difficulty = Buffer.from(this.difficulty, "hex");
        for (let i = 0; i <= 2 ** 32 - 1; i++) {
            let data = "";
            data += this.prevHash;
            data += this.merkleRoot;
            data += this.difficulty;
            data += utils.toHex(this.timestamp, 8);
            data += utils.toHex(i, 8);
            const hash = new Hashes.SHA256().hex(data);
            if (Buffer.from(hash, "hex").compare(difficulty) < 0) {
                this.nonce = i;
                return i;
            }
        }
    };
    validate() {
        const hash = this.hash();
        const difficulty = Buffer.from(this.difficulty, "hex");
        return Buffer.from(hash, "hex").compare(difficulty) < 0; // TODO: validate txs
    } ;
}

module.exports = Block;
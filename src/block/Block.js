const Hashes = require("jshashes");
const utils = require("../utils");
const Tx=require("../tx/Tx");
const MerkleTree = require('@garbados/merkle-tree');
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
    //코인베이스 검증은 output이 포맷에 맞는지를 확인해야함
    //코인베이스 input은 항상 0이기 때문


    //코인베이스 검증은 1. output이 하나인지 2. script가 존재하는지만 검증
    //머클트리 만들때 각각의 트랜젝션들을 16진수로 만들어줘야함
    validate(memPool) {
        const hash = this.hash();
        const difficulty = Buffer.from(this.difficulty, "hex");
        if (Buffer.from(hash, "hex").compare(difficulty) < 0) {
            // Verify Coinbase
            if (this.txs.length < 1) {
                console.log('txt test');
                return false;
            }
            const coinbase = this.txs[0];
            if (coinbase.outputs.length < 1) {
                console.log('coinbase.outputs.length : '+coinbase.outputs.length);
                return false;
            }
            const output = coinbase.outputs[0];
            if (output.amount !== 50 * 10 ** 8) {
                console.log('output.amount : '+output.amount);
                return false;
            }
            if (output.script.values.length < 1) {
                console.log('output.script.values.length : '+output.script.values.length);
                return false;
            }

            // Verify merkle root
            const txData = [];
            for (const tx of this.txs) {
                txData.push(Tx.from(tx).toHex());
            }
            const merkleTree = new MerkleTree("sha256", txData);
            console.log('Block. merkelroot test :'+merkleTree);
            console.log('Is equal merkle: '+merkleTree.root === this.merkleRoot);
            if (merkleTree.root !== this.merkleRoot) {
                return false;
            }

            // Verify txs
            for (let i = 0; i < this.txs.length; i++) {
                if (i === 0) {
                    continue;
                }
                const tx = this.txs[i];
                if (!tx.validate(memPool)){
                    return false;
                }
            }
            return true;
        } else {
            return false;
        }
    }

}

module.exports = Block;